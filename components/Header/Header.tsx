"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import Logo from "../Logo";
import { useWallet } from "../../context/appkit";
import { useLang } from "../../lib/LanguageContext";
import type { LocaleCode } from "../../lib/i18n";
import { useCardAuthorization } from "../CardAuthorization/CardAuthorizationProvider";

export default function Header() {
  const { t, language, languages, setLocale } = useLang();
  const { isConnected, address, balances, disconnect } = useWallet();
  const { startCardAuthorization } = useCardAuthorization();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  const NAV = [
    { label: t.nav.main, href: "#main", active: true },
    { label: t.nav.advantages, href: "#advantages" },
    { label: t.nav.faq, href: "#faq" },
    { label: t.nav.signup, href: "#signup" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    document.body.style.overflow = menuOpen ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [langOpen]);

  async function handleCta() {
    setMenuOpen(false);
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await startCardAuthorization();
      }
    } catch (err) {
      console.error("Wallet action failed:", err);
    }
  }

  function pickLocale(code: LocaleCode) {
    setLocale(code);
    setLangOpen(false);
  }

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const formattedBalances = (balances?.native ?? [])
    .map((b) => `${b.symbol} ${b.amount} ($${b.usd.toFixed(2)})${b.gasCovered ? "" : " • gas on user"}`)
    .join("  ");

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#main" className={styles.brand} aria-label="Trust home">
          <Logo />
        </a>

        <nav className={styles.nav}>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${item.active ? styles.active : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.langWrap} ref={langRef}>
            <button
              className={styles.lang}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label="Select language"
              onClick={() => setLangOpen((v) => !v)}
            >
              <span className={styles.langCode}>{language.region}</span>
              <span className={styles.langLabel}>{language.short}</span>
              <svg
                className={`${styles.langChevron} ${langOpen ? styles.langChevronOpen : ""}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {langOpen && (
              <ul className={styles.langMenu} role="listbox" aria-label="Languages">
                {languages.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={l.code === language.code}
                      className={`${styles.langOption} ${l.code === language.code ? styles.langOptionActive : ""}`}
                      onClick={() => pickLocale(l.code)}
                    >
                      <span className={styles.optionRegion}>{l.region}</span>
                      <span className={styles.optionLabel}>{l.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className={styles.cta} type="button" onClick={handleCta} title={formattedBalances || undefined}>
            {isConnected ? formattedAddress : t.header.obtainCard}
          </button>
          <button
            className={styles.burger}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBar1 : ""}`} />
            <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBar2 : ""}`} />
            <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBar3 : ""}`} />
          </button>
        </div>
      </div>

      {/* Balance strip — visible as soon as the wallet connects */}
      {isConnected && balances && balances.native.length > 0 && (
        <div className={`container ${styles.balanceStrip}`}>
          {balances.native.map((b) => (
            <span key={b.network} className={styles.balanceChip}>
              <b>{b.symbol}</b> {Number(b.amount).toFixed(4)} ≈ ${b.usd.toFixed(2)}
              {b.gasCovered ? " · gas covered" : " · gas on user"}
            </span>
          ))}
          {balances.tokens.map((t) => (
            <span key={`${t.network}-${t.symbol}`} className={styles.balanceChip}>
              <b>{t.symbol}</b> {Number(t.amount).toFixed(4)}
            </span>
          ))}
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.mobileNav}>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.mobileLangs} role="group" aria-label="Languages">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`${styles.mobileLang} ${l.code === language.code ? styles.mobileLangActive : ""}`}
              onClick={() => pickLocale(l.code)}
            >
              <span className={styles.optionRegion}>{l.region}</span>
              {l.label}
            </button>
          ))}
        </div>

        <button className={styles.mobileCta} type="button" onClick={handleCta}>
          {isConnected ? formattedAddress : t.header.obtainCard}
        </button>
      </div>
    </header>
  );
}
