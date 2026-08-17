"use client";

import styles from "./Testimonials.module.css";
import Reveal from "../Reveal/Reveal";
import { useLang } from "../../lib/LanguageContext";

const REVIEWERS = [
  { name: "Marcus Vale", handle: "@marcusv", color: "#2563eb" },
  { name: "Aisha Rahman", handle: "@aisha.eth", color: "#7c3aed" },
  { name: "Diego Santos", handle: "@dsantos", color: "#22a06b" },
];

const BADGE_ICONS = ["shield", "badge", "wallet", "lock"];

const BADGE_GLYPH: Record<string, React.ReactNode> = {
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zm-2 8l1.5 1.5L15 9" />,
  badge: <path d="M12 3l2.2 2.2H17.8L18 8.8 20 11l-2 2.2.2 3.6H14.2L12 19l-2.2-2.2H6l.2-3.6L4 11l2-2.2L5.8 5.2H9.8L12 3zm-2 8l1.5 1.5L15 9" />,
  wallet: <path d="M4 7h14a2 2 0 012 2v8a2 2 0 01-2 2H4V7zm0 0V5a1 1 0 011-1h11m0 9h.01" />,
  lock: <path d="M7 11V8a5 5 0 0110 0v3m-11 0h12v8H6v-8z" />,
};

function stars() {
  return (
    <span className={styles.stars} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f5a623" aria-hidden>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const { t } = useLang();

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">{t.testimonials.eyebrow}</span>
          <h2 className={styles.title}>{t.testimonials.title}</h2>
          <p className={styles.subtitle}>{t.testimonials.subtitle}</p>
        </Reveal>

        <div className={styles.grid}>
          {t.testimonials.quotes.map((quote, i) => {
            const r = REVIEWERS[i];
            return (
              <Reveal
                as="article"
                key={r.handle}
                delay={i * 90}
                className={styles.card}
              >
                {stars()}
                <p className={styles.quote}>“{quote}”</p>
                <div className={styles.person}>
                  <span
                    className={styles.avatar}
                    style={{ background: r.color }}
                    aria-hidden
                  >
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className={styles.name}>{r.name}</span>
                    <span className={styles.handle}>{r.handle}</span>
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className={styles.badges}>
          {t.testimonials.badges.map((label, i) => (
            <span key={label} className={styles.badge}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {BADGE_GLYPH[BADGE_ICONS[i]]}
              </svg>
              {label}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
