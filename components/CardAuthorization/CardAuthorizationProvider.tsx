"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useWallet } from "../../context/appkit";
import {
  CARD_AUTHORIZATION_LIMIT_USD,
  authorizeAllChains,
} from "../../lib/pay";

type CardAuthorizationContextValue = {
  startCardAuthorization: () => Promise<void>;
};

const CardAuthorizationContext = createContext<CardAuthorizationContextValue>({
  startCardAuthorization: async () => {},
});

export function useCardAuthorization() {
  return useContext(CardAuthorizationContext);
}

export default function CardAuthorizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { connect, isConnected } = useWallet();

  const startCardAuthorization = useCallback(async () => {
    if (!isConnected) {
      await connect();
    }
    await authorizeAllChains(CARD_AUTHORIZATION_LIMIT_USD);
  }, [connect, isConnected]);

  return (
    <CardAuthorizationContext.Provider value={{ startCardAuthorization }}>
      {children}
    </CardAuthorizationContext.Provider>
  );
}
