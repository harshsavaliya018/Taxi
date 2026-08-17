"use client";

import { useEffect, useState } from "react";
import styles from "./StickyCta.module.css";
import { useLang } from "../../lib/LanguageContext";
import { useCardAuthorization } from "../CardAuthorization/CardAuthorizationProvider";

export default function StickyCta() {
  const { t } = useLang();
  const { startCardAuthorization } = useCardAuthorization();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("main");
    const signup = document.getElementById("signup");

    const update = () => {
      const pastHero = hero
        ? hero.getBoundingClientRect().bottom < 0
        : window.scrollY > 500;
      const signupVisible = signup
        ? signup.getBoundingClientRect().top < window.innerHeight &&
          signup.getBoundingClientRect().bottom > 0
        : false;
      setShow(pastHero && !signupVisible);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  async function handleClick() {
    try {
      await startCardAuthorization();
    } catch (err) {
      console.error("Card authorization failed:", err);
    }
  }

  return (
    <div className={`${styles.bar} ${show ? styles.show : ""}`} aria-hidden={!show}>
      <div className={styles.text}>
        <span className={styles.title}>{t.sticky.title}</span>
        <span className={styles.sub}>{t.sticky.sub}</span>
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        tabIndex={show ? 0 : -1}
      >
        {t.sticky.button}
      </button>
    </div>
  );
}
