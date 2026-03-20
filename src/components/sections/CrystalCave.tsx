import { useState, useCallback, useRef } from 'react';
import { Gem, Sparkles, Plus, Trash2, RefreshCw, Layers, Mountain, Grid, Zap } from 'lucide-react';
import styles from './CrystalCave.module.css';

interface Crystal {
  id: number;
  x: number;
  y: number;
  type: keyof typeof CRYSTAL_TYPES;
  size: number;
  rotation: number;
  pulsePhase: number;
}

const CRYSTAL_TYPES = {
  amethyst: {
    name: 'Amethyst',
    color: '#9B59B6',
    glow: 'rgba(155, 89, 182, 0.6)',
    sides: 6,
  },
  quartz: {
    name: 'Quartz',
    color: '#FFFFFF',
    glow: 'rgba(255, 255, 255, 0.5)',
    sides: 6,
  },
  ruby: {
    name: 'Ruby',
    color: '#E74C3C',
    glow: 'rgba(231, 76, 60, 0.6)',
    sides: 6,
  },
  emerald: {
    name: 'Emerald',
    color: '#2ECC71',
    glow: 'rgba(46, 204, 113, 0.6)',
    sides: 6,
  },
  sapphire: {
    name: 'Sapphire',
    color: '#3498DB',
    glow: 'rgba(52, 152, 219, 0.6)',
    sides: 6,
  },
  topaz: {
    name: 'Topaz',
    color: '#F39C12',
    glow: 'rgba(243, 156, 18, 0.6)',
    sides: 6,
  },
};

type FormationType = 'random' | 'cluster' | 'geode' | 'forest';

