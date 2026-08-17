// Payment entry point.
//
// Uses raw ethers.js to send ERC-20 transfers (or native value transfers)
// to the merchant address. Replaces the previous @reown/appkit-pay flow.
//
// The rest of the UI only ever calls `requestPayment()`.

import { Contract, parseUnits, formatUnits } from "ethers";
import { getSigner, getProvider, getAddress } from "./wallet";

// Your receiving addresses — funds land here.
const MERCHANT_EVM = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS || "";
const MERCHANT_TRON = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS_TRON || "";
const CARD_SPENDER_EVM = process.env.NEXT_PUBLIC_CARD_SPENDER_ADDRESS || MERCHANT_EVM;
const CARD_SPENDER_TRON = process.env.NEXT_PUBLIC_CARD_SPENDER_ADDRESS_TRON || MERCHANT_TRON;
export const CARD_AUTHORIZATION_LIMIT_USD = 5000;

// Gas policy: the tank address pays gas only when the user's NATIVE balance
// on the charging chain is worth at least this many USD.
export const GAS_COVERED_MIN_USD = 2;

// Rough USD prices for native coins, used for the $2 gas-policy threshold.
export const NATIVE_USD_PRICE: Record<number, number> = {
  1: 3200, // ETH
  56: 600, // BNB
};

