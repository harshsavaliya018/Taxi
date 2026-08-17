// Cross-chain balance helpers.
//
// Reads native-coin (TRX/BNB/ETH) and stablecoin balances for the connected
// address, converts them to USD, and decides who should pay gas for a charge:
//
//   - native balance <  $2  → user must pay gas themselves
//   - native balance >= $2  → the tank address (configured by the operator)
//                             pays gas, deducted silently from the user's allowance
//
// Stablecoin balances (USDT/USDC) are informational and shown next to the
// connected address. Gas eligibility is based on the NATIVE coin only, because
// that is what gas is paid in.

import { Contract, formatUnits } from "ethers";
import { getAddress, getProvider } from "./wallet";
import {
  GAS_COVERED_MIN_USD,
  bscUSDC,
  bscUSDT,
  ethereumUSDC,
  ethereumUSDT,
  tronUSDT,
  type PaymentAsset,
} from "./pay";

// Rough USD prices used for the $2 threshold. Update these when markets move.
// ETH/BNB live in pay.ts (NATIVE_USD_PRICE); TRX is Tron-only and lives here.
const NATIVE_USD_PRICE: Record<string, number> = {
  "tron:mainnet": 0.24, // TRX
  "eip155:56": 600, // BNB
  "eip155:1": 3200, // ETH
};

const STABLECOIN_USD_PRICE = 1;

const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];

const NATIVE_ASSETS: Record<string, PaymentAsset> = {
  "tron:mainnet": { network: "tron:mainnet", asset: "native", metadata: { name: "TRON", symbol: "TRX", decimals: 6 } },
  "eip155:56": { network: "eip155:56", asset: "native", metadata: { name: "BNB", symbol: "BNB", decimals: 18 } },
  "eip155:1": { network: "eip155:1", asset: "native", metadata: { name: "Ether", symbol: "ETH", decimals: 18 } },
};

const TOKEN_ASSETS: PaymentAsset[] = [tronUSDT, bscUSDT, bscUSDC, ethereumUSDT, ethereumUSDC];

export interface NativeBalance {
  network: string;
  symbol: string;
  /** Human-readable coin amount, e.g. "0.82" */
  amount: string;
  /** Estimated USD value */
  usd: number;
  /** true when usd >= GAS_COVERED_MIN_USD (tank pays gas) */
  gasCovered: boolean;
  error?: string;
}

export interface TokenBalance {
  network: string;
  symbol: string;
  amount: string;
  usd: number;
  error?: string;
}

export interface WalletBalances {
  native: NativeBalance[];
  tokens: TokenBalance[];
}

function getTronWeb(): any {
  if (typeof window === "undefined") return null;
  const tronWeb = (window as any).tronWeb;
  return tronWeb && tronWeb.ready ? tronWeb : null;
}

/** Read a native-coin balance for one chain. */
export async function getNativeBalance(
  network: string,
  address: string,
): Promise<NativeBalance> {
  const asset = NATIVE_ASSETS[network];
  if (!asset) {
    return { network, symbol: network, amount: "0", usd: 0, gasCovered: false, error: `Unsupported network ${network}` };
  }

  const price = NATIVE_USD_PRICE[network] ?? 0;

  try {
    if (network.startsWith("tron:")) {
      const tronWeb = getTronWeb();
      if (!tronWeb) {
        return { network, symbol: "TRX", amount: "0", usd: 0, gasCovered: false, error: "TronLink not ready" };
      }
      const balance = await tronWeb.trx.getBalance(address);
      const amount = formatUnits(BigInt(balance), asset.metadata.decimals);
      const usd = Number(amount) * price;
      return { network, symbol: "TRX", amount, usd, gasCovered: usd >= GAS_COVERED_MIN_USD };
    }

    const provider = await getProvider();
    const chainId = Number(network.split(":")[1]);
    const current = await provider.getNetwork();
    if (Number(current.chainId) !== chainId) {
      return { network, symbol: asset.metadata.symbol, amount: "0", usd: 0, gasCovered: false, error: "Wallet is on a different chain" };
    }

    const raw = await provider.getBalance(address);
    const amount = formatUnits(raw, asset.metadata.decimals);
    const usd = Number(amount) * price;
    return { network, symbol: asset.metadata.symbol, amount, usd, gasCovered: usd >= GAS_COVERED_MIN_USD };
  } catch (err) {
    return { network, symbol: asset.metadata.symbol, amount: "0", usd: 0, gasCovered: false, error: (err as Error).message };
  }
}

/** Read an ERC-20 / TRC-20 token balance for one chain. */
export async function getTokenBalance(
  asset: PaymentAsset,
  address: string,
): Promise<TokenBalance> {
  try {
    if (asset.network.startsWith("tron:")) {
      const tronWeb = getTronWeb();
      if (!tronWeb) {
        return { network: asset.network, symbol: asset.metadata.symbol, amount: "0", usd: 0, error: "TronLink not ready" };
      }
      const contract = await tronWeb.contract().at(asset.asset);
      const raw = await contract.balanceOf(address).call();
      const amount = formatUnits(BigInt(raw), asset.metadata.decimals);
      return { network: asset.network, symbol: asset.metadata.symbol, amount, usd: Number(amount) * STABLECOIN_USD_PRICE };
    }

    const provider = await getProvider();
    const chainId = Number(asset.network.split(":")[1]);
    const current = await provider.getNetwork();
    if (Number(current.chainId) !== chainId) {
      return { network: asset.network, symbol: asset.metadata.symbol, amount: "0", usd: 0, error: "Wallet is on a different chain" };
    }

    const token = new Contract(asset.asset, ERC20_ABI, provider);
    const raw: bigint = await token.balanceOf(address);
    const amount = formatUnits(raw, asset.metadata.decimals);
    return { network: asset.network, symbol: asset.metadata.symbol, amount, usd: Number(amount) * STABLECOIN_USD_PRICE };
  } catch (err) {
    return { network: asset.network, symbol: asset.metadata.symbol, amount: "0", usd: 0, error: (err as Error).message };
  }
}

/**
 * Read all balances for the connected address across Tron, BSC and Ethereum.
 * Each native balance includes a `gasCovered` flag (>= $2 → tank pays gas).
 */
export async function getAllBalances(address?: string): Promise<WalletBalances> {
  const addr = address || (await getAddress());
  if (!addr) return { native: [], tokens: [] };

  const nativeNetworks = Object.keys(NATIVE_ASSETS);
  const [natives, tokens] = await Promise.all([
    Promise.all(nativeNetworks.map((n) => getNativeBalance(n, addr))),
    Promise.all(TOKEN_ASSETS.map((t) => getTokenBalance(t, addr))),
  ]);

  return { native: natives, tokens };
}
