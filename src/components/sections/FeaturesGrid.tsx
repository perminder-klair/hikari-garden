import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { features } from '../../data/features';
import styles from './FeaturesGrid.module.css';

export default function FeaturesGrid() {
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.features} features reveal`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Cultivated Spaces</span>
        <h2 className={styles.sectionTitle}>Where Ideas Take Root</h2>
      </div>
      <div className={styles.grid}>
        {features.map(f => (
          <div
            key={f.title}
            className={styles.card}
            onClick={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'scale(0.98)';
              setTimeout(() => { el.style.transform = ''; }, 150);
            }}
          >
            <div className={styles.icon}>{f.icon}</div>
            <h3 className={styles.title}>{f.title}</h3>
            <p className={styles.desc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