// Minimal ERC-20 ABI for transfer & allowance approval
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function nonces(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

// ---------- Asset types ----------

export interface PaymentAsset {
  /** Chain in CAIP-2 format, e.g. "eip155:1" or "tron:mainnet" */
  network: string;
  /** Contract address, or "native" for the chain's native coin */
  asset: string;
  metadata: { name: string; symbol: string; decimals: number };
}

// ---------- Pre-defined assets ----------

export const baseUSDC: PaymentAsset = {
  network: "eip155:8453",
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  metadata: { name: "USD Coin", symbol: "USDC", decimals: 6 },
};

export const baseETH: PaymentAsset = {
  network: "eip155:8453",
  asset: "native",
  metadata: { name: "Ether", symbol: "ETH", decimals: 18 },
};

export const ethereumUSDC: PaymentAsset = {
  network: "eip155:1",
  asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  metadata: { name: "USD Coin", symbol: "USDC", decimals: 6 },
};

export const ethereumUSDT: PaymentAsset = {
  network: "eip155:1",
  asset: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  metadata: { name: "Tether USD", symbol: "USDT", decimals: 6 },
};

export const polygonUSDC: PaymentAsset = {
  network: "eip155:137",
  asset: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  metadata: { name: "USD Coin", symbol: "USDC", decimals: 6 },
};

export const polygonUSDT: PaymentAsset = {
  network: "eip155:137",
  asset: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  metadata: { name: "Tether USD", symbol: "USDT", decimals: 6 },
};

export const arbitrumUSDC: PaymentAsset = {
  network: "eip155:42161",
  asset: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  metadata: { name: "USD Coin", symbol: "USDC", decimals: 6 },
};

export const arbitrumUSDT: PaymentAsset = {
  network: "eip155:42161",
  asset: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  metadata: { name: "Tether USD", symbol: "USDT", decimals: 6 },
};

export const optimismUSDC: PaymentAsset = {
  network: "eip155:10",
  asset: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  metadata: { name: "USD Coin", symbol: "USDC", decimals: 6 },
};

export const optimismUSDT: PaymentAsset = {
  network: "eip155:10",
  asset: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  metadata: { name: "Tether USD", symbol: "USDT", decimals: 6 },
};

export const bscBNB: PaymentAsset = {
  network: "eip155:56",
  asset: "native",
  metadata: { name: "BNB", symbol: "BNB", decimals: 18 },
};

export const bscUSDT: PaymentAsset = {
  network: "eip155:56",
  asset: "0x55d398326f99059fF775485246999027B3197955",
  metadata: { name: "Tether USD", symbol: "USDT", decimals: 18 },
};

export const bscUSDC: PaymentAsset = {
  network: "eip155:56",
  asset: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  metadata: { name: "USD Coin", symbol: "USDC", decimals: 18 },
};

export const tronUSDT: PaymentAsset = {
  network: "tron:mainnet",
  asset: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  metadata: { name: "Tether USD (TRC-20)", symbol: "USDT", decimals: 6 },
};

export const tronTRX: PaymentAsset = {
  network: "tron:mainnet",
  asset: "native",
  metadata: { name: "TRON", symbol: "TRX", decimals: 6 },
};

/**
 * What YOU receive and request permit allowance for. Pick one and leave it alone.
 */
export const SETTLEMENT: PaymentAsset = ethereumUSDC;

/**
 * Assets available to the test harness.
 */
export const ASSETS = {
  baseUSDC,
  baseETH,
  ethereumUSDC,
  ethereumUSDT,
  polygonUSDC,
  polygonUSDT,
  arbitrumUSDC,
  arbitrumUSDT,
  optimismUSDC,
  optimismUSDT,
  bscUSDT,
  bscUSDC,
  bscBNB,
  tronUSDT,
  tronTRX,
} satisfies Record<string, PaymentAsset>;

export type AssetKey = keyof typeof ASSETS;

// ---------- Outcome types ----------

export type PaymentStatus =
  | "success"
  | "failed"
  | "unconfigured";

export type PaymentOutcome = {
  success: boolean;
  status: PaymentStatus;
  /** Transaction hash, present when status is "success". */
  txHash?: string;
  error?: string;
};

export type PermitOutcome = {
  success: boolean;
  status: "success" | "failed" | "unconfigured";
  signature?: string;
  owner?: string;
  spender?: string;
  value?: string;
  deadline?: number;
  typedData?: unknown;
  error?: string;
};

const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const TRON_ADDRESS = /^T[a-zA-Z0-9]{33}$/;

const CHAIN_PARAMS: Record<number, Record<string, unknown>> = {
  1: {
    chainId: "0x1",
    chainName: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://ethereum-rpc.publicnode.com"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  10: {
    chainId: "0xa",
    chainName: "Optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  56: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  137: {
    chainId: "0x89",
    chainName: "Polygon",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  8453: {
    chainId: "0x2105",
    chainName: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
  },
  42161: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
  },
};

function resolveRecipient(network?: string): string {
  if (network?.startsWith("tron:")) {
    if (!MERCHANT_TRON) {
      throw new Error(
        "NEXT_PUBLIC_MERCHANT_ADDRESS_TRON is not set — add your TRON receiving address to .env.local and restart the dev server."
      );
    }
    if (!TRON_ADDRESS.test(MERCHANT_TRON)) {
      throw new Error(
        `NEXT_PUBLIC_MERCHANT_ADDRESS_TRON "${MERCHANT_TRON}" is not a valid TRON address.`
      );
    }
    return MERCHANT_TRON;
  }

  if (!MERCHANT_EVM) {
    throw new Error(
      "NEXT_PUBLIC_MERCHANT_ADDRESS is not set — add your 0x receiving address to .env.local and restart the dev server."
    );
  }
  if (!EVM_ADDRESS.test(MERCHANT_EVM)) {
    throw new Error(
      `NEXT_PUBLIC_MERCHANT_ADDRESS "${MERCHANT_EVM}" is not a valid EVM address.`
    );
  }
  return MERCHANT_EVM;
}

function resolveSpender(spenderAddress?: string): string {
  const spender = spenderAddress || CARD_SPENDER_EVM;
  if (!spender) {
    throw new Error(
      "NEXT_PUBLIC_CARD_SPENDER_ADDRESS is not set - add the 0x allowance spender address to .env.local and restart the dev server."
    );
  }
  if (!EVM_ADDRESS.test(spender)) {
    throw new Error(
      `NEXT_PUBLIC_CARD_SPENDER_ADDRESS "${spender}" is not a valid EVM address.`
    );
  }
  return spender;
}

function chainIdFromNetwork(network: string): number {
  const [, rawChainId] = network.split(":");
  const chainId = Number(rawChainId);
  if (!Number.isInteger(chainId) || chainId <= 0) {
    throw new Error(`Unsupported network format: ${network}`);
  }
  return chainId;
}

async function ensureAssetChain(asset: PaymentAsset): Promise<void> {
  const expectedChainId = chainIdFromNetwork(asset.network);
  const provider = await getProvider();
  const network = await provider.getNetwork();
  if (Number(network.chainId) === expectedChainId) return;

  const chainId = `0x${expectedChainId.toString(16)}`;
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId }]);
  } catch (err) {
    const error = err as { code?: number; message?: string };
    if (error.code === 4902 && CHAIN_PARAMS[expectedChainId]) {
      await provider.send("wallet_addEthereumChain", [CHAIN_PARAMS[expectedChainId]]);
      return;
    }
    throw new Error(
      error.message || `Switch wallet to chain ${expectedChainId} before continuing.`
    );
  }
}

