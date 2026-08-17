"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { BrowserProvider, type JsonRpcSigner } from "ethers";
import { Web3Modal } from "@web3modal/standalone";
import { getAllBalances, type WalletBalances } from "../lib/balances";

// ---------- types ----------

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
}

interface WalletContextValue extends WalletState {
  balances: WalletBalances | null;
  refreshBalances: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const initial: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
};

const WalletContext = createContext<WalletContextValue>({
  ...initial,
  balances: null,
  refreshBalances: async () => {},
  connect: async () => {},
  disconnect: async () => {},
});

export const useWallet = () => useContext(WalletContext);

// ---------- config ----------

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

// Chain IDs: mainnet, arbitrum, polygon, bsc, base, optimism
const CHAINS = [1, 42161, 137, 56, 8453, 10] as const;
const STANDALONE_CHAINS = CHAINS.map((id) => `eip155:${id}`);

// ---------- Web3Modal (white/blue modal) ----------

let web3Modal: Web3Modal | null = null;

function getWeb3Modal(): Web3Modal {
  if (!web3Modal) {
    web3Modal = new Web3Modal({
      projectId,
      walletConnectVersion: 2,
      standaloneChains: STANDALONE_CHAINS,
      themeMode: "light",
      explorerRecommendedWalletIds: [
        "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
        "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX Wallet
        "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66", // TokenPocket
        "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow
        "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget Wallet
        "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // SafePal
        "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", // Binance Web3 Wallet
      ],
    });
  }
  return web3Modal;
}

// ---------- lazy WC provider singleton ----------

type EthProviderType = InstanceType<
  Awaited<typeof import("@walletconnect/ethereum-provider")>["EthereumProvider"]
>;

let wcProvider: EthProviderType | null = null;
let initPromise: Promise<EthProviderType> | null = null;

async function getWcProvider(): Promise<EthProviderType> {
  if (wcProvider) return wcProvider;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { EthereumProvider } = await import(
      "@walletconnect/ethereum-provider"
    );

    const provider = await EthereumProvider.init({
      projectId,
      chains: [CHAINS[0]],
      optionalChains: [...CHAINS] as number[],
      showQrModal: false, // We handle the modal ourselves via @web3modal/standalone
      metadata: {
        name: "TaxiWalt",
        description: "Cryptocurrency card from Trust Wallet",
        url: typeof window !== "undefined" ? window.location.origin : "https://taxiwalt.com",
        icons: ["https://avatars.githubusercontent.com/u/179229932"],
      },
    });

    // When the relay produces a URI, open the white Web3Modal
    provider.on("display_uri", (uri: string) => {
      getWeb3Modal().openModal({ uri, standaloneChains: STANDALONE_CHAINS });
    });

    wcProvider = provider;
    return provider;
  })();

  return initPromise;
}

// Export for direct use in lib/wallet.ts
export { getWcProvider, getWeb3Modal };

// ---------- provider component ----------

export default function AppKitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initial);
  const [balances, setBalances] = useState<WalletBalances | null>(null);

  // Sync state from WC provider
  const syncState = useCallback(async (wc: EthProviderType) => {
    try {
      const ethersProvider = new BrowserProvider(wc as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethersProvider.getNetwork();

      setState({
        isConnected: true,
        address,
        chainId: Number(network.chainId),
        provider: ethersProvider,
        signer,
      });
    } catch {
      setState(initial);
    }
  }, []);

  // Restore session on mount if one exists
  useEffect(() => {
    (async () => {
      try {
        const wc = await getWcProvider();
        if (wc.session) {
          await syncState(wc);
        }
      } catch {
        // No existing session — that's fine
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to provider events
  useEffect(() => {
    let wc: EthProviderType | null = null;

    const setup = async () => {
      wc = await getWcProvider();

      wc.on("accountsChanged", () => {
        if (wc) syncState(wc);
      });
      wc.on("chainChanged", () => {
        if (wc) syncState(wc);
      });
      wc.on("disconnect", () => {
        setState(initial);
      });
    };

    setup();

    return () => {
      // Event listeners are cleaned up when provider is destroyed
    };
  }, [syncState]);

  const connect = useCallback(async () => {
    const wc = await getWcProvider();
    const modal = getWeb3Modal();

    try {
      await wc.enable();
      // Close the modal once connected
      modal.closeModal();
      await syncState(wc);
    } catch (err) {
      modal.closeModal();
      throw err;
    }
  }, [syncState]);

  const disconnect = useCallback(async () => {
    const wc = await getWcProvider();
    await wc.disconnect();
    setState(initial);
    setBalances(null);
  }, []);

  const refreshBalances = useCallback(async () => {
    if (!state.address) return;
    try {
      const b = await getAllBalances(state.address);
      setBalances(b);
    } catch {
      // Keep whatever balances we had — a single chain read failing
      // should not break the UI.
    }
  }, [state.address]);

  // Refresh balances when an address connects
  useEffect(() => {
    if (state.address) {
      refreshBalances();
    }
  }, [state.address, refreshBalances]);

  return (
    <WalletContext.Provider value={{ ...state, balances, refreshBalances, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}
