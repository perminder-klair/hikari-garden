import { useCallback } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { agents } from '../../data/agents';
import styles from './AgentNetwork.module.css';

export default function AgentNetwork() {
  const ref = useIntersectionReveal<HTMLElement>();

  const handleAgentClick = useCallback((message: string) => {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: var(--bg-secondary); border: 1px solid var(--accent-gold);
      padding: 1rem 2rem; font-family: 'Space Mono', monospace; font-size: 0.9rem;
      color: var(--accent-gold); z-index: 1000; opacity: 0; transition: opacity 0.3s ease;
    `;
    document.body.appendChild(msg);
    setTimeout(() => { msg.style.opacity = '1'; }, 10);
    setTimeout(() => {
      msg.style.opacity = '0';
      setTimeout(() => msg.remove(), 300);
    }, 2000);
  }, []);

  return (
    <section ref={ref} className={`${styles.section} agents-section reveal`} id="agents">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>The Collective</span>
        <h2 className={styles.sectionTitle}>Agent Network</h2>
      </div>
      <div className={styles.constellation}>
        {agents.map(a => (
          <div key={a.id} className={styles.node} onClick={() => handleAgentClick(a.message)}>
            <div className={styles.avatar}>{a.kanji}</div>
            <div className={styles.name}>{a.name}</div>
            <div className={styles.role}>{a.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
