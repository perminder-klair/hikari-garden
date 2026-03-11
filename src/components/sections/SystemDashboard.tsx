import { useCallback } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './SystemDashboard.module.css';

const cards = [
  { statusText: 'Online', name: 'Ronin', info: 'Primary Host', metric: 'Uptime: 14d 6h' },
  { statusText: 'Active', name: 'Klair-Server', info: '23 Services', metric: 'Load: 12%' },
  { statusText: 'Standby', name: 'Lemonade', info: 'GPU Compute', metric: 'VRAM: 8%' },
  { statusText: 'Running', name: 'Hikari', info: 'Personal Agent', metric: 'Tasks: 3' },
];

export default function SystemDashboard() {
  const ref = useIntersectionReveal<HTMLElement>();

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const metric = card.querySelector(`.${styles.metric}`) as HTMLElement;
    if (metric) {
      metric.style.opacity = '0.5';
      setTimeout(() => { metric.style.opacity = '1'; }, 200);
    }
    card.style.boxShadow = '0 0 30px rgba(244, 208, 63, 0.2)';
    setTimeout(() => { card.style.boxShadow = ''; }, 500);
  }, []);

  return (
    <section ref={ref} className={`${styles.section} dashboard-section reveal`} id="system">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Live Systems</span>
        <h2 className={styles.sectionTitle}>Current State</h2>
      </div>
      <div className={styles.grid}>
        {cards.map(c => (
          <div key={c.name} className={styles.card} onClick={handleCardClick}>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>{c.statusText}</span>
            </div>
            <div className={styles.name}>{c.name}</div>
            <div className={styles.info}>{c.info}</div>
            <div className={styles.metric}>{c.metric}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
