"use client";

import styles from "./Privileges.module.css";
import Reveal from "../Reveal/Reveal";
import { useLang } from "../../lib/LanguageContext";

type IconKey = "lock" | "cloud" | "shield" | "flag" | "helmet" | "metrics";

const ICON_ORDER: IconKey[] = ["lock", "cloud", "shield", "flag", "helmet", "metrics"];

const GRADIENTS: Record<IconKey, string> = {
  lock: "linear-gradient(135deg, #f472b6, #a3e635, #22d3ee)",
  cloud: "linear-gradient(135deg, #22d3ee, #2563eb, #a3e635)",
  shield: "linear-gradient(135deg, #f0abfc, #818cf8, #2563eb)",
  flag: "linear-gradient(135deg, #f0abfc, #a3e635, #22d3ee)",
  helmet: "linear-gradient(135deg, #34d399, #22d3ee, #2563eb)",
  metrics: "linear-gradient(135deg, #2563eb, #22d3ee, #a3e635)",
};

const GLYPHS: Record<IconKey, React.ReactNode> = {
  lock: (
    <path d="M7 11V8a5 5 0 0110 0v3m-11 0h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z" />
  ),
  cloud: <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.3A3.5 3.5 0 0117 18H7z" />,
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zm-2 8l1.5 1.5L15 9" />,
  flag: <path d="M6 21V4m0 0h11l-2 3 2 3H6" />,
  helmet: <path d="M4 13a8 8 0 0116 0v3a2 2 0 01-2 2h-3v-5m-6 5H4v-2m8-11v3" />,
  metrics: <path d="M5 20V10m6 10V4m6 16v-7M3 20h18" />,
};

export default function Privileges() {
  const { t } = useLang();

  return (
    <section id="advantages" className={styles.privileges}>
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">{t.privileges.eyebrow}</span>
          <h2 className={styles.title}>{t.privileges.title}</h2>
          <p className={styles.subtitle}>{t.privileges.subtitle}</p>
        </Reveal>

        <div className={styles.grid}>
          {t.privileges.items.map((p, i) => {
            const icon = ICON_ORDER[i];
            return (
              <Reveal
                as="article"
                key={p.title}
                delay={(i % 3) * 90}
                className={styles.card}
              >
                <div className={styles.icon} style={{ background: GRADIENTS[icon] }}>
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {GLYPHS[icon]}
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardText}>{p.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
