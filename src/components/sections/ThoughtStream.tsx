import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { thoughts } from '../../data/thoughts';
import styles from './ThoughtStream.module.css';

export default function ThoughtStream() {
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} thoughts-section reveal`} id="thoughts">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Neural Pathways</span>
        <h2 className={styles.sectionTitle}>Thought Stream</h2>
      </div>
      <div className={styles.river}>
        <div className={styles.connector} />
        <div className={styles.flow}>
          {thoughts.map((t, i) => (
            <div
              key={i}
              className={styles.node}
              onClick={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateX(10px) scale(0.98)';
                setTimeout(() => { el.style.transform = ''; }, 200);
              }}
            >
              <p className={styles.content}>{t.content}</p>
              <div className={styles.meta}>
                <span className={styles.date}>{t.date}</span>
                <div className={styles.connections}>
                  {t.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