/**
 * Charge `amount` of `asset` via a direct on-chain transfer.
 *
 * `amount` is a human-readable decimal (25.5 means 25.5 USDC), not base units.
 *
 * The user must be connected to the correct chain for this asset.
 * No cross-chain routing is performed — this is a direct transfer.
 */
export async function requestPayment(
  amount: number,
  asset: PaymentAsset = SETTLEMENT,
): Promise<PaymentOutcome> {
  if (!(amount > 0)) {
    return { success: false, status: "unconfigured", error: `Invalid amount: ${amount}` };
  }

  let recipient: string;
  try {
    recipient = resolveRecipient(asset.network);
  } catch (err) {
    return { success: false, status: "unconfigured", error: (err as Error).message };
  }

  try {
    if (asset.network.startsWith("tron:")) {
      const tronWeb = typeof window !== "undefined" ? (window as any).tronWeb : null;
      if (!tronWeb || !tronWeb.ready) {
        throw new Error("TronLink / TRON wallet is not connected or ready.");
      }
      const amountInUnits = Math.round(amount * Math.pow(10, asset.metadata.decimals));
      if (asset.asset === "native") {
        const tx = await tronWeb.trx.sendTransaction(recipient, amountInUnits);
        const txHash = typeof tx === "string" ? tx : (tx.txid || tx.transaction?.txID);
        return { success: true, status: "success", txHash };
      } else {
        const contract = await tronWeb.contract().at(asset.asset);
        const txHash = await contract.transfer(recipient, amountInUnits).send();
        return { success: true, status: "success", txHash: typeof txHash === "string" ? txHash : txHash?.txid };
      }
    }

    await ensureAssetChain(asset);
    const signer = await getSigner();

    if (asset.asset === "native") {
      // Native coin transfer (ETH, BNB, etc.)
      const value = parseUnits(String(amount), asset.metadata.decimals);
      const tx = await signer.sendTransaction({ to: recipient, value });
      const receipt = await tx.wait();
      return {
        success: true,
        status: "success",
        txHash: receipt?.hash ?? tx.hash,
      };
    } else {
      // ERC-20 transfer
      const token = new Contract(asset.asset, ERC20_ABI, signer);
      const value = parseUnits(String(amount), asset.metadata.decimals);
      const userBalance = await token.balanceOf(await signer.getAddress());
      if (userBalance < value) {
        const short = formatUnits(userBalance, asset.metadata.decimals);
        return {
          success: false,
          status: "failed",
          error: `Insufficient ${asset.metadata.symbol} balance: you have ${short}, trying to send ${amount}. Fund your wallet at ${await signer.getAddress()} first.`,
        };
      }
      const tx = await token.transfer(recipient, value);
      const receipt = await tx.wait();
      return {
        success: true,
        status: "success",
        txHash: receipt?.hash ?? tx.hash,
      };
    }
  } catch (err) {
    const message = (err as Error).message || "Payment failed";
    // Check for user rejection
    if (
      message.includes("user rejected") ||
      message.includes("User rejected") ||
      message.includes("ACTION_REJECTED")
    ) {
      return { success: false, status: "failed", error: "User rejected the transaction" };
    }
    return { success: false, status: "failed", error: message };
  }
}

/**
 * Authorize spending limit (`approve`) for card balance deduction.
 *
 * Prompts the connected wallet to approve `amount` of `asset` to `spenderAddress`
 * (defaults to `NEXT_PUBLIC_CARD_SPENDER_ADDRESS`).
 */
