import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { useTheme } from '../../contexts/ThemeContext';
import { moods } from '../../data/moods';
import styles from './MoodBoard.module.css';

export default function MoodBoard() {
  const ref = useIntersectionReveal<HTMLElement>();
  const { setBgOverride } = useTheme();

  return (
    <section ref={ref} className={`${styles.section} mood-section reveal`} id="mood">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Visual Inspiration</span>
        <h2 className={styles.sectionTitle}>Mood Board</h2>
      </div>
      <div className={styles.grid}>
        {moods.map(m => (
          <div
            key={m.label}
            className={styles.tile}
            style={{ background: m.gradient }}
            onClick={(e) => {
              setBgOverride(m.color);
              const el = e.currentTarget;
              el.style.transform = 'scale(0.95)';
              setTimeout(() => { el.style.transform = ''; }, 150);
            }}
          >
            <div className={styles.tileContent}>{m.emoji}</div>
            <div className={styles.overlay}>
              <span className={styles.label}>{m.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
