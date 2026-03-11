import { useState, useMemo, useCallback } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './HabitTracker.module.css';

type DayState = '' | 'partial' | 'completed';

export default function HabitTracker() {
  const ref = useIntersectionReveal<HTMLElement>();
  const today = new Date().getDate();

  const initialDays = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum < today) {
        const rand = Math.random();
        if (rand > 0.7) return 'completed' as DayState;
        if (rand > 0.4) return 'partial' as DayState;
      }
      return '' as DayState;
    });
  }, [today]);

  const [days, setDays] = useState<DayState[]>(initialDays);

  const cycleDay = useCallback((index: number) => {
    setDays(prev => {
      const next = [...prev];
      if (next[index] === 'completed') next[index] = 'partial';
      else if (next[index] === 'partial') next[index] = '';
      else next[index] = 'completed';
      return next;
    });
  }, []);

  return (
    <section ref={ref} className={`${styles.section} habits-section reveal`} id="habits">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Daily Rituals</span>
        <h2 className={styles.sectionTitle}>Habit Garden</h2>
      </div>
      <div className={styles.plot}>
        {days.map((state, i) => {
          const dayNum = i + 1;
          const isToday = dayNum === today;
          const className = [
            styles.day,
            state === 'completed' ? styles.completed : '',
            state === 'partial' ? styles.partial : '',
            isToday ? styles.today : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={i}
              className={className}
              onClick={() => cycleDay(i)}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.empty}`} />
          <span>Not started</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendPartial}`} />
          <span>In progress</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendCompleted}`} />
          <span>Completed</span>
        </div>
      </div>
    </section>
  );
}