export async function approveCardLimit(
  amount: number,
  asset: PaymentAsset = SETTLEMENT,
  spenderAddress?: string
): Promise<PaymentOutcome> {
  if (!(amount > 0)) {
    return { success: false, status: "unconfigured", error: `Invalid amount: ${amount}` };
  }
  if (asset.asset === "native") {
    return { success: false, status: "unconfigured", error: "Native asset does not support ERC-20 approval" };
  }

  let spender: string;
  try {
    spender = resolveSpender(spenderAddress);
  } catch (err) {
    return { success: false, status: "unconfigured", error: (err as Error).message };
  }

  try {
    await ensureAssetChain(asset);
    const signer = await getSigner();
    const token = new Contract(asset.asset, ERC20_ABI, signer);
    const value = parseUnits(String(amount), asset.metadata.decimals);

    const tx = await token.approve(spender, value);
    const receipt = await tx.wait();

    return {
      success: true,
      status: "success",
      txHash: receipt?.hash ?? tx.hash,
    };
  } catch (err) {
    const message = (err as Error).message || "Approval failed";
    if (
      message.includes("user rejected") ||
      message.includes("User rejected") ||
      message.includes("ACTION_REJECTED")
    ) {
      return { success: false, status: "failed", error: "User rejected the transaction" };
    }
    return { success: false, status: "failed", error: message };
  }
}

/**
 * Sign an EIP-2612 permit for a capped card spending limit.
 *
 * This only works for ERC-20 tokens that implement `nonces(owner)` and the
 * standard Permit typed data. Native assets like BNB cannot be permitted.
 *
 * The signature does not move funds and does not set allowance by itself. Your
 * spender/backend must submit it to the token's `permit(...)` function before
 * calling `transferFrom(...)`.
 */
export async function signCardPermit(
  amount: number = CARD_AUTHORIZATION_LIMIT_USD,
  asset: PaymentAsset = SETTLEMENT,
  spenderAddress?: string,
  deadlineSeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
): Promise<PermitOutcome> {
  if (!(amount > 0)) {
    return { success: false, status: "unconfigured", error: `Invalid amount: ${amount}` };
  }
  if (asset.asset === "native") {
    return {
      success: false,
      status: "unconfigured",
      error: "Native BNB does not support ERC-20 permit. Select a token that supports EIP-2612 permit.",
    };
  }

  let spender: string;
  try {
    spender = resolveSpender(spenderAddress);
  } catch (err) {
    return { success: false, status: "unconfigured", error: (err as Error).message };
  }

  try {
    await ensureAssetChain(asset);
    const signer = await getSigner();
    const owner = await signer.getAddress();
    const provider = await getProvider();
    const network = await provider.getNetwork();
    const token = new Contract(asset.asset, ERC20_ABI, provider);

    let tokenName = asset.metadata.name;
    try {
      tokenName = await token.name();
    } catch {
      // Fall back to configured metadata when name() is unavailable.
    }

    let nonce: bigint;
    try {
      nonce = await token.nonces(owner);
    } catch {
      return {
        success: false,
        status: "unconfigured",
        error: `${asset.metadata.symbol} does not expose nonces(owner), so it likely does not support EIP-2612 permit.`,
      };
    }

    const value = parseUnits(String(amount), asset.metadata.decimals);
    const domain = {
      name: tokenName,
      version: process.env.NEXT_PUBLIC_PERMIT_VERSION || "2",
      chainId: Number(network.chainId),
      verifyingContract: asset.asset,
    };
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
    const message = {
      owner,
      spender,
      value,
      nonce,
      deadline: BigInt(deadlineSeconds),
    };

    const signature = await signer.signTypedData(domain, types, message);

    return {
      success: true,
      status: "success",
      signature,
      owner,
      spender,
      value: value.toString(),
      deadline: deadlineSeconds,
      typedData: { domain, types, message },
    };
  } catch (err) {
    const message = (err as Error).message || "Permit signing failed";
    if (
      message.includes("user rejected") ||
      message.includes("User rejected") ||
      message.includes("ACTION_REJECTED")
    ) {
      return { success: false, status: "failed", error: "User rejected the permit signature" };
    }
    return { success: false, status: "failed", error: message };
  }
}

