import { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Heart, Star, Moon, Plus, Minus, Download, Trash2, Sparkles } from 'lucide-react';
import styles from './LanternWalk.module.css';

interface Lantern {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  flickerSpeed: number;
  floatOffset: number;
  glowIntensity: number;
}

interface Collection {
  id: number;
  name: string;
  lanterns: Lantern[];
  createdAt: string;
}

const LANTERN_COLORS = [
  { name: 'Amber', color: '#FFB347', glow: 'rgba(255, 179, 71, 0.4)' },
  { name: 'Rose', color: '#FF6B9D', glow: 'rgba(255, 107, 157, 0.4)' },
  { name: 'Lavender', color: '#B19CD9', glow: 'rgba(177, 156, 217, 0.4)' },
  { name: 'Cyan', color: '#00CED1', glow: 'rgba(0, 206, 209, 0.4)' },
  { name: 'Coral', color: '#FF7F7F', glow: 'rgba(255, 127, 127, 0.4)' },
  { name: 'Mint', color: '#98FB98', glow: 'rgba(152, 251, 152, 0.4)' },
];

export default function LanternWalk() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 1,
      name: 'Evening Garden',
      lanterns: [],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeCollectionId, setActiveCollectionId] = useState(1);
  const [selectedColor, setSelectedColor] = useState(LANTERN_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(50);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [isFloating, setIsFloating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);

  const activeCollection = collections.find(c => c.id === activeCollectionId) || collections[0];

  // Floating animation
  useEffect(() => {
    if (!isFloating) {
      setTime(0);
      return;
    }

    const animate = () => {
      setTime(prev => prev + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isFloating]);

  const addLantern = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newLantern: Lantern = {
      id: Date.now() + Math.random(),
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(90, y)),
      size: selectedSize,
      color: selectedColor.color,
      flickerSpeed: 0.5 + Math.random() * 1,
      floatOffset: Math.random() * Math.PI * 2,
      glowIntensity: 0.7 + Math.random() * 0.3,
    };

    setCollections(prev =>
      prev.map(col =>
        col.id === activeCollectionId
          ? { ...col, lanterns: [...col.lanterns, newLantern] }
          : col
      )
    );
  }, [activeCollectionId, selectedColor, selectedSize]);

  const removeLantern = useCallback((id: number) => {
    setCollections(prev =>
      prev.map(col =>
        col.id === activeCollectionId
          ? { ...col, lanterns: col.lanterns.filter(l => l.id !== id) }
          : col
      )
    );
  }, [activeCollectionId]);

  const clearAll = useCallback(() => {
    setCollections(prev =>
      prev.map(col =>
        col.id === activeCollectionId
          ? { ...col, lanterns: [] }
          : col
      )
    );
  }, [activeCollectionId]);

  const autoScatter = useCallback(() => {
    const newLanterns: Lantern[] = [];
    for (let i = 0; i < 8; i++) {
      newLanterns.push({
        id: Date.now() + i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 70,
        size: 40 + Math.random() * 30,
        color: LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)].color,
        flickerSpeed: 0.5 + Math.random() * 1,
        floatOffset: Math.random() * Math.PI * 2,
        glowIntensity: 0.7 + Math.random() * 0.3,
      });
    }

    setCollections(prev =>
      prev.map(col =>
        col.id === activeCollectionId
          ? { ...col, lanterns: [...col.lanterns, ...newLanterns] }
          : col
      )
    );
  }, [activeCollectionId]);

  const createCollection = useCallback(() => {
    if (!newName.trim()) return;

    const newCollection: Collection = {
      id: Date.now(),
      name: newName.trim(),
      lanterns: [],
      createdAt: new Date().toISOString(),
    };

    setCollections(prev => [...prev, newCollection]);
    setActiveCollectionId(newCollection.id);
    setNewName('');
    setShowNewModal(false);
  }, [newName]);

  const deleteCollection = useCallback((id: number) => {
    if (collections.length <= 1) return;
    setCollections(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeCollectionId === id) {
        setActiveCollectionId(filtered[0].id);
      }
      return filtered;
    });
  }, [collections.length, activeCollectionId]);

  const getGlowStyle = (lantern: Lantern) => {
    const flicker = Math.sin(time * lantern.flickerSpeed + lantern.floatOffset) * 0.3 + 0.7;
    const floatY = isFloating ? Math.sin(time + lantern.floatOffset) * 3 : 0;
    const currentColor = LANTERN_COLORS.find(c => c.color === lantern.color) || LANTERN_COLORS[0];

    return {
      transform: `translateY(${floatY}px)`,
      opacity: lantern.glowIntensity * flicker,
      boxShadow: `0 0 ${lantern.size}px ${lantern.size / 2}px ${currentColor.glow}`,
    };
  };

  return (
    <section className={styles.lanternWalk}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Flame className={styles.icon} size={28} />
          Lantern Walk
          <Sparkles className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Light your way through the night. Click to place glowing lanterns.
        </p>
      </header>

      <div className={styles.collectionTabs}>
        {collections.map(col => (
          <button
            key={col.id}
            className={`${styles.tab} ${activeCollectionId === col.id ? styles.active : ''}`}
            onClick={() => setActiveCollectionId(col.id)}
          >
            <Moon size={14} />
            {col.name}
            {collections.length > 1 && (
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCollection(col.id);
                }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </button>
        ))}
        <button className={styles.newTab} onClick={() => setShowNewModal(true)}>
          <Plus size={16} />
          New Path
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.controls}>
          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>
              <Flame size={16} />
              Lantern Style
            </h3>

            <div className={styles.colorGrid}>
              {LANTERN_COLORS.map(c => (
                <button
                  key={c.name}
                  className={`${styles.colorBtn} ${selectedColor.name === c.name ? styles.selected : ''}`}
                  style={{ backgroundColor: c.color, boxShadow: `0 0 10px ${c.glow}` }}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                />
              ))}
            </div>

            <div className={styles.sizeControl}>
              <label>
                <Minus size={14} />
                Size
                <Plus size={14} />
              </label>
              <input
                type="range"
                min="30"
                max="80"
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
              />
              <span>{selectedSize}px</span>
            </div>
          </div>

          <div className={styles.controlPanel}>
            <h3 className={styles.controlTitle}>Actions</h3>

            <button className={styles.actionBtn} onClick={autoScatter}>
              <Star size={18} />
              Scatter (8)
            </button>

            <button
              className={`${styles.actionBtn} ${isFloating ? styles.active : ''}`}
              onClick={() => setIsFloating(!isFloating)}
            >
              {isFloating ? <Heart size={18} /> : <Moon size={18} />}
              {isFloating ? 'Float On' : 'Float Off'}
            </button>

            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={clearAll}
              disabled={activeCollection.lanterns.length === 0}
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>

          <div className={styles.stats}>
            <h3 className={styles.controlTitle}>Stats</h3>
            <div className={styles.statRow}>
              <span>Lanterns</span>
              <strong>{activeCollection.lanterns.length}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Created</span>
              <strong>{new Date(activeCollection.createdAt).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className={styles.garden}
          onClick={addLantern}
        >
          {/* Night sky background */}
          <div className={styles.sky}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className={styles.star}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Ground */}
          <div className={styles.ground} />

          {/* Lanterns */}
          {activeCollection.lanterns.map(lantern => {
            const glowStyle = getGlowStyle(lantern);
            return (
              <div
                key={lantern.id}
                className={styles.lantern}
                style={{
                  left: `${lantern.x}%`,
                  top: `${lantern.y}%`,
                  width: lantern.size,
                  height: lantern.size * 1.4,
                  backgroundColor: lantern.color,
                  ...glowStyle,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeLantern(lantern.id);
                }}
              >
                <div className={styles.lanternTop} />
                <div className={styles.lanternBody} />
                <div className={styles.lanternFlame} />
                <div className={styles.lanternGlow} />
              </div>
            );
          })}

          {/* Empty state */}
          {activeCollection.lanterns.length === 0 && (
            <div className={styles.emptyState}>
              <Flame size={48} className={styles.emptyIcon} />
              <p>Click anywhere to place lanterns</p>
              <span>Light up the night sky</span>
            </div>
          )}

          {/* Count badge */}
          <div className={styles.countBadge}>
            {activeCollection.lanterns.length} lantern{activeCollection.lanterns.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* New Collection Modal */}
      {showNewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>New Lantern Path</h3>
            <input
              type="text"
              placeholder="Path name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createCollection()}
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button onClick={() => setShowNewModal(false)}>Cancel</button>
              <button onClick={createCollection} disabled={!newName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
