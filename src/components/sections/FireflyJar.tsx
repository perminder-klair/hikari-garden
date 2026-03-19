import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Moon, Plus, Trash2, RefreshCw, Lock, Unlock } from 'lucide-react';
import styles from './FireflyJar.module.css';

interface Firefly {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
  color: string;
}

interface Jar {
  id: number;
  name: string;
  fireflies: Firefly[];
  isLocked: boolean;
  createdAt: string;
}

const FIREFLY_COLORS = ['#FFD700', '#ADFF2F', '#00CED1', '#FF6B6B', '#DDA0DD'];

export default function FireflyJar() {
  const [jars, setJars] = useState<Jar[]>([
    {
      id: 1,
      name: 'Evening Garden',
      fireflies: [],
      isLocked: false,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeJarId, setActiveJarId] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showNewJarModal, setShowNewJarModal] = useState(false);
  const [newJarName, setNewJarName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const activeJar = jars.find(j => j.id === activeJarId) || jars[0];

  // Animation loop for fireflies
  useEffect(() => {
    const animate = () => {
      setJars(currentJars =>
        currentJars.map(jar => {
          if (jar.isLocked) return jar;
          
          return {
            ...jar,
            fireflies: jar.fireflies.map(firefly => {
              let newX = firefly.x + firefly.vx;
              let newY = firefly.y + firefly.vy;
              let newVx = firefly.vx;
              let newVy = firefly.vy;

              // Boundary collision
              if (newX <= 5 || newX >= 95) {
                newVx = -newVx * 0.8;
                newX = Math.max(5, Math.min(95, newX));
              }
              if (newY <= 5 || newY >= 85) {
                newVy = -newVy * 0.8;
                newY = Math.max(5, Math.min(85, newY));
              }

              // Random movement
              newVx += (Math.random() - 0.5) * 0.3;
              newVy += (Math.random() - 0.5) * 0.3;

              // Dampening
              newVx *= 0.99;
              newVy *= 0.99;

              // Speed limit
              const speed = Math.sqrt(newVx * newVx + newVy * newVy);
              if (speed > 1.5) {
                newVx = (newVx / speed) * 1.5;
                newVy = (newVy / speed) * 1.5;
              }

              return {
                ...firefly,
                x: newX,
                y: newY,
                vx: newVx,
                vy: newVy,
                pulsePhase: firefly.pulsePhase + 0.05,
              };
            }),
          };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const addFirefly = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || activeJar.isLocked) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newFirefly: Firefly = {
      id: Date.now() + Math.random(),
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(85, y)),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 4 + Math.random() * 4,
      opacity: 0.6 + Math.random() * 0.4,
      pulsePhase: Math.random() * Math.PI * 2,
      color: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
    };

    setJars(prev =>
      prev.map(jar =>
        jar.id === activeJarId
          ? { ...jar, fireflies: [...jar.fireflies, newFirefly] }
          : jar
      )
    );
  }, [activeJarId, activeJar.isLocked]);

  const removeFirefly = useCallback((fireflyId: number) => {
    if (activeJar.isLocked) return;
    setJars(prev =>
      prev.map(jar =>
        jar.id === activeJarId
          ? { ...jar, fireflies: jar.fireflies.filter(f => f.id !== fireflyId) }
          : jar
      )
    );
  }, [activeJarId, activeJar.isLocked]);

  const clearJar = useCallback(() => {
    if (activeJar.isLocked) return;
    setJars(prev =>
      prev.map(jar =>
        jar.id === activeJarId ? { ...jar, fireflies: [] } : jar
      )
    );
  }, [activeJarId, activeJar.isLocked]);

  const toggleLock = useCallback(() => {
    setJars(prev =>
      prev.map(jar =>
        jar.id === activeJarId ? { ...jar, isLocked: !jar.isLocked } : jar
      )
    );
  }, [activeJarId]);

  const createNewJar = useCallback(() => {
    if (!newJarName.trim()) return;
    
    const newJar: Jar = {
      id: Date.now(),
      name: newJarName.trim(),
      fireflies: [],
      isLocked: false,
      createdAt: new Date().toISOString(),
    };
    
    setJars(prev => [...prev, newJar]);
    setActiveJarId(newJar.id);
    setNewJarName('');
    setShowNewJarModal(false);
  }, [newJarName]);

  const deleteJar = useCallback((jarId: number) => {
    if (jars.length <= 1) return;
    setJars(prev => {
      const filtered = prev.filter(j => j.id !== jarId);
      if (activeJarId === jarId) {
        setActiveJarId(filtered[0].id);
      }
      return filtered;
    });
  }, [jars.length, activeJarId]);

  const autoFill = useCallback(() => {
    if (activeJar.isLocked) return;
    
    const newFireflies: Firefly[] = [];
    for (let i = 0; i < 10; i++) {
      newFireflies.push({
        id: Date.now() + i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 70,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 4 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        color: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
      });
    }
    
    setJars(prev =>
      prev.map(jar =>
        jar.id === activeJarId
          ? { ...jar, fireflies: [...jar.fireflies, ...newFireflies] }
          : jar
      )
    );
  }, [activeJarId, activeJar.isLocked]);

  return (
    <section className={styles.fireflyJar}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Sparkles className={styles.icon} size={28} />
          Firefly Jar
          <Sparkles className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Capture glowing moments. Click to add fireflies, watch them dance.
        </p>
      </header>

      <div className={styles.jarSelector}>
        {jars.map(jar => (
          <button
            key={jar.id}
            className={`${styles.jarTab} ${activeJarId === jar.id ? styles.active : ''}`}
            onClick={() => setActiveJarId(jar.id)}
          >
            <Moon size={14} />
            {jar.name}
            {jar.isLocked && <Lock size={12} />}
            {jars.length > 1 && (
              <button
                className={styles.deleteJar}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteJar(jar.id);
                }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </button>
        ))}
        <button
          className={styles.newJarButton}
          onClick={() => setShowNewJarModal(true)}
        >
          <Plus size={16} />
          New Jar
        </button>
      </div>

      <div className={styles.mainContent}>
        <div
          ref={containerRef}
          className={`${styles.jarContainer} ${isCapturing ? styles.capturing : ''} ${activeJar.isLocked ? styles.locked : ''}`}
          onClick={addFirefly}
        >
          {/* Jar background effects */}
          <div className={styles.jarGlow} />
          
          {/* Fireflies */}
          {activeJar.fireflies.map(firefly => {
            const pulseOpacity = 0.5 + Math.sin(firefly.pulsePhase) * 0.3;
            return (
              <div
                key={firefly.id}
                className={styles.firefly}
                style={{
                  left: `${firefly.x}%`,
                  top: `${firefly.y}%`,
                  width: `${firefly.size}px`,
                  height: `${firefly.size}px`,
                  backgroundColor: firefly.color,
                  opacity: firefly.opacity * pulseOpacity,
                  boxShadow: `0 0 ${firefly.size * 2}px ${firefly.color}`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFirefly(firefly.id);
                }}
              />
            );
          })}

          {/* Jar glass overlay */}
          <div className={styles.jarGlass}>
            <div className={styles.jarRim} />
            <div className={styles.jarHighlight} />
          </div>

          {/* Empty state */}
          {activeJar.fireflies.length === 0 && (
            <div className={styles.emptyState}>
              <Sparkles size={48} className={styles.emptyIcon} />
              <p>Click anywhere to catch fireflies</p>
              <span>Or use Auto Fill below</span>
            </div>
          )}

          {/* Count */}
          <div className={styles.fireflyCount}>
            {activeJar.fireflies.length} firefly{activeJar.fireflies.length !== 1 ? 'ies' : ''}
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <h3 className={styles.controlTitle}>Jar Controls</h3>
            
            <button
              className={styles.controlButton}
              onClick={autoFill}
              disabled={activeJar.isLocked}
            >
              <RefreshCw size={18} />
              Auto Fill (10)
            </button>
            
            <button
              className={`${styles.controlButton} ${styles.danger}`}
              onClick={clearJar}
              disabled={activeJar.isLocked || activeJar.fireflies.length === 0}
            >
              <Trash2 size={18} />
              Release All
            </button>
            
            <button
              className={`${styles.controlButton} ${activeJar.isLocked ? styles.locked : ''}`}
              onClick={toggleLock}
            >
              {activeJar.isLocked ? <Unlock size={18} /> : <Lock size={18} />}
              {activeJar.isLocked ? 'Unlock Jar' : 'Lock Jar'}
            </button>
          </div>

          <div className={styles.stats}>
            <h3 className={styles.controlTitle}>Jar Stats</h3>
            
            <div className={styles.statItem}>
              <span>Total Fireflies</span>
              <strong>{activeJar.fireflies.length}</strong>
            </div>
            
            <div className={styles.statItem}>
              <span>Created</span>
              <strong>{new Date(activeJar.createdAt).toLocaleDateString()}</strong>
            </div>
            
            <div className={styles.statItem}>
              <span>Status</span>
              <strong className={activeJar.isLocked ? styles.lockedText : styles.unlockedText}>
                {activeJar.isLocked ? '🔒 Locked' : '🔓 Open'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* New Jar Modal */}
      {showNewJarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Create New Jar</h3>
            <input
              type="text"
              placeholder="Jar name..."
              value={newJarName}
              onChange={(e) => setNewJarName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNewJar()}
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button onClick={() => setShowNewJarModal(false)}>Cancel</button>
              <button onClick={createNewJar} disabled={!newJarName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
