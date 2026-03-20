import { useState, useCallback, useRef, useEffect } from 'react';
import { Cloud, Wind, Sun, Moon, Palette, RefreshCw, Download, Sparkles, Droplet, Flame } from 'lucide-react';
import styles from './CloudPaint.module.css';

interface CloudParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  color: string;
  type: 'wispy' | 'fluffy' | 'cumulus' | 'cirrus';
}

interface Brush {
  size: number;
  opacity: number;
  color: string;
  type: 'soft' | 'medium' | 'hard';
}

const PRESET_COLORS = [
  { name: 'Pure White', color: '#FFFFFF', icon: <Cloud size={14} /> },
  { name: 'Sunset Gold', color: '#FFE4B5', icon: <Sun size={14} /> },
  { name: 'Rose Pink', color: '#FFB6C1', icon: <Sparkles size={14} /> },
  { name: 'Lavender', color: '#E6E6FA', icon: <Sparkles size={14} /> },
  { name: 'Sky Blue', color: '#87CEEB', icon: <Wind size={14} /> },
  { name: 'Storm Grey', color: '#778899', icon: <Moon size={14} /> },
];

const BRUSH_TYPES = [
  { type: 'soft' as const, name: 'Soft', softness: 0.3 },
  { type: 'medium' as const, name: 'Medium', softness: 0.6 },
  { type: 'hard' as const, name: 'Hard', softness: 1 },
];

