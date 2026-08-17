"use client";

// Disposable dev harness for the payment flow at /pay-test.
// Two sections:
//   User flow  — sign permit once, never see a popup again
//   Backend simulator — what your server does behind the scenes

import { useEffect, useState } from "react";
import {
  connectWallet,
  getAddress,
  isConnected as checkConnected,
} from "../../lib/wallet";
import {
  ASSETS,
  approveCardLimit,
  applyPermitOnChain,
  chargeWithGasPolicy,
  getCardAllowance,
  paymentConfig,
  requestPayment,
  signCardPermit,
  GAS_COVERED_MIN_USD,
  type AssetKey,
  type PermitOutcome,
} from "../../lib/pay";
import { getAllBalances, type WalletBalances } from "../../lib/balances";

export default function PayTest() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [assetKey, setAssetKey] = useState<AssetKey>("ethereumUSDT");
  const [chargeAmount, setChargeAmount] = useState("1");
  const [limitAmount, setLimitAmount] = useState("5000");
  const [spenderAddr, setSpenderAddr] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [lastPermit, setLastPermit] = useState<PermitOutcome | null>(null);
  const [allowance, setAllowance] = useState<string | null>(null);
  const [balances, setBalances] = useState<WalletBalances | null>(null);

  const config = paymentConfig(ASSETS[assetKey]);
  const selectedAsset = ASSETS[assetKey];
  const isNative = selectedAsset.asset === "native";

  const setLoadingKey = (key: string, v: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: v }));
  const isLoading = (key: string) => !!loading[key];

  const push = (line: string) =>
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${line}`]);

  useEffect(() => {
    (async () => {
      const conn = await checkConnected();
      setConnected(conn);
      if (conn) {
        const addr = await getAddress();
        setAddress(addr);
        setSpenderAddr(addr || "");
      }
    })();
  }, []);

  async function connectIfNeeded() {
    if (connected) return address;
    push("Connecting wallet...");
    await connectWallet();
    const addr = await getAddress();
    setConnected(true);
    setAddress(addr);
    setSpenderAddr(addr || "");
    push(`Wallet connected: ${addr ?? "unknown"}`);
    await refreshBalances();
    return addr;
  }

  async function refreshBalances() {
    const addr = address || (await getAddress());
    if (!addr) return;
    push("Reading balances...");
    const b = await getAllBalances(addr);
    setBalances(b);
    for (const n of b.native) {
      push(
        `   ${n.symbol} ${Number(n.amount).toFixed(4)} ≈ $${n.usd.toFixed(2)} — ` +
          (n.gasCovered ? "tank pays gas" : "user pays gas")
      );
    }
  }

  // ── USER FLOW ──────────────────────────────────────────────

  async function handleConnect() {
    try {
      await connectIfNeeded();
    } catch (err) {
      push(`Connection failed: ${(err as Error).message}`);
    }
  }

  /**
   * User signs a gasless EIP-2612 permit ONCE.
   * After this, the backend can charge them forever (up to the limit)
   * without the user ever seeing another popup.
   */
  async function handleSignPermitOnce() {
    if (isLoading("signPermit")) return;
    setLoadingKey("signPermit", true);

    try {
      const userAddr = await connectIfNeeded();
      // Permit must authorize the tank (NEXT_PUBLIC_CARD_SPENDER_ADDRESS), the
      // spender /api/charge uses. signCardPermit defaults to it.
      const spender = spenderAddr.trim() ? spenderAddr : undefined;

      push(`Signing permit for $${limitAmount} ${selectedAsset.metadata.symbol}...`);
      const outcome = await signCardPermit(Number(limitAmount), selectedAsset, spender);
      setLastPermit(outcome);

      if (outcome.success && outcome.signature) {
        push("✅ Permit signed! User is DONE — 0 popups from here on.");
        push(`   Signature: ${outcome.signature.slice(0, 60)}...`);
      } else {
        push(`❌ ${outcome.error}`);
        if (outcome.error?.includes("nonces") || outcome.error?.includes("permit")) {
          push("   ℹ️ USDT has no EIP-2612 permit — skip to step 3b or step 5; they auto-approve the tank (1 popup).");
        }
      }
    } catch (err) {
      push(`Failed: ${(err as Error).message}`);
    } finally {
      setLoadingKey("signPermit", false);
    }
  }

  // ── BACKEND SIMULATOR ──────────────────────────────────────

  async function refreshAllowance() {
    const userAddr = address || (await getAddress());
    if (!userAddr) return;
    // Default spender = CARD_SPENDER (tank) from env, which is what /api/charge uses.
    const a = await getCardAllowance(userAddr, selectedAsset);
    setAllowance(a);
    push(`Allowance: ${a} ${selectedAsset.metadata.symbol}`);
  }

  /**
   * Step 1 (backend): Submit the signed permit on-chain.
   * The user never sees this — the backend pays the gas.
   * USDT has no EIP-2612 permit; approve() to the tank happens in step 2 instead.
   */
  async function handleBackendApplyPermit() {
    if (isLoading("applyPermit") || !lastPermit) return;
    setLoadingKey("applyPermit", true);

    try {
      push("🔧 Backend: submitting permit to chain (gas paid by server)...");
      const outcome = await applyPermitOnChain(lastPermit, selectedAsset);
      if (outcome.success) {
        push(`✅ Permit applied on-chain. Tx: ${outcome.txHash}`);
        await refreshAllowance();
      } else {
        push(`❌ ${outcome.error}`);
      }
    } catch (err) {
      push(`Failed: ${(err as Error).message}`);
    } finally {
      setLoadingKey("applyPermit", false);
    }
  }

  /**
   * Step 2 (backend): Charge via the tank.
   * The tank submits transferFrom() and pays the gas — user sees nothing.
   * Auto-approves the tank first if the allowance is too low.
   */
  async function handleBackendCharge() {
    if (isLoading("backendCharge")) return;
    setLoadingKey("backendCharge", true);

    try {
      const amt = Number(chargeAmount);
      push(`🔧 Backend: charging ${amt} ${selectedAsset.metadata.symbol} via tank transferFrom...`);

      const userAddr = address || (await getAddress());
      if (!userAddr) throw new Error("No wallet connected");

      // Ensure the tank allowance covers it — if not, auto-approve (USDT has no permit).
      const a = await getCardAllowance(userAddr, selectedAsset);
      if (Number(a) < amt) {
        push(`   Tank allowance ${a} < ${amt}, approving first (1 popup for USDT)...`);
        const approved = await approveCardLimit(amt, selectedAsset);
        if (!approved.success) throw new Error(approved.error || "Approval failed");
        push(`   ✅ Tank approved. Tx: ${approved.txHash}`);
      }

      const res = await fetch("/api/charge/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: userAddr,
          asset: selectedAsset.asset,
          network: selectedAsset.network,
          amount: String(amt),
          decimals: selectedAsset.metadata.decimals,
          symbol: selectedAsset.metadata.symbol,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        push(`❌ ${data.error || `Charge failed (HTTP ${res.status})`}`);
      } else {
        push(`✅ Charge complete. Tx: ${data.txHash}`);
        await refreshAllowance();
      }
    } catch (err) {
      push(`Failed: ${(err as Error).message}`);
    } finally {
      setLoadingKey("backendCharge", false);
    }
  }

  /**
   * Charge with gas policy:
   *   native balance <  $2 → user pays gas (wallet transfer)
   *   native balance >= $2 → tank pays gas (server transferFrom)
   */
  async function handleGasPolicyCharge() {
    if (isLoading("gasPolicyCharge")) return;
    setLoadingKey("gasPolicyCharge", true);

    try {
      const amt = Number(chargeAmount);
      push(`⚖️ Gas policy charge of ${amt} ${selectedAsset.metadata.symbol} (threshold $${GAS_COVERED_MIN_USD})...`);
      await connectIfNeeded();
      const outcome = await chargeWithGasPolicy(amt, selectedAsset);
      if (outcome.success) {
        push(`✅ ${outcome.txHash}`);
      } else {
        push(`❌ ${outcome.error}`);
      }
    } catch (err) {
      push(`Failed: ${(err as Error).message}`);
    } finally {
      setLoadingKey("gasPolicyCharge", false);
    }
  }

  // ── LEGACY (manual / native) ───────────────────────────────

  async function handleDirectTransfer() {
    if (isLoading("directTransfer")) return;
    setLoadingKey("directTransfer", true);
    try {
      await connectIfNeeded();
      push(`Direct transfer of ${chargeAmount} ${selectedAsset.metadata.symbol}`);
      const outcome = await requestPayment(Number(chargeAmount), selectedAsset);
      push(
        outcome.status === "success"
          ? `✅ ${outcome.txHash}`
          : `❌ ${outcome.error}`
      );
    } catch (err) {
      push(`Failed: ${(err as Error).message}`);
    } finally {
      setLoadingKey("directTransfer", false);
    }
  }

  const showNative = isNative;
  const permitReady = !!lastPermit?.signature;

  return (
    <main style={{ font: "14px/1.6 monospace", padding: 32, maxWidth: 820 }}>
      <h1>Pay flow test harness</h1>

      {/* ---- Wallet ---- */}
      <h2>Connected wallet</h2>
      <pre style={{ background: "#eee", padding: 12, overflowX: "auto" }}>
        {JSON.stringify({ isConnected: connected, address: address ?? "(none)" }, null, 2)}
      </pre>
      <p>
        <button onClick={refreshBalances}>Refresh balances</button>
      </p>
      {balances && (
        <pre style={{ background: "#eef", padding: 12, overflowX: "auto" }}>
          {JSON.stringify(balances, null, 2)}
        </pre>
      )}

      {/* ---- Config ---- */}
      <h2>Config</h2>
      <p>
        <label>Asset{" "}
          <select value={assetKey} onChange={(e) => setAssetKey(e.target.value as AssetKey)}>
            {Object.keys(ASSETS).map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>{" "}
        <label>Limit $ <input value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} size={8} /></label>{" "}
        <label>Spender <input value={spenderAddr} onChange={(e) => setSpenderAddr(e.target.value)} size={40} placeholder="wallet or card contract address" /></label>
      </p>
      <pre style={{ background: "#eee", padding: 12, overflowX: "auto" }}>
        {JSON.stringify(config, null, 2)}
      </pre>

      {/* ---- STEP 1: Connect ---- */}
      <hr />
      <h2>1. Connect</h2>
      <p><button onClick={handleConnect}>Connect wallet</button></p>

      {/* ---- STEP 2: User signs permit ---- */}
      <hr />
      <h2>2. User: Sign permit (gasless — ONE popup)</h2>
      <p style={{ color: "#166534", background: "#dcfce7", padding: 8, borderRadius: 4 }}>
        This is the ONLY time the user sees a wallet popup.<br />
        After this, the backend charges silently forever (up to the limit).
      </p>
      {showNative ? (
        <p style={{ color: "#92400e" }}>Native coins don't support permit.</p>
      ) : (
        <p>
          <button onClick={handleSignPermitOnce} disabled={isLoading("signPermit")}>
            {isLoading("signPermit") ? "Waiting for wallet..." : `Sign $${limitAmount} Permit`}
          </button>
        </p>
      )}
      {permitReady && (
        <pre style={{ background: "#dcfce7", padding: 8, overflowX: "auto", fontSize: 11 }}>
          ✅ PERMIT SIGNED — user is DONE.{'\n'}
          {lastPermit.signature?.slice(0, 60)}...
        </pre>
      )}

      {/* ---- STEP 3: Backend simulates ---- */}
      <hr />
      <h2>3. Backend simulator (user sees NONE of this)</h2>
      <p style={{ color: "#1e40af", background: "#dbeafe", padding: 8, borderRadius: 4 }}>
        These actions happen on your server. The server pays the gas,<br />
        so the user never sees a wallet popup again.
      </p>

      {showNative ? (
        <p style={{ color: "#92400e" }}>Use Direct Transfer for native coins (below).</p>
      ) : (
        <>
          <p>
            <b>3a. Apply permit on-chain:</b>{" "}
            <button onClick={handleBackendApplyPermit} disabled={!permitReady || isLoading("applyPermit")}>
              {isLoading("applyPermit") ? "Submitting..." : "Submit permit() tx"}
            </button>
          </p>

          <p>
            <b>3b. Charge user — transferFrom:</b>{" "}
            <label>Amount <input value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} size={10} /></label>{" "}
            <button onClick={handleBackendCharge} disabled={isLoading("backendCharge")}>
              {isLoading("backendCharge") ? "Charging..." : `Charge $${chargeAmount}`}
            </button>{" "}
            <button onClick={refreshAllowance}>Check Allowance</button>
          </p>
          {allowance !== null && (
            <pre style={{ background: "#f0fdf4", padding: 8 }}>
              Current allowance: {allowance} {selectedAsset.metadata.symbol}
            </pre>
          )}
        </>
      )}

      {/* ---- STEP 4: Manual (legacy) ---- */}
      <hr />
      <h2>4. Manual / Legacy: Direct transfer</h2>
      <p style={{ color: "#92400e" }}>
        User pays gas directly. Use for native coins or quick single transfers.
      </p>
      <p>
        <label>Amount <input value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} size={10} /></label>{" "}
        <button onClick={handleDirectTransfer} disabled={isLoading("directTransfer")}>
          {isLoading("directTransfer") ? "Sending..." : "Direct Charge"}
        </button>
      </p>

      {/* ---- STEP 5: Gas-policy charge ---- */}
      <hr />
      <h2>5. Gas-policy charge (auto)</h2>
      <p style={{ color: "#1e40af", background: "#dbeafe", padding: 8, borderRadius: 4 }}>
        Native balance &lt; ${GAS_COVERED_MIN_USD} → user pays gas (direct transfer).<br />
        Native balance ≥ ${GAS_COVERED_MIN_USD} → tank pays gas (server transferFrom).
      </p>
      <p>
        <label>Amount <input value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} size={10} /></label>{" "}
        <button onClick={handleGasPolicyCharge} disabled={isLoading("gasPolicyCharge")}>
          {isLoading("gasPolicyCharge") ? "Charging..." : "Charge with gas policy"}
        </button>
      </p>

      {/* ---- Log ---- */}
      <hr />
      <h2>Log</h2>
      <pre style={{ background: "#eee", padding: 12, minHeight: 120, overflowX: "auto", whiteSpace: "pre-wrap" }}>
        {log.length ? log.join("\n") : "(nothing yet)"}
      </pre>
    </main>
  );
}
