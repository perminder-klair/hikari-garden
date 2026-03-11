import { useState, useCallback, useEffect, useRef } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { wisdomQuotes } from '../../data/quotes';
import styles from './WisdomWell.module.css';

export default function WisdomWell() {
  const ref = useIntersectionReveal<HTMLElement>();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const autoRotateRef = useRef<number | null>(null);

  const showWisdom = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 250);
  }, []);

  const next = useCallback(() => {
    showWisdom((current + 1) % wisdomQuotes.length);
  }, [current, showWisdom]);

  const prev = useCallback(() => {
    showWisdom((current - 1 + wisdomQuotes.length) % wisdomQuotes.length);
  }, [current, showWisdom]);

  useEffect(() => {
    if (hovering) return;
    autoRotateRef.current = window.setInterval(() => {
      showWisdom((current + 1) % wisdomQuotes.length);
    }, 10000);
    return () => { if (autoRotateRef.current) clearInterval(autoRotateRef.current); };
  }, [current, hovering, showWisdom]);

  const q = wisdomQuotes[current];

  return (
    <section ref={ref} className={`${styles.section} wisdom-section reveal`} id="wisdom">
      <div
        className={styles.container}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className={styles.well}>🌊</div>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Collected Wisdom</span>
          <h2 className={styles.sectionTitle}>The Well</h2>
        </div>
        <p className={`${styles.quote} ${fading ? styles.fade : ''}`}>{q.quote}</p>
        <p className={styles.author}>— {q.author}</p>
        <div className={styles.nav}>
          <button className={styles.btn} onClick={prev}>←</button>
          <div className={styles.dots}>
            {wisdomQuotes.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => showWisdom(i)}
              />
            ))}
          </div>
          <button className={styles.btn} onClick={next}>→</button>
        </div>
      </div>
    </section>
  );
}
