import { useGarden } from '../../contexts/GardenContext';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './SeedsTimeline.module.css';

export default function SeedsTimeline() {
  const { seeds } = useGarden();
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} seeds-section reveal`} id="recentSeeds">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Growing Activity</span>
        <h2 className={styles.sectionTitle}>Recent Seeds</h2>
      </div>
      <div className={styles.timeline}>
        {seeds.map(seed => (
          <div key={seed.id} className={styles.seedItem}>
            <span className={styles.seedTime}>{seed.time}</span>
            <div className={styles.seedContent}>
              <h4 className={styles.seedTitle}>{seed.title}</h4>
              <p className={styles.seedDesc}>{seed.desc}</p>
            </div>
            <span className={styles.seedTag}>{seed.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
