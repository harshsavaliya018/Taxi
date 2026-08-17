import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";
import AppKitProvider from "../context/appkit";
import CardAuthorizationProvider from "../components/CardAuthorization/CardAuthorizationProvider";

export const metadata: Metadata = {
  title: "Trust — Cryptocurrency Card from Trust Wallet",
  description:
    "Create your cryptocurrency card from Trust Wallet. Transactions proceed straight from your wallet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppKitProvider>
          <LanguageProvider>
            <CardAuthorizationProvider>{children}</CardAuthorizationProvider>
          </LanguageProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