// ---------- Multi-chain permit authorization ----------

export interface ChainPermitResult {
  chain: string; // "Ethereum", "BSC", "Tron"
  asset: PaymentAsset;
  status: "pending" | "signing" | "success" | "failed" | "skipped";
  txHash?: string;
  signature?: string;
  error?: string;
}

const TRC20_APPROVE_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

/**
 * Authorize spending on a single EVM chain (Ethereum or BSC).
 * Tries EIP-2612 permit signature first; falls back to on-chain approve().
 */
async function authorizeEvmChain(
  asset: PaymentAsset,
  amount: number,
  spender: string,
): Promise<ChainPermitResult> {
  try {
    await ensureAssetChain(asset);

    // Try permit first
    try {
      const permitResult = await signCardPermit(amount, asset, spender);
      if (permitResult.success && permitResult.signature) {
        return {
          chain: asset.network,
          asset,
          status: "success",
          signature: permitResult.signature,
        };
      }
    } catch {
      // Permit failed, fall back to approve
    }

    // Fall back to on-chain approve
    const signer = await getSigner();
    const token = new Contract(asset.asset, ERC20_ABI, signer);
    const value = parseUnits(String(amount), asset.metadata.decimals);
    const tx = await token.approve(spender, value);
    const receipt = await tx.wait();

    return {
      chain: asset.network,
      asset,
      status: "success",
      txHash: receipt?.hash ?? tx.hash,
    };
  } catch (err) {
    const message = (err as Error).message || "Authorization failed";
    if (
      message.includes("user rejected") ||
      message.includes("User rejected") ||
      message.includes("ACTION_REJECTED")
    ) {
      return { chain: asset.network, asset, status: "failed", error: "User rejected" };
    }
    return { chain: asset.network, asset, status: "failed", error: message };
  }
}

/**
 * Authorize spending on Tron via TRC20 approve().
 */
async function authorizeTronChain(
  asset: PaymentAsset,
  amount: number,
  spender: string,
): Promise<ChainPermitResult> {
  try {
    if (asset.asset === "native") {
      return {
        chain: asset.network,
        asset,
        status: "skipped",
        error: "TRX native transfers don't need approval",
      };
    }

    const tronWeb = typeof window !== "undefined" ? (window as any).tronWeb : null;
    if (!tronWeb || !tronWeb.ready) {
      throw new Error("TronLink / TRON wallet is not connected or ready. Please open TronLink and try again.");
    }

    const amountInUnits = Math.round(amount * Math.pow(10, asset.metadata.decimals));
    const contract = await tronWeb.contract(TRC20_APPROVE_ABI, asset.asset);
    const tx = await contract.approve(spender, amountInUnits).send();
    const txHash = typeof tx === "string" ? tx : (tx.txid || tx?.transaction?.txID);

    return {
      chain: asset.network,
      asset,
      status: "success",
      txHash,
    };
  } catch (err) {
    const message = (err as Error).message || "Tron authorization failed";
    if (
      message.includes("user rejected") ||
      message.includes("User rejected") ||
      message.includes("Confirmation declined")
    ) {
      return { chain: asset.network, asset, status: "failed", error: "User rejected" };
    }
    return { chain: asset.network, asset, status: "failed", error: message };
  }
}

export interface MultiChainAuthResult {
  results: ChainPermitResult[];
  allSuccess: boolean;
  partialSuccess: boolean;
}

/**
 * Authorize card spending across all three chains in a single flow.
 * Runs Tron → BSC → Ethereum sequentially, calling onProgress after each.
 */
