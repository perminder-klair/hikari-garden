import { useState, useCallback } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { words } from '../../data/words';
import styles from './DailyWord.module.css';

export default function DailyWord() {
  const ref = useIntersectionReveal<HTMLElement>();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const showWord = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 200);
  }, []);

  const w = words[current];

  return (
    <section ref={ref} className={`${styles.section} word-section reveal`} id="word">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Language Garden</span>
        <h2 className={styles.sectionTitle}>Daily Word</h2>
      </div>
      <div
        className={styles.card}
        style={fading ? { opacity: 0, transform: 'translateY(10px)' } : { opacity: 1, transform: 'translateY(0)' }}
      >
        <div className={styles.japanese}>{w.japanese}</div>
        <div className={styles.romaji}>{w.romaji}</div>
        <div className={styles.english}>{w.english}</div>
        <div className={styles.meaning}>{w.meaning}</div>
        <div className={styles.example}>{w.example}</div>
        <div className={styles.nav}>
          <button className={styles.btn} onClick={() => showWord((current - 1 + words.length) % words.length)}>
            ← Previous
          </button>
          <button className={styles.btn} onClick={() => showWord((current + 1) % words.length)}>
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
