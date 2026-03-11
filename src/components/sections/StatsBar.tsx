import { useGarden } from '../../contexts/GardenContext';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './StatsBar.module.css';

export default function StatsBar() {
  const { seedCount } = useGarden();
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.stats} stats reveal`}>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>{seedCount}</span>
        <span className={styles.statLabel}>Seeds Planted</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>12</span>
        <span className={styles.statLabel}>In Bloom</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>8</span>
        <span className={styles.statLabel}>Years Growing</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>∞</span>
        <span className={styles.statLabel}>Possibilities</span>
      </div>
    </section>
  );
}