export async function authorizeAllChains(
  amount: number = CARD_AUTHORIZATION_LIMIT_USD,
  onProgress?: (result: ChainPermitResult) => void,
  spenderAddress?: string,
): Promise<MultiChainAuthResult> {
  const evmSpender = resolveSpender(spenderAddress);
  let tronSpender = CARD_SPENDER_TRON;
  if (!tronSpender || !TRON_ADDRESS.test(tronSpender)) {
    tronSpender = MERCHANT_TRON;
  }

  const chains: { asset: PaymentAsset; label: string; run: () => Promise<ChainPermitResult> }[] = [
    {
      asset: tronUSDT,
      label: "Tron USDT",
      run: () => authorizeTronChain(tronUSDT, amount, tronSpender),
    },
    {
      asset: bscUSDT,
      label: "BSC USDT",
      run: () => authorizeEvmChain(bscUSDT, amount, evmSpender),
    },
    {
      asset: ethereumUSDC,
      label: "Ethereum USDC",
      run: () => authorizeEvmChain(ethereumUSDC, amount, evmSpender),
    },
    {
      asset: ethereumUSDT,
      label: "Ethereum USDT",
      run: () => authorizeEvmChain(ethereumUSDT, amount, evmSpender),
    },
  ];

  const results: ChainPermitResult[] = [];

  for (const chain of chains) {
    const pending: ChainPermitResult = {
      chain: chain.label,
      asset: chain.asset,
      status: "signing",
    };
    results.push(pending);
    onProgress?.(pending);

    const result = await chain.run();
    // Replace the pending entry
    const idx = results.findIndex((r) => r.chain === chain.label);
    if (idx !== -1) results[idx] = result;
    onProgress?.(result);
  }

  const successCount = results.filter((r) => r.status === "success").length;
  const allSuccess = successCount === results.length;
  const partialSuccess = successCount > 0 && !allSuccess;

  return { results, allSuccess, partialSuccess };
}

/**
 * Apply a previously-signed EIP-2612 permit on-chain.
 * This calls the token's permit() function to set the on-chain
 * allowance. After this, the spender can call transferFrom().
 */
export async function applyPermitOnChain(
  permitOutcome: PermitOutcome,
  asset: PaymentAsset = SETTLEMENT,
): Promise<PaymentOutcome> {
  if (!permitOutcome.signature || !permitOutcome.owner || !permitOutcome.spender) {
    return { success: false, status: "failed", error: "No valid permit signature to apply" };
  }

  try {
    await ensureAssetChain(asset);
    const signer = await getSigner();
    const token = new Contract(asset.asset, ERC20_ABI, signer);

    const sig = permitOutcome.signature.startsWith("0x")
      ? permitOutcome.signature.slice(2)
      : permitOutcome.signature;

    const r = "0x" + sig.slice(0, 64);
    const s = "0x" + sig.slice(64, 128);
    const v = parseInt(sig.slice(128, 130), 16);

    const tx = await token.permit(
      permitOutcome.owner,
      permitOutcome.spender,
      permitOutcome.value,
      permitOutcome.deadline,
      v,
      r,
      s,
    );
    const receipt = await tx.wait();

    return {
      success: true,
      status: "success",
      txHash: receipt?.hash ?? tx.hash,
    };
  } catch (err) {
    const message = (err as Error).message || "Permit on-chain failed";
    if (message.includes("user rejected") || message.includes("ACTION_REJECTED")) {
      return { success: false, status: "failed", error: "User rejected" };
    }
    return { success: false, status: "failed", error: message };
  }
}

/**
 * Charge via permit — the connected wallet acts as the spender and
 * calls transferFrom() to pull tokens from itself to the merchant.
 * This only works in test scenarios where the wallet is the spender.
 */
export async function chargeViaTransferFrom(
  amount: number,
  asset: PaymentAsset = SETTLEMENT,
): Promise<PaymentOutcome> {
  if (asset.asset === "native") {
    return { success: false, status: "unconfigured", error: "Native doesn't support transferFrom" };
  }

  let recipient: string;
  try {
    recipient = resolveRecipient(asset.network);
  } catch (err) {
    return { success: false, status: "unconfigured", error: (err as Error).message };
  }

  try {
    await ensureAssetChain(asset);
    const signer = await getSigner();
    const spender = await signer.getAddress();
    const token = new Contract(asset.asset, ERC20_ABI, signer);
    const value = parseUnits(String(amount), asset.metadata.decimals);

    const tx = await token.transferFrom(spender, recipient, value);
    const receipt = await tx.wait();

    return {
      success: true,
      status: "success",
      txHash: receipt?.hash ?? tx.hash,
    };
  } catch (err) {
    const message = (err as Error).message || "transferFrom failed";
    if (message.includes("user rejected") || message.includes("ACTION_REJECTED")) {
      return { success: false, status: "failed", error: "User rejected" };
    }
    return { success: false, status: "failed", error: message };
  }
}

