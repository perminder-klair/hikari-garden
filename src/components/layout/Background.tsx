import { useMemo } from 'react';
import { useParallax } from '../../hooks/useParallax';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Background.module.css';

// Seeded random number generator for stable particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function Background() {
  const parallaxRef = useParallax();
  const { bgOverride } = useTheme();

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      key: i,
      left: `${seededRandom(i) * 100}%`,
      animationDelay: `${seededRandom(i + 100) * 20}s`,
      animationDuration: `${15 + seededRandom(i + 200) * 10}s`,
    }));
  }, []);

  return (
    <>
      <div
        ref={parallaxRef}
        className={`${styles.bgGradient} bg-gradient`}
        style={bgOverride ? {
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, ${bgOverride} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 159, 67, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 60% at 50% 100%, rgba(230, 126, 34, 0.03) 0%, transparent 40%)
          `
        } : undefined}
      />
      <div className={styles.particles}>
        {particles.map(p => (
          <div
            key={p.key}
            className={styles.particle}
            style={{
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>
    </>
  );
}
