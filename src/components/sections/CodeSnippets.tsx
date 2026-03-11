import { useState, useCallback } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { snippets } from '../../data/snippets';
import styles from './CodeSnippets.module.css';

export default function CodeSnippets() {
  const ref = useIntersectionReveal<HTMLElement>();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copySnippet = useCallback((code: string, index: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }, []);

  return (
    <section ref={ref} className={`${styles.section} snippets-section reveal`} id="snippets">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Cultivated Code</span>
        <h2 className={styles.sectionTitle}>Snippet Garden</h2>
      </div>
      <div className={styles.grid}>
        {snippets.map((s, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.header}>
              <span className={styles.lang}>{s.lang}</span>
              <button
                className={styles.copyBtn}
                style={copiedIndex === i ? { color: '#2ecc71' } : undefined}
                onClick={() => copySnippet(s.code, i)}
              >
                {copiedIndex === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className={styles.code}>{s.code}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
