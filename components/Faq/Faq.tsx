"use client";

import { useState } from "react";
import styles from "./Faq.module.css";
import { useLang } from "../../lib/LanguageContext";

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className={styles.faq}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className={styles.title}>{t.faq.title}</h2>
          <p className={styles.subtitle}>{t.faq.subtitle}</p>
        </div>

        <div className={styles.list}>
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className={`${styles.answerWrap} ${isOpen ? styles.answerWrapOpen : ""}`}
                >
                  <div className={styles.answer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
