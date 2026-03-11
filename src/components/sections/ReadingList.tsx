import { useCallback } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { books } from '../../data/books';
import styles from './ReadingList.module.css';

export default function ReadingList() {
  const ref = useIntersectionReveal<HTMLElement>();

  const showPopup = useCallback((title: string, progress: number) => {
    const msg = document.createElement('div');
    msg.textContent = `${title}: ${progress}% complete`;
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

  const statusClass = (s: string) => {
    if (s === 'reading') return styles.reading;
    if (s === 'completed') return styles.completed;
    return styles.queued;
  };

  const statusLabel = (s: string) => {
    if (s === 'completed') return 'Done';
    if (s === 'reading') return 'Reading';
    return 'Queued';
  };

  return (
    <section ref={ref} className={`${styles.section} reading-section reveal`} id="reading">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Knowledge Garden</span>
        <h2 className={styles.sectionTitle}>Reading List</h2>
      </div>
      <div className={styles.bookshelf}>
        {books.map(b => (
          <div key={b.title} className={styles.book} onClick={() => showPopup(b.title, b.progress)}>
            <div className={styles.spine} />
            <div className={styles.cover}>
              <span className={`${styles.status} ${statusClass(b.status)}`}>{statusLabel(b.status)}</span>
              <div>
                <div className={styles.bookTitle}>{b.title}</div>
                <div className={styles.bookAuthor}>{b.author}</div>
              </div>
              <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${b.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
