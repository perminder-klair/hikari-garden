import { useMemo } from 'react';
import styles from './AmbientVisualizer.module.css';

export default function AmbientVisualizer() {
  const bars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      key: i,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${0.5 + Math.random() * 1}s`,
    }));
  }, []);

  return (
    <div className={styles.viz}>
      {bars.map(b => (
        <div
          key={b.key}
          className={styles.bar}
          style={{ animationDelay: b.animationDelay, animationDuration: b.animationDuration }}
        />
      ))}
    </div>
  );
}
