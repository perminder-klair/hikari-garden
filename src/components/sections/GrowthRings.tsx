import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './GrowthRings.module.css';

const ringData = [
  { className: styles.ring1, markerStyle: { top: '50%', right: '-6px', transform: 'translateY(-50%)' }, label: '2024 — Garden Planted' },
  { className: styles.ring2, markerStyle: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }, label: '2025 — First Bloom' },
  { className: styles.ring3, markerStyle: { top: '50%', left: '-6px', transform: 'translateY(-50%)' }, label: '2026 — Agent Network' },
  { className: styles.ring4, markerStyle: { top: '-6px', left: '50%', transform: 'translateX(-50%)' }, label: 'Future — Infinite Growth' },
];

export default function GrowthRings() {
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} growth-section reveal`} id="growth">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Timeline</span>
        <h2 className={styles.sectionTitle}>Growth Rings</h2>
      </div>
      <div className={styles.rings}>
        <div className={styles.center}>🌱</div>
        {ringData.map((r, i) => (
          <div key={i} className={`${styles.ring} ${r.className}`}>
            <div className={styles.marker} style={r.markerStyle}>
              <div className={styles.tooltip}>{r.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
