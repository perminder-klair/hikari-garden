import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { projects } from '../../data/projects';
import styles from './ProjectsShowcase.module.css';

export default function ProjectsShowcase() {
  const ref = useIntersectionReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} projects-section reveal`} id="projects">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Active Cultivation</span>
        <h2 className={styles.sectionTitle}>Projects in Bloom</h2>
      </div>
      <div className={styles.grid}>
        {projects.map(p => (
          <div key={p.title} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.icon}>{p.icon}</div>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.tagline}>{p.tagline}</p>
            </div>
            <div className={styles.body}>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.stats}>
                {p.stats.map(s => (
                  <div key={s.label} className={styles.stat}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.footer}>
              <a href="#" className={styles.link}>
                {p.linkText}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
              <span className={`${styles.status} ${p.isBeta ? styles.beta : ''}`}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
