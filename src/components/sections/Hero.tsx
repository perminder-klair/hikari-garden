import { useState, useCallback } from 'react';
import { seasons } from '../../data/seasons';
import styles from './Hero.module.css';

export default function Hero() {
  const [currentSeason, setCurrentSeason] = useState(0);
  const [fading, setFading] = useState(false);

  const cycleSeason = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setCurrentSeason(prev => (prev + 1) % seasons.length);
      setFading(false);
    }, 300);
  }, []);

  const handleCta = () => {
    document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const season = seasons[currentSeason];

  return (
    <section className={`${styles.hero} hero`}>
      <div className={styles.heroContent}>
        <span className={styles.heroLabel}>Personal Space</span>
        <h1 className={styles.heroTitle}>Digital<br />Garden</h1>
        <p className={styles.heroSubtitle}>
          A quiet corner of the internet where ideas grow slowly, thoughts settle like dust in sunlight, and presence matters more than performance.
        </p>
        <button className={styles.ctaButton} onClick={handleCta}>
          Enter the Garden
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.glassCard} onClick={cycleSeason}>
          <div className={styles.glassContent}>
            <span className={styles.glassNumber} style={{ opacity: fading ? 0 : 0.3 }}>{season.num}</span>
            <span className={styles.glassLabel} style={{ opacity: fading ? 0 : 1 }}>{season.label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