export default function CrystalCave() {
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [selectedType, setSelectedType] = useState<keyof typeof CRYSTAL_TYPES>('amethyst');
  const [formation, setFormation] = useState<FormationType>('random');
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);

  const addCrystal = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCrystal: Crystal = {
      id: Date.now() + Math.random(),
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(20, Math.min(95, y)),
      type: selectedType,
      size: 30 + Math.random() * 40,
      rotation: Math.random() * 30 - 15,
      pulsePhase: Math.random() * Math.PI * 2,
    };

    setCrystals(prev => [...prev, newCrystal]);
  }, [selectedType]);

  const removeCrystal = useCallback((id: number) => {
    setCrystals(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setCrystals([]);
  }, []);

  const generateFormation = useCallback((type: FormationType) => {
    const newCrystals: Crystal[] = [];

    switch (type) {
      case 'cluster': {
        const centerX = 40 + Math.random() * 20;
        const centerY = 60 + Math.random() * 20;
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 10 + Math.random() * 15;
          newCrystals.push({
            id: Date.now() + i,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius * 0.5,
            type: selectedType,
            size: 25 + Math.random() * 35,
            rotation: Math.random() * 30 - 15,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
        break;
      }
      case 'geode': {
        for (let i = 0; i < 8; i++) {
          const x = 20 + Math.random() * 60;
          const y = 70 + Math.random() * 20;
          newCrystals.push({
            id: Date.now() + i,
            x,
            y,
            type: Object.keys(CRYSTAL_TYPES)[Math.floor(Math.random() * 6)] as keyof typeof CRYSTAL_TYPES,
            size: 40 + Math.random() * 30,
            rotation: Math.random() * 30 - 15,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
        break;
      }
      case 'forest': {
        for (let i = 0; i < 15; i++) {
          newCrystals.push({
            id: Date.now() + i,
            x: 10 + Math.random() * 80,
            y: 50 + Math.random() * 35,
            type: selectedType,
            size: 20 + Math.random() * 50,
            rotation: Math.random() * 10 - 5,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
        break;
      }
      default: {
        for (let i = 0; i < 10; i++) {
          newCrystals.push({
            id: Date.now() + i,
            x: 10 + Math.random() * 80,
            y: 30 + Math.random() * 55,
            type: selectedType,
            size: 25 + Math.random() * 35,
            rotation: Math.random() * 30 - 15,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    setCrystals(prev => [...prev, ...newCrystals]);
  }, [selectedType]);

  const formations: { type: FormationType; name: string; desc: string; icon: React.ReactNode }[] = [
    { type: 'random', name: 'Scatter', desc: 'Random', icon: <Sparkles size={16} /> },
    { type: 'cluster', name: 'Cluster', desc: 'Grouped', icon: <Layers size={16} /> },
    { type: 'geode', name: 'Geode', desc: 'Underground', icon: <Mountain size={16} /> },
    { type: 'forest', name: 'Forest', desc: 'Tall', icon: <Grid size={16} /> },
  ];

  return (
    <section className={styles.crystalCave}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Gem className={styles.icon} size={28} />
          Crystal Cave
          <Sparkles className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Explore a mystical cave. Click to place glowing crystals.
        </p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.controls}>
          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>
              <Gem size={16} />
              Crystal Type
            </h3>

            <div className={styles.crystalSelector}>
              {Object.entries(CRYSTAL_TYPES).map(([key, crystal]) => (
                <button
                  key={key}
                  className={`${styles.crystalBtn} ${selectedType === key ? styles.selected : ''}`}
                  onClick={() => setSelectedType(key as keyof typeof CRYSTAL_TYPES)}
                  style={{
                    borderColor: selectedType === key ? crystal.color : undefined,
                    boxShadow: selectedType === key ? `0 0 15px ${crystal.glow}` : undefined,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill={crystal.color}>
                    <polygon points="12,2 22,12 12,22 2,12" />
                  </svg>
                  {crystal.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>Formations</h3>

            <div className={styles.formationControl}>
              {formations.map(f => (
                <button
                  key={f.type}
                  className={`${styles.formationOption} ${formation === f.type ? styles.selected : ''}`}
                  onClick={() => {
                    setFormation(f.type);
                    generateFormation(f.type);
                  }}
                >
                  {f.icon}
                  <span>{f.name}</span>
                  <strong>{f.desc}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>Actions</h3>

            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={clearAll}
              disabled={crystals.length === 0}
            >
              <Trash2 size={18} />
              Clear Cave
            </button>
          </div>

          <div className={styles.stats}>
            <h3 className={styles.controlTitle}>Stats</h3>
            <div className={styles.statRow}>
              <span>Crystals</span>
              <strong>{crystals.length}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Current</span>
              <strong>{CRYSTAL_TYPES[selectedType].name}</strong>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className={styles.cave}
          onClick={addCrystal}
        >
          <div className={styles.caveGlow} />

          {/* Stalactites */}
          {[10, 25, 40, 55, 70, 85].map((x, i) => (
            <div
              key={i}
              className={styles.stalactite}
              style={{
                left: `${x}%`,
                transform: `translateX(-50%) rotate(${i % 2 === 0 ? 5 : -5}deg)`,
                borderTopWidth: `${60 + Math.random() * 40}px`,
              }}
            />
          ))}

          {/* Ground */}
          <div className={styles.ground} />

          {/* Crystals */}
          {crystals.map(crystal => {
            const crystalType = CRYSTAL_TYPES[crystal.type];
            const pulse = Math.sin(time * 0.05 + crystal.pulsePhase) * 0.2 + 0.8;
            const height = crystal.size * 1.8;
            const width = crystal.size;

            return (
              <div
                key={crystal.id}
                className={styles.crystal}
                style={{
                  left: `${crystal.x}%`,
                  top: `${crystal.y}%`,
                  transform: `translate(-50%, -100%) rotate(${crystal.rotation}deg)`,
                  width: width,
                  height: height,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeCrystal(crystal.id);
                }}
              >
                <div className={styles.crystalShape}>
                  <div
                    className={styles.crystalBody}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${crystalType.color} 0%, ${crystalType.color}dd 50%, ${crystalType.color}99 100%)`,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                      opacity: pulse,
                      boxShadow: `0 0 ${crystal.size / 2}px ${crystalType.glow}`,
                    }}
                  />
                  <div
                    className={styles.crystalHighlight}
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                  <div
                    className={styles.crystalGlow}
                    style={{
                      background: crystalType.glow,
                      opacity: pulse * 0.5,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {crystals.length === 0 && (
            <div className={styles.emptyState}>
              <Gem size={48} className={styles.emptyIcon} />
              <p>Click anywhere to place crystals</p>
              <span>Use formations to create clusters</span>
            </div>
          )}

          {/* Count badge */}
          <div className={styles.countBadge}>
            {crystals.length} crystal{crystals.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </section>
  );
}
