"use client";

import styles from "./Hero.module.css";
import { useLang } from "../../lib/LanguageContext";
import { useCardAuthorization } from "../CardAuthorization/CardAuthorizationProvider";

export default function Hero() {
  const { t } = useLang();
  const { startCardAuthorization } = useCardAuthorization();

  async function handleObtainCard() {
    try {
      await startCardAuthorization();
    } catch (err) {
      console.error("Card authorization failed:", err);
    }
  }

  return (
    <section id="main" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden />
            {t.hero.badge}
          </span>
          <h1 className={styles.title}>
            {t.hero.titleLead}
            <span className="gradient-text">{t.hero.titleAccent}</span>
            {t.hero.titleTail}
          </h1>
          <p className={styles.subtitle}>{t.hero.subtitle}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={handleObtainCard}
            >
              {t.hero.obtainCard}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#advantages" className={styles.secondary}>
              {t.hero.discoverMore}
            </a>
          </div>

          <p className={styles.reassure}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.hero.reassure}
          </p>

          <div className={styles.trustRow}>
            <div className={styles.avatars} aria-hidden>
              {["#2563eb", "#22d3ee", "#7c3aed", "#f472b6"].map((c, i) => (
                <span key={i} className={styles.avatar} style={{ background: c }} />
              ))}
            </div>
            <span className={styles.trustText}>
              {t.hero.trustText.split("{n}").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <strong>200M+</strong>}
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className={styles.art} aria-hidden>
          <div className={styles.artGlow} />
          <div className={styles.artCard}>
            <div className={styles.artHeader}>
              <span className={styles.artChip}>{t.hero.cardChip}</span>
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" aria-hidden>
                <rect x="0.5" y="0.5" width="29" height="19" rx="3.5" stroke="rgba(255,255,255,0.4)" />
                <path d="M6 7h6M6 10h10M6 13h4" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <span className={styles.artLabel}>{t.hero.cardBalance}</span>
            <span className={styles.artBalance}>$1,228.20</span>
            <span className={styles.artChange}>↑ $23.98 (+0.6%)</span>
            <svg className={styles.spark} viewBox="0 0 240 60" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#22d3ee" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 44 L30 40 L60 46 L90 30 L120 34 L150 20 L180 26 L210 12 L240 16 L240 60 L0 60 Z" fill="url(#sparkFill)" />
              <path d="M0 44 L30 40 L60 46 L90 30 L120 34 L150 20 L180 26 L210 12 L240 16" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className={styles.floatChip}>
            <span className={styles.floatDot} />
            {t.hero.paymentApproved}
          </div>
        </div>
      </div>
    </section>
  );
}
