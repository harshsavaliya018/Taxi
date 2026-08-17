"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Stats.module.css";
import { useLang } from "../../lib/LanguageContext";

type Stat = {
  label: string;
  value?: string;
  sub?: string;
  /** numeric target for count-up + suffix, e.g. { to: 200, suffix: "M" } */
  count?: { to: number; suffix?: string };
  stars?: boolean;
};

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

function CountValue({ to, suffix, run }: { to: number; suffix?: string; run: boolean }) {
  const v = useCountUp(to, run);
  return (
    <>
      {v}
      {suffix}
    </>
  );
}

export default function Stats() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement | null>(null);
  const [run, setRun] = useState(false);

  const STATS: Stat[] = [
    { label: t.stats.trustedBy, count: { to: 200, suffix: "M" }, sub: t.stats.people },
    { label: t.stats.foundedIn, count: { to: 2017 } },
    { label: t.stats.independently, value: t.stats.audited },
    { label: t.stats.iso, value: t.stats.certified },
    { label: t.stats.topReviews, stars: true },
  ];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={styles.stats}>
      <div className="container">
        <div ref={ref} className={styles.inner}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={styles.item}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className={styles.label}>{s.label}</span>
              {s.stars ? (
                <span className={styles.stars} aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="24" height="24" viewBox="0 0 24 24" fill="#f5a623" aria-hidden>
                      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
                    </svg>
                  ))}
                </span>
              ) : (
                <span className={styles.value}>
                  {s.count ? (
                    <CountValue to={s.count.to} suffix={s.count.suffix} run={run} />
                  ) : (
                    s.value
                  )}
                  {s.sub && <span className={styles.sub}>{s.sub}</span>}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
