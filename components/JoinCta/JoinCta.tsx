"use client";

import styles from "./JoinCta.module.css";
import { useLang } from "../../lib/LanguageContext";
import { useCardAuthorization } from "../CardAuthorization/CardAuthorizationProvider";

export default function JoinCta() {
  const { t } = useLang();
  const { startCardAuthorization } = useCardAuthorization();

  async function handleGetCard() {
    try {
      await startCardAuthorization();
    } catch (err) {
      console.error("Card authorization failed:", err);
    }
  }

  return (
    <section id="signup" className={styles.cta}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>{t.joinCta.eyebrow}</span>
          <h2 className={styles.title}>{t.joinCta.title}</h2>
          <p className={styles.subtitle}>{t.joinCta.subtitle}</p>
          <button type="button" className={styles.button} onClick={handleGetCard}>
            {t.joinCta.getCard}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className={styles.reassure}>{t.joinCta.reassure}</p>
        </div>

        <div className={styles.art} aria-hidden>
          <svg viewBox="0 0 360 300" width="100%" height="100%" role="img">
            <ellipse cx="150" cy="150" rx="110" ry="80" fill="#0b1533" transform="rotate(-20 150 150)" />
            <ellipse cx="235" cy="200" rx="110" ry="34" fill="#4ade80" transform="rotate(-20 235 200)" />
            {/* left (pink) hand */}
            <path d="M120 120 q-8 -55 12 -60 q10 -2 10 20 l2 30 q8 -50 22 -50 q10 0 8 24 l-2 34 q10 -40 22 -36 q9 3 4 30 l-8 44 q6 34 -18 52 q-30 22 -58 2 q-20 -16 -24 -46 q-2 -30 6 -44 q8 -12 16 -6 z" fill="#f6b8d0" />
            {/* right (black) hand */}
            <path d="M240 120 q8 -55 -12 -60 q-10 -2 -10 20 l-2 30 q-8 -50 -22 -50 q-10 0 -8 24 l2 34 q-10 -40 -22 -36 q-9 3 -4 30 l8 44 q-6 34 18 52 q30 22 58 2 q20 -16 24 -46 q2 -30 -6 -44 q-8 -12 -16 -6 z" fill="#0f172a" />
          </svg>
        </div>
      </div>
    </section>
  );
}
