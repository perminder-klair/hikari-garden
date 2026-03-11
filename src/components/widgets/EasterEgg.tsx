import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './EasterEgg.module.css';

export interface EasterEggHandle {
  trigger: () => void;
}

const EasterEgg = forwardRef<EasterEggHandle>((_props, ref) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    trigger() {
      setActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setActive(false), 3000);
    },
  }));

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className={`${styles.egg} ${active ? styles.active : ''}`}>
      <h3 className={styles.title}>🌸 Secret Garden Found</h3>
      <p className={styles.text}>You've discovered the hidden grove.<br />The garden remembers those who explore.</p>
    </div>
  );
});

EasterEgg.displayName = 'EasterEgg';
export default EasterEgg;
