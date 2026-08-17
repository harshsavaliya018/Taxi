// Wallet connection entry point.
//
// Uses WalletConnect EthereumProvider + @web3modal/standalone (the white/blue
// WCM modal) to open the wallet-connect modal. The rest of the UI only ever
// calls `connectWallet()` and doesn't need to know the underlying provider.

import { BrowserProvider, type JsonRpcSigner } from "ethers";

type EthProviderType = InstanceType<
  Awaited<typeof import("@walletconnect/ethereum-provider")>["EthereumProvider"]
>;

let wcProviderPromise: Promise<EthProviderType> | null = null;

async function getWcProvider(): Promise<EthProviderType> {
  if (!wcProviderPromise) {
    wcProviderPromise = (async () => {
      const mod = await import("../context/appkit");
      return mod.getWcProvider();
    })();
  }
  return wcProviderPromise;
}

async function getModal() {
  const mod = await import("../context/appkit");
  return mod.getWeb3Modal();
}

/**
 * Open the WalletConnect modal and wait for the user to connect.
 * Resolves once the session is established.
 */
export async function connectWallet(): Promise<void> {
  const wc = await getWcProvider();
  const modal = await getModal();

  try {
    await wc.enable();
    modal.closeModal();
  } catch (err) {
    modal.closeModal();
    throw err;
  }
}

/**
 * Disconnect the current wallet session.
 */
export async function disconnectWallet(): Promise<void> {
  const wc = await getWcProvider();
  await wc.disconnect();
}

/**
 * Get an ethers BrowserProvider wrapping the WC provider.
 * Throws if no session is active.
 */
export async function getProvider(): Promise<BrowserProvider> {
  const wc = await getWcProvider();
  if (!wc.session) throw new Error("No wallet connected");
  return new BrowserProvider(wc as any);
}

/**
 * Get the connected signer. Throws if no session is active.
 */
export async function getSigner(): Promise<JsonRpcSigner> {
  const provider = await getProvider();
  return provider.getSigner();
}

/**
 * Get the connected address, or null if not connected.
 */
export async function getAddress(): Promise<string | null> {
  try {
    const signer = await getSigner();
    return await signer.getAddress();
  } catch {
    return null;
  }
}

/**
 * Check if a wallet session is currently active.
 */
export async function isConnected(): Promise<boolean> {
  try {
    const wc = await getWcProvider();
    return !!wc.session;
  } catch {
    return false;
  }
}
