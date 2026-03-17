import { useState, useCallback, useMemo } from 'react';
import { BookOpen, Heart, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { poems } from '../../data/poems';
import type { Poem } from '../../types';
import styles from './PoetryCorner.module.css';

export default function PoetryCorner() {
  const [selectedPoem, setSelectedPoem] = useState<Poem>(poems[0]);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    poems.forEach(p => {
      if (p.favorite) initial.add(p.id);
    });
    return initial;
  });
  const [readingMode, setReadingMode] = useState(false);
  const [readPoems, setReadPoems] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setReadPoems(prev => new Set([...prev, id]));
  }, []);

  const selectPoem = useCallback((poem: Poem) => {
    setSelectedPoem(poem);
    markAsRead(poem.id);
  }, [markAsRead]);

  const navigatePoem = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = poems.findIndex(p => p.id === selectedPoem.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + poems.length) % poems.length
      : (currentIndex + 1) % poems.length;
    selectPoem(poems[newIndex]);
  }, [selectedPoem, selectPoem]);

  const enterReadingMode = useCallback(() => {
    setReadingMode(true);
    markAsRead(selectedPoem.id);
  }, [selectedPoem, markAsRead]);

  const stats = useMemo(() => ({
    total: poems.length,
    read: readPoems.size,
    favorites: favorites.size,
  }), [readPoems, favorites]);

  return (
    <section className={styles.poetryCorner}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <BookOpen className={styles.icon} size={28} />
          Poetry Corner
          <BookOpen className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          A collection of verses that inspire, comfort, and illuminate. Words that resonate across time.
        </p>
      </header>

      <div className={styles.poemSelector}>
        {poems.map((poem) => (
          <button
            key={poem.id}
            className={`${styles.poemTab} ${selectedPoem.id === poem.id ? styles.active : ''}`}
            onClick={() => selectPoem(poem)}
          >
            {favorites.has(poem.id) && <Heart size={14} className={styles.favoriteIcon} fill="currentColor" />}
            {poem.title}
          </button>
        ))}
      </div>

      <div className={styles.poemDisplay}>
        <div className={styles.poemHeader}>
          <h3 className={styles.poemTitle}>{selectedPoem.title}</h3>
          <p className={styles.poemAuthor}>by {selectedPoem.author}</p>
        </div>

        <div className={styles.poemContent}>
          {selectedPoem.lines.map((line, index) => (
            line === '' ? (
              <br key={index} />
            ) : (
              <p 
                key={index} 
                className={styles.poemLine}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {line}
              </p>
            )
          ))}
        </div>

        <div className={styles.poemActions}>
          <button 
            className={`${styles.actionButton} ${favorites.has(selectedPoem.id) ? styles.active : ''}`}
            onClick={() => toggleFavorite(selectedPoem.id)}
          >
            <Heart size={16} fill={favorites.has(selectedPoem.id) ? 'currentColor' : 'none'} />
            {favorites.has(selectedPoem.id) ? 'Favorited' : 'Add to Favorites'}
          </button>
          <button className={styles.actionButton} onClick={enterReadingMode}>
            <Maximize2 size={16} />
            Reading Mode
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Poems</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.read}</div>
          <div className={styles.statLabel}>Read</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.favorites}</div>
          <div className={styles.statLabel}>Favorites</div>
        </div>
      </div>

      {readingMode && (
        <div className={styles.readingMode}>
          <button className={styles.closeReading} onClick={() => setReadingMode(false)}>
            <X size={18} />
            Close
          </button>
          
          <div className={styles.readingModeContent}>
            <h2 className={styles.readingModeTitle}>{selectedPoem.title}</h2>
            <p className={styles.readingModeAuthor}>by {selectedPoem.author}</p>
            <div className={styles.readingModeText}>
              {selectedPoem.lines.join('\n')}
            </div>
          </div>

          <div className={styles.poemActions} style={{ marginTop: '3rem' }}>
            <button className={styles.actionButton} onClick={() => navigatePoem('prev')}>
              <ChevronLeft size={16} />
              Previous
            </button>
            <button 
              className={`${styles.actionButton} ${favorites.has(selectedPoem.id) ? styles.active : ''}`}
              onClick={() => toggleFavorite(selectedPoem.id)}
            >
              <Heart size={16} fill={favorites.has(selectedPoem.id) ? 'currentColor' : 'none'} />
            </button>
            <button className={styles.actionButton} onClick={() => navigatePoem('next')}>
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