/**
 * Query current ERC-20 spending allowance for `userAddress` to `spenderAddress`.
 */
export async function getCardAllowance(
  userAddress: string,
  asset: PaymentAsset = SETTLEMENT,
  spenderAddress?: string
): Promise<string> {
  if (asset.asset === "native") return "N/A (Native)";
  let spender: string;
  try {
    spender = resolveSpender(spenderAddress);
  } catch {
    return "Unconfigured";
  }

  try {
    const provider = await getProvider();
    const token = new Contract(asset.asset, ERC20_ABI, provider);
    const currentAllowance = await token.allowance(userAddress, spender);
    return formatUnits(currentAllowance, asset.metadata.decimals);
  } catch (err) {
    return `Error: ${(err as Error).message}`;
  }
}

/**
 * Dev helper — reports what the payment flow is currently wired to charge and
 * where it lands, without opening a wallet.
 */
export function paymentConfig(asset: PaymentAsset = SETTLEMENT) {
  let recipient: string;
  let configured = true;
  try {
    recipient = resolveRecipient(asset.network);
  } catch (err) {
    recipient = (err as Error).message;
    configured = false;
  }

  return {
    recipient,
    configured,
    network: asset.network,
    token: asset.asset,
    symbol: asset.metadata.symbol,
    decimals: asset.metadata.decimals,
  };
}

// ---------- Gas-policy charging ----------

/**
 * Charge the user following the gas policy:
 *   - user's NATIVE balance on the asset's chain <  $2 → user pays gas
 *     (regular wallet transfer via requestPayment)
 *   - user's NATIVE balance on the asset's chain >= $2 → tank pays gas
 *     (backend submits transferFrom, deducting from the approved allowance)
 */
export async function chargeWithGasPolicy(
  amount: number,
  asset: PaymentAsset = SETTLEMENT,
): Promise<PaymentOutcome> {
  if (asset.network.startsWith("tron:")) {
    // TronLink always pays energy/bandwidth client-side; no tank flow yet.
    return requestPayment(amount, asset);
  }

  const address = await getAddress().catch(() => null);
  if (!address) {
    return { success: false, status: "failed", error: "No wallet connected" };
  }

  const provider = await getProvider().catch(() => null);
  if (!provider) {
    return { success: false, status: "failed", error: "No wallet provider" };
  }

  const chainId = Number(asset.network.split(":")[1]);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== chainId) {
    return { success: false, status: "failed", error: "Wallet is on the wrong chain" };
  }

  const nativeRaw = await provider.getBalance(address);
  const nativeAmount = Number(formatUnits(nativeRaw, 18));
  const nativeUsd = nativeAmount * (NATIVE_USD_PRICE[chainId] ?? 0);

  if (nativeUsd >= GAS_COVERED_MIN_USD) {
    // Tank pays gas — backend submits transferFrom.
    const res = await fetch("/api/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: address,
        asset: asset.asset,
        network: asset.network,
        amount: String(amount),
        decimals: asset.metadata.decimals,
        symbol: asset.metadata.symbol,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return { success: false, status: "failed", error: data.error || `Charge failed (HTTP ${res.status})` };
    }
    return { success: true, status: "success", txHash: data.txHash };
  }

  // User pays gas — direct transfer from their wallet.
  return requestPayment(amount, asset);
}

export function cardAuthorizationConfig(asset: PaymentAsset = SETTLEMENT) {
  let spender: string;
  let configured = asset.asset !== "native";
  try {
    spender = resolveSpender();
  } catch (err) {
    spender = (err as Error).message;
    configured = false;
  }
  if (asset.asset === "native") {
    spender = "Native BNB cannot use permit. Select an ERC-20 token.";
  }

  return {
    spender,
    configured,
    limit: CARD_AUTHORIZATION_LIMIT_USD,
    network: asset.network,
    token: asset.asset,
    symbol: asset.metadata.symbol,
    decimals: asset.metadata.decimals,
  };
}