export default function CloudPaint() {
  const [clouds, setClouds] = useState<CloudParticle[]>([]);
  const [brush, setBrush] = useState<Brush>({
    size: 60,
    opacity: 0.7,
    color: '#FFFFFF',
    type: 'soft',
  });
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isWindBlowing, setIsWindBlowing] = useState(false);
  const [windStrength, setWindStrength] = useState(0.5);
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Wind animation
  useEffect(() => {
    if (!isWindBlowing) return;

    const animate = () => {
      setTime(prev => prev + 1);
      setClouds(currentClouds =>
        currentClouds.map(cloud => ({
          ...cloud,
          x: cloud.x + cloud.speed * windStrength * 0.5,
          drift: cloud.drift + Math.sin(time * 0.01 + cloud.id) * 0.2,
        }))
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isWindBlowing, windStrength, time]);

  const addCloud = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCloud: CloudParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: brush.size * (0.8 + Math.random() * 0.4),
      opacity: brush.opacity,
      speed: 0.1 + Math.random() * 0.3,
      drift: Math.random() * Math.PI * 2,
      color: selectedColor.color,
      type: ['wispy', 'fluffy', 'cumulus', 'cirrus'][Math.floor(Math.random() * 4)] as CloudParticle['type'],
    };

    setClouds(prev => [...prev, newCloud]);
  }, [brush, selectedColor]);

  const removeCloud = useCallback((id: number) => {
    setClouds(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setClouds([]);
  }, []);

  const scatterClouds = useCallback(() => {
    const newClouds: CloudParticle[] = [];
    for (let i = 0; i < 5; i++) {
      newClouds.push({
        id: Date.now() + i,
        x: Math.random() * 80,
        y: 10 + Math.random() * 60,
        size: 40 + Math.random() * 60,
        opacity: 0.5 + Math.random() * 0.4,
        speed: 0.1 + Math.random() * 0.3,
        drift: Math.random() * Math.PI * 2,
        color: selectedColor.color,
        type: ['wispy', 'fluffy', 'cumulus', 'cirrus'][Math.floor(Math.random() * 4)] as CloudParticle['type'],
      });
    }
    setClouds(prev => [...prev, ...newClouds]);
  }, [selectedColor]);

  const updateBrush = useCallback((updates: Partial<Brush>) => {
    setBrush(prev => ({ ...prev, ...updates }));
  }, []);

  const getCloudStyle = (cloud: CloudParticle) => {
    const softness = BRUSH_TYPES.find(b => b.type === brush.type)?.softness || 0.5;
    const driftOffset = Math.sin(time * 0.02 + cloud.drift) * 5;

    return {
      left: `${cloud.x}%`,
      top: `${cloud.y + driftOffset}%`,
      width: cloud.size,
      height: cloud.size * 0.6,
      opacity: cloud.opacity * softness,
      background: `radial-gradient(ellipse at center, ${cloud.color} 0%, ${cloud.color}00 70%)`,
      filter: `blur(${cloud.size * 0.15}px)`,
    };
  };

  const renderCloudShape = (cloud: CloudParticle) => {
    switch (cloud.type) {
      case 'wispy':
        return (
          <div
            style={{
              ...getCloudStyle(cloud),
              width: cloud.size * 1.5,
              height: cloud.size * 0.2,
              borderRadius: '50%',
              filter: `blur(${cloud.size * 0.3}px)`,
            }}
          />
        );
      case 'cirrus':
        return (
          <div style={{ position: 'relative' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  ...getCloudStyle(cloud),
                  left: `${i * 30}%`,
                  top: `${i * 10}%`,
                }}
              />
            ))}
          </div>
        );
      case 'cumulus':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{ ...getCloudStyle(cloud), transform: 'translate(-50%, -50%)' }} />
            <div style={{ ...getCloudStyle({ ...cloud, size: cloud.size * 0.7 }), left: `${cloud.x - 15}%`, top: `${cloud.y + 5}%` }} />
            <div style={{ ...getCloudStyle({ ...cloud, size: cloud.size * 0.8 }), left: `${cloud.x + 15}%`, top: `${cloud.y + 5}%` }} />
          </div>
        );
      default:
        return <div style={getCloudStyle(cloud)} />;
    }
  };

  return (
    <section className={styles.cloudPaint}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Cloud className={styles.icon} size={28} />
          Cloud Paint
          <Wind className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Paint the sky with clouds. Click to add, create dreamy scenes.
        </p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.controls}>
          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>
              <Palette size={16} />
              Cloud Color
            </h3>

            <div className={styles.colorGrid}>
              {PRESET_COLORS.map(c => (
                <button
                  key={c.name}
                  className={`${styles.colorBtn} ${selectedColor.name === c.name ? styles.selected : ''}`}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  style={{
                    backgroundColor: c.color,
                    borderColor: selectedColor.name === c.name ? c.color : undefined,
                    boxShadow: selectedColor.name === c.name ? `0 0 15px ${c.color}66` : undefined,
                  }}
                >
                  {c.icon}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>
              <Wind size={16} />
              Brush Settings
            </h3>

            <div className={styles.brushControl}>
              <label>
                Size: {brush.size}px
              </label>
              <input
                type="range"
                min="20"
                max="120"
                value={brush.size}
                onChange={(e) => updateBrush({ size: Number(e.target.value) })}
              />
            </div>

            <div className={styles.brushControl}>
              <label>
                Opacity: {Math.round(brush.opacity * 100)}%
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={brush.opacity * 100}
                onChange={(e) => updateBrush({ opacity: Number(e.target.value) / 100 })}
              />
            </div>

            <div className={styles.brushTypes}>
              {BRUSH_TYPES.map(b => (
                <button
                  key={b.type}
                  className={`${styles.brushBtn} ${brush.type === b.type ? styles.selected : ''}`}
                  onClick={() => updateBrush({ type: b.type })}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>Wind Effects</h3>

            <button
              className={`${styles.actionBtn} ${isWindBlowing ? styles.active : ''}`}
              onClick={() => setIsWindBlowing(!isWindBlowing)}
            >
              <Wind size={18} />
              {isWindBlowing ? 'Stop Wind' : 'Start Wind'}
            </button>

            {isWindBlowing && (
              <div className={styles.brushControl}>
                <label>Strength: {Math.round(windStrength * 100)}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={windStrength * 100}
                  onChange={(e) => setWindStrength(Number(e.target.value) / 100)}
                />
              </div>
            )}
          </div>

          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>Actions</h3>

            <button className={styles.actionBtn} onClick={scatterClouds}>
              <Sparkles size={18} />
              Scatter (5)
            </button>

            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={clearAll}
              disabled={clouds.length === 0}
            >
              <RefreshCw size={18} />
              Clear Sky
            </button>
          </div>

          <div className={styles.stats}>
            <h3 className={styles.controlTitle}>Stats</h3>
            <div className={styles.statRow}>
              <span>Clouds</span>
              <strong>{clouds.length}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Wind</span>
              <strong>{isWindBlowing ? `${Math.round(windStrength * 100)}%` : 'Off'}</strong>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className={styles.sky}
          onClick={addCloud}
        >
          {/* Sky gradient background */}
          <div className={styles.skyGradient} />

          {/* Sun/moon */}
          <div className={styles.celestialBody}>
            <Sun size={40} className={styles.sunIcon} />
          </div>

          {/* Clouds */}
          {clouds.map(cloud => (
            <div
              key={cloud.id}
              className={styles.cloud}
              onClick={(e) => {
                e.stopPropagation();
                removeCloud(cloud.id);
              }}
            >
              {renderCloudShape(cloud)}
            </div>
          ))}

          {/* Empty state */}
          {clouds.length === 0 && (
            <div className={styles.emptyState}>
              <Cloud size={48} className={styles.emptyIcon} />
              <p>Click anywhere to paint clouds</p>
              <span>Use wind to make them drift</span>
            </div>
          )}

          {/* Count badge */}
          <div className={styles.countBadge}>
            {clouds.length} cloud{clouds.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </section>
  );
}
