"use client";

import styles from "./Footer.module.css";
import Logo from "../Logo";
import { useLang } from "../../lib/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  const columns = [
    { title: t.footer.productTitle, links: t.footer.product },
    { title: t.footer.companyTitle, links: t.footer.company },
    { title: t.footer.legalTitle, links: t.footer.legal },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <span className={styles.brand} aria-label="Trust">
            <Logo />
          </span>
          <p className={styles.tagline}>{t.footer.tagline}</p>
        </div>

        {/* Links are intentionally inert for now — real destinations come later. */}
        {columns.map((col) => (
          <div key={col.title} className={styles.col}>
            <span className={styles.colTitle}>{col.title}</span>
            {col.links.map((label) => (
              <span key={label} className={styles.link} aria-disabled="true">
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className={`container ${styles.bottom}`}>
        <span className={styles.copy}>
          © {new Date().getFullYear()} Trust Wallet. {t.footer.rights}
        </span>
        <span className={styles.note}>{t.footer.note}</span>
      </div>
    </footer>
  );
}
