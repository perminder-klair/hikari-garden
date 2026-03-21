import { useState, useEffect } from 'react';
import styles from './WindRoses.module.css';

interface Direction {
  name: string;
  angle: number;
  symbol: string;
  color: string;
}

interface LifePath {
  id: string;
  direction: string;
  goal: string;
  progress: number;
  createdAt: string;
}

const directions: Direction[] = [
  { name: 'North', angle: 0, symbol: '🧭', color: 'rgba(147, 197, 253, 0.8)' },
  { name: 'Northeast', angle: 45, symbol: '↗', color: 'rgba(167, 139, 250, 0.8)' },
  { name: 'East', angle: 90, symbol: '🌅', color: 'rgba(253, 186, 116, 0.8)' },
  { name: 'Southeast', angle: 135, symbol: '↘', color: 'rgba(249, 168, 212, 0.8)' },
  { name: 'South', angle: 180, symbol: '🔥', color: 'rgba(252, 129, 129, 0.8)' },
  { name: 'Southwest', angle: 225, symbol: '↙', color: 'rgba(198, 168, 124, 0.8)' },
  { name: 'West', angle: 270, symbol: '🌄', color: 'rgba(155, 206, 167, 0.8)' },
  { name: 'Northwest', angle: 315, symbol: '↖', color: 'rgba(147, 197, 253, 0.8)' },
];

const aspectSymbols: Record<string, string> = {
  Career: '💼',
  Health: '💪',
  Relationships: '❤️',
  Growth: '🌱',
  Creativity: '🎨',
  Finance: '💰',
  Knowledge: '📚',
  Adventure: '✈️',
};

export default function WindRoses() {
  const [paths, setPaths] = useState<LifePath[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [goalText, setGoalText] = useState('');
  const [compassRotation, setCompassRotation] = useState(0);
  const [hoveredDirection, setHoveredDirection] = useState<string | null>(null);

  useEffect(() => {
    const savedPaths = localStorage.getItem('windRosePaths');
    if (savedPaths) {
      setPaths(JSON.parse(savedPaths));
    }
  }, []);

  useEffect(() => {
    if (paths.length > 0) {
      localStorage.setItem('windRosePaths', JSON.stringify(paths));
    }
  }, [paths]);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      setCompassRotation(prev => (prev + 0.02) % 360);
      frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => cancelAnimationFrame(frame), 5000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, []);

  const handleAddPath = () => {
    if (!selectedDirection || !goalText.trim()) return;

    const newPath: LifePath = {
      id: Date.now().toString(),
      direction: selectedDirection,
      goal: goalText.trim(),
      progress: 0,
      createdAt: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      }),
    };

    setPaths(prev => [...prev, newPath]);
    setSelectedDirection('');
    setGoalText('');
  };

  const handleProgress = (id: string, delta: number) => {
    setPaths(prev => prev.map(p => ({
      ...p,
      progress: Math.min(100, Math.max(0, p.progress + delta)),
    })));
  };

  const handleDelete = (id: string) => {
    setPaths(prev => prev.filter(p => p.id !== id));
  };

  const getDirectionColor = (direction: string): string => {
    return directions.find(d => d.name === direction)?.color || 'rgba(255,255,255,0.5)';
  };

  return (
    <div className={styles.windRoses}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.icon}>🧭</span>
          <div>
            <h2 className={styles.title}>WindRoses</h2>
            <p className={styles.subtitle}>Navigate your life's compass</p>
          </div>
        </div>
      </div>

      <div className={styles.compassContainer}>
        <div 
          className={styles.compass}
          style={{ transform: `rotate(${hoveredDirection ? directions.find(d => d.name === hoveredDirection)?.angle || 0 : 0}deg)` }}
        >
          <div className={styles.compassRing} />
          <div className={styles.compassCenter}>
            <span className={styles.centerIcon}>✦</span>
          </div>
          
          {directions.map(dir => {
            const hasPath = paths.some(p => p.direction === dir.name);
            return (
              <div
                key={dir.name}
                className={`${styles.direction} ${hasPath ? styles.active : ''} ${hoveredDirection === dir.name ? styles.hovered : ''}`}
                style={{ 
                  transform: `rotate(${dir.angle}deg) translateY(-100px) rotate(-${dir.angle}deg)`,
                  '--dir-color': dir.color,
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredDirection(dir.name)}
                onMouseLeave={() => setHoveredDirection(null)}
              >
                <span className={styles.directionSymbol}>{dir.symbol}</span>
                <span className={styles.directionName}>{dir.name}</span>
                {hasPath && <span className={styles.pathIndicator}>●</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.pathForm}>
          <h3 className={styles.sectionTitle}>🌟 Set Your Course</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Choose Direction</label>
            <div className={styles.directionPicker}>
              {directions.map(dir => (
                <button
                  key={dir.name}
                  className={`${styles.dirBtn} ${selectedDirection === dir.name ? styles.selected : ''}`}
                  onClick={() => setSelectedDirection(dir.name)}
                  style={{ '--dir-color': dir.color } as React.CSSProperties}
                >
                  <span>{dir.symbol}</span>
                  <span>{dir.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Define Your Goal</label>
            <textarea
              className={styles.input}
              placeholder="What do you want to achieve in this direction?"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              rows={3}
            />
          </div>

          <button 
            className={styles.addBtn}
            onClick={handleAddPath}
            disabled={!selectedDirection || !goalText.trim()}
          >
            ✦ Chart Your Path
          </button>
        </div>

        <div className={styles.pathsList}>
          <h3 className={styles.sectionTitle}>🗺️ Active Paths ({paths.length})</h3>
          
          {paths.length === 0 ? (
            <p className={styles.empty}>No paths set. Begin by choosing a direction and defining your first goal.</p>
          ) : (
            <div className={styles.paths}>
              {paths.map(path => {
                const dir = directions.find(d => d.name === path.direction);
                return (
                  <div 
                    key={path.id} 
                    className={styles.pathCard}
                    style={{ borderColor: getDirectionColor(path.direction) }}
                  >
                    <div className={styles.pathHeader}>
                      <span className={styles.pathIcon}>{dir?.symbol}</span>
                      <div className={styles.pathInfo}>
                        <h4 className={styles.pathDirection}>{path.direction}</h4>
                        <p className={styles.pathDate}>Started {path.createdAt}</p>
                      </div>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(path.id)}
                      >
                        ×
                      </button>
                    </div>
                    
                    <p className={styles.pathGoal}>{path.goal}</p>
                    
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span>Progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${path.progress}%`,
                            background: getDirectionColor(path.direction),
                          }}
                        />
                      </div>
                      <div className={styles.progressControls}>
                        <button onClick={() => handleProgress(path.id, -10)}>-10</button>
                        <button onClick={() => handleProgress(path.id, -5)}>-5</button>
                        <button onClick={() => handleProgress(path.id, 5)}>+5</button>
                        <button onClick={() => handleProgress(path.id, 10)}>+10</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.legend}>
        <h3 className={styles.sectionTitle}>🧭 Direction Meanings</h3>
        <div className={styles.legendGrid}>
          {Object.entries(aspectSymbols).map(([aspect, symbol]) => (
            <div key={aspect} className={styles.legendItem}>
              <span className={styles.legendSymbol}>{symbol}</span>
              <span className={styles.legendText}>{aspect}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
