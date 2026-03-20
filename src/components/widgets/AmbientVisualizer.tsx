import { useMemo } from 'react';
import styles from './AmbientVisualizer.module.css';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AmbientVisualizer() {
  const bars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      key: i,
      animationDelay: `${seededRandom(i) * 2}s`,
      animationDuration: `${0.5 + seededRandom(i + 100) * 1}s`,
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
