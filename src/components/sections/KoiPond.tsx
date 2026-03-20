import { useState, useEffect, useCallback, useRef } from 'react';
import { Fish, Plus, Droplets, Cookie, RefreshCw, Palette } from 'lucide-react';
import styles from './KoiPond.module.css';

interface Koi {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  pattern: 'kohaku' | 'showa' | 'utsuri' | 'ogon' | 'shusui';
  direction: number;
  targetX: number;
  targetY: number;
  isEating: boolean;
}

interface Food {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const KOI_COLORS = {
  kohaku: { primary: '#FFFFFF', secondary: '#FF6B6B', name: 'Kohaku' },
  showa: { primary: '#1A1A1A', secondary: '#FF4444', name: 'Showa' },
  utsuri: { primary: '#FFD700', secondary: '#1A1A1A', name: 'Utsuri' },
  ogon: { primary: '#FFD700', secondary: '#FFA500', name: 'Ogon' },
  shusui: { primary: '#E8F5E9', secondary: '#1A237E', name: 'Shusui' },
};

export default function KoiPond() {
  const [koi, setKoi] = useState<Koi[]>([]);
  const [food, setFood] = useState<Food[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pondCleanliness, setPondCleanliness] = useState(100);
  const [totalFed, setTotalFed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const createKoi = (id: number, x: number, y: number, pattern: Koi['pattern']): Koi => ({
    id,
    x,
    y,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: 25 + Math.random() * 15,
    color: pattern,
    pattern,
    direction: Math.random() * Math.PI * 2,
    targetX: x,
    targetY: y,
    isEating: false,
  });

  // Initialize with some koi
  useEffect(() => {
    const initialKoi: Koi[] = [
      createKoi(1, 30, 40, 'kohaku'),
      createKoi(2, 70, 60, 'ogon'),
    ];
    setKoi(initialKoi);
  }, []);

  const addKoi = useCallback((pattern: Koi['pattern']) => {
    if (koi.length >= 10) return;
    
    const newKoi = createKoi(
      Date.now(),
      20 + Math.random() * 60,
      20 + Math.random() * 60,
      pattern
    );
    setKoi(prev => [...prev, newKoi]);
  }, [koi.length]);

  const addFood = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newFood: Food = {
      id: Date.now(),
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      size: 6,
    };
    
    setFood(prev => [...prev, newFood]);
    
    // Add ripple
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x: newFood.x,
      y: newFood.y,
      size: 0,
      opacity: 1,
    };
    setRipples(prev => [...prev, newRipple]);
    
    setTotalFed(prev => prev + 1);
  }, []);

  const cleanPond = useCallback(() => {
    setPondCleanliness(100);
    setRipples([]);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      // Update koi
      setKoi(currentKoi =>
        currentKoi.map(fish => {
          let newVx = fish.vx;
          let newVy = fish.vy;
          let newX = fish.x;
          let newY = fish.y;
          let isEating = false;

          // Check for nearby food
          const nearbyFood = food.find(f => {
            const dx = f.x - fish.x;
            const dy = f.y - fish.y;
            return Math.sqrt(dx * dx + dy * dy) < 15;
          });

          if (nearbyFood) {
            // Swim toward food
            const dx = nearbyFood.x - fish.x;
            const dy = nearbyFood.y - fish.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 3) {
              // Eat food
              isEating = true;
              setFood(prev => prev.filter(f => f.id !== nearbyFood.id));
            } else {
              newVx = (dx / dist) * 0.8;
              newVy = (dy / dist) * 0.8;
            }
          } else {
            // Random swimming behavior
            newVx += (Math.random() - 0.5) * 0.1;
            newVy += (Math.random() - 0.5) * 0.1;

            // Speed limit
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 0.6) {
              newVx = (newVx / speed) * 0.6;
              newVy = (newVy / speed) * 0.6;
            }

            // Boundary avoidance
            if (fish.x < 10) newVx += 0.05;
            if (fish.x > 90) newVx -= 0.05;
            if (fish.y < 10) newVy += 0.05;
            if (fish.y > 90) newVy -= 0.05;
          }

          newX += newVx;
          newY += newVy;

          // Keep in bounds
          newX = Math.max(5, Math.min(95, newX));
          newY = Math.max(5, Math.min(95, newY));

          // Calculate direction
          const direction = Math.atan2(newVy, newVx);

          return {
            ...fish,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            direction,
            isEating,
          };
        })
      );

      // Update ripples
      setRipples(currentRipples =>
        currentRipples
          .map(r => ({
            ...r,
            size: r.size + 1,
            opacity: r.opacity - 0.02,
          }))
          .filter(r => r.opacity > 0)
      );

      // Slowly decrease cleanliness
      if (Math.random() < 0.01) {
        setPondCleanliness(prev => Math.max(0, prev - 0.1));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [food]);

  const getKoiTransform = (fish: Koi) => {
    const rotation = (fish.direction * 180) / Math.PI;
    const isFlipped = Math.abs(rotation) > 90;
    return `rotate(${rotation}deg) ${isFlipped ? 'scaleY(-1)' : ''}`;
  };

  return (
    <section className={styles.koiPond}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Fish className={styles.icon} size={28} />
          Koi Pond
          <Fish className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          A peaceful digital pond. Click to feed the koi, watch them swim.
        </p>
      </header>

      <div className={styles.mainContent}>
        <div
          ref={containerRef}
          className={styles.pond}
          onClick={addFood}
          style={{
            filter: `brightness(${0.7 + pondCleanliness / 200})`,
          }}
        >
          {/* Water gradient */}
          <div className={styles.water} />
          
          {/* Lily pads */}
          <div className={styles.lilyPad} style={{ left: '15%', top: '20%' }} />
          <div className={styles.lilyPad} style={{ left: '75%', top: '70%', transform: 'rotate(45deg)' }} />
          <div className={styles.lilyPad} style={{ left: '60%', top: '15%', transform: 'rotate(-30deg)' }} />

          {/* Ripples */}
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: `${ripple.x}%`,
                top: `${ripple.y}%`,
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                opacity: ripple.opacity,
              }}
            />
          ))}

          {/* Food */}
          {food.map(f => (
            <div
              key={f.id}
              className={styles.food}
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
              }}
            />
          ))}

          {/* Koi */}
          {koi.map(fish => (
            <div
              key={fish.id}
              className={`${styles.koi} ${fish.isEating ? styles.eating : ''}`}
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                width: `${fish.size}px`,
                height: `${fish.size * 0.4}px`,
                transform: getKoiTransform(fish),
              }}
            >
              <svg viewBox="0 0 100 40" className={styles.koiSvg}>
                <defs>
                  <linearGradient id={`gradient-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={KOI_COLORS[fish.pattern].primary} />
                    <stop offset="50%" stopColor={KOI_COLORS[fish.pattern].secondary} />
                    <stop offset="100%" stopColor={KOI_COLORS[fish.pattern].primary} />
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="20" rx="45" ry="18" fill={`url(#gradient-${fish.id})`} />
                <ellipse cx="85" cy="20" rx="8" ry="12" fill={KOI_COLORS[fish.pattern].primary} />
                <circle cx="88" cy="17" r="2" fill="#000" />
                <path d="M 15 20 L 5 10 L 5 30 Z" fill={KOI_COLORS[fish.pattern].secondary} />
              </svg>
            </div>
          ))}

          {/* Click hint */}
          {koi.length > 0 && food.length === 0 && (
            <div className={styles.clickHint}>
              <Cookie size={20} />
              Click to feed
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.addKoi}>
            <h3 className={styles.sectionTitle}>Add Koi</h3>
            <div className={styles.koiTypes}>
              {Object.entries(KOI_COLORS).map(([pattern, info]) => (
                <button
                  key={pattern}
                  className={styles.koiType}
                  onClick={() => addKoi(pattern as Koi['pattern'])}
                  disabled={koi.length >= 10}
                >
                  <div
                    className={styles.koiPreview}
                    style={{
                      background: `linear-gradient(90deg, ${info.primary} 50%, ${info.secondary} 50%)`,
                    }}
                  />
                  <span>{info.name}</span>
                </button>
              ))}
            </div>
            
            <div className={styles.koiCount}>
              {koi.length} / 10 koi
            </div>
          </div>

          <div className={styles.pondStats}>
            <h3 className={styles.sectionTitle}>Pond Status</h3>
            
            <div className={styles.stat}>
              <span>Cleanliness</span>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${pondCleanliness}%`,
                    background: pondCleanliness > 70 ? '#4CAF50' : pondCleanliness > 30 ? '#FF9800' : '#E53935',
                  }}
                />
              </div>
              <span>{Math.round(pondCleanliness)}%</span>
            </div>
            
            <button
              className={styles.cleanButton}
              onClick={cleanPond}
              disabled={pondCleanliness >= 95}
            >
              <Droplets size={16} />
              Clean Pond
            </button>
          </div>

          <div className={styles.stats}>
            <h3 className={styles.sectionTitle}>Statistics</h3>
            
            <div className={styles.statItem}>
              <span>Total Koi</span>
              <strong>{koi.length}</strong>
            </div>
            
            <div className={styles.statItem}>
              <span>Times Fed</span>
              <strong>{totalFed}</strong>
            </div>
            
            <div className={styles.statItem}>
              <span>Pond Health</span>
              <strong className={pondCleanliness > 70 ? styles.good : pondCleanliness > 30 ? styles.warning : styles.bad}>
                {pondCleanliness > 70 ? 'Good' : pondCleanliness > 30 ? 'Fair' : 'Poor'}
              </strong>
            </div>
          </div>

          <button className={styles.resetButton} onClick={() => setKoi([])}>
            <RefreshCw size={16} />
            Clear Pond
          </button>
        </div>
      </div>
    </section>
  );
}
