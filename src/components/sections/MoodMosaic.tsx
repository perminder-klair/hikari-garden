import { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, Grid3X3, Eraser, Save, RotateCcw, Layers } from 'lucide-react';
import styles from './MoodMosaic.module.css';

interface MoodTile {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
}

interface DayMosaic {
  date: string;
  tiles: MoodTile[];
}

const MOOD_COLORS = [
  '#FF6B6B', // Energetic Red
  '#FFA94D', // Happy Orange
  '#FFD93D', // Joyful Yellow
  '#6BCB77', // Calm Green
  '#4D96FF', // Peaceful Blue
  '#9B59B6', // Reflective Purple
  '#E91E63', // Passionate Pink
  '#00BCD4', // Serene Cyan
  '#FF5722', // Anxious Coral
  '#607D8B', // Neutral Gray
];

export default function MoodMosaic() {
  const [mosaics, setMosaics] = useState<DayMosaic[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [tiles, setTiles] = useState<MoodTile[]>([]);
  const [selectedColor, setSelectedColor] = useState(MOOD_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(40);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushMode, setBrushMode] = useState<'add' | 'erase'>('add');
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mood-mosaics');
    if (saved) {
      try {
        setMosaics(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load mosaics');
      }
    }
  }, []);

  // Load current day's mosaic
  useEffect(() => {
    const todayMosaic = mosaics.find(m => m.date === currentDate);
    setTiles(todayMosaic?.tiles || []);
  }, [currentDate, mosaics]);

  // Save to localStorage
  useEffect(() => {
    const updatedMosaics = mosaics.filter(m => m.date !== currentDate);
    if (tiles.length > 0) {
      updatedMosaics.push({ date: currentDate, tiles });
    }
    localStorage.setItem('mood-mosaics', JSON.stringify(updatedMosaics));
  }, [tiles, currentDate]);

  const getCanvasPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const addTile = useCallback((x: number, y: number) => {
    const newTile: MoodTile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      x,
      y,
      size: selectedSize,
      color: selectedColor,
      opacity: 0.7 + Math.random() * 0.3,
      rotation: Math.random() * 360,
    };
    setTiles(prev => [...prev, newTile]);
  }, [selectedColor, selectedSize]);

  const removeTileAt = useCallback((x: number, y: number) => {
    setTiles(prev => {
      const idx = prev.findIndex(t => {
        const dx = t.x - x;
        const dy = t.y - y;
        return Math.sqrt(dx * dx + dy * dy) < (t.size / 2);
      });
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  }, []);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasPosition(e);
    if (!pos) return;
    
    if (brushMode === 'add') {
      addTile(pos.x, pos.y);
    } else {
      removeTileAt(pos.x, pos.y);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getCanvasPosition(e);
    if (!pos) return;
    
    if (brushMode === 'add') {
      addTile(pos.x, pos.y);
    } else {
      removeTileAt(pos.x, pos.y);
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (confirm('Clear today\'s mosaic?')) {
      setTiles([]);
    }
  };

  const generatePattern = () => {
    const patternTiles: MoodTile[] = [];
    const gridSize = 6;
    const cellWidth = 100 / gridSize;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        patternTiles.push({
          id: `pattern-${i}-${j}`,
          x: cellWidth * i + cellWidth / 2 + (Math.random() - 0.5) * 10,
          y: cellWidth * j + cellWidth / 2 + (Math.random() - 0.5) * 10,
          size: 30 + Math.random() * 20,
          color: MOOD_COLORS[Math.floor(Math.random() * MOOD_COLORS.length)],
          opacity: 0.5 + Math.random() * 0.5,
          rotation: Math.random() * 360,
        });
      }
    }
    setTiles(patternTiles);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const mosaicDates = Object.keys(mosaics).length > 0 
    ? Object.entries(mosaics).map(m => m[0]).sort() 
    : [];

  return (
    <section className={styles.moodMosaic}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Palette className={styles.icon} size={28} />
          Mood Mosaic
        </h2>
        <p className={styles.subtitle}>
          Create visual mood art. Each tile is a feeling captured.
        </p>
      </header>

      <div className={styles.dateNav}>
        <button onClick={() => navigateDate('prev')}>&larr;</button>
        <span>{new Date(currentDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })}</span>
        <button onClick={() => navigateDate('next')}>
          {currentDate === new Date().toISOString().split('T')[0] ? '↻' : '→'}
        </button>
      </div>

      <div className={styles.tools}>
        <div className={styles.colorPalette}>
          {MOOD_COLORS.map(color => (
            <button
              key={color}
              className={`${styles.colorButton} ${selectedColor === color ? styles.selected : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>

        <div className={styles.brushControls}>
          <div className={styles.sizeSlider}>
            <label>Size</label>
            <input
              type="range"
              min="20"
              max="80"
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
            />
            <span>{selectedSize}px</span>
          </div>
        </div>

        <div className={styles.modeButtons}>
          <button
            className={`${styles.modeButton} ${brushMode === 'add' ? styles.active : ''}`}
            onClick={() => setBrushMode('add')}
          >
            <Layers size={18} />
            Paint
          </button>
          <button
            className={`${styles.modeButton} ${brushMode === 'erase' ? styles.active : ''}`}
            onClick={() => setBrushMode('erase')}
          >
            <Eraser size={18} />
            Erase
          </button>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={generatePattern}>
            <RotateCcw size={16} />
            Random Pattern
          </button>
          <button onClick={clearCanvas}>
            <RotateCcw size={16} />
            Clear
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`${styles.canvas} ${isDrawing ? styles.drawing : ''} ${brushMode === 'erase' ? styles.eraseMode : ''}`}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* Grid background */}
        <div className={styles.gridOverlay} />
        
        {/* Tiles */}
        {tiles.map(tile => (
          <div
            key={tile.id}
            className={styles.tile}
            style={{
              left: `${tile.x}%`,
              top: `${tile.y}%`,
              width: `${tile.size}px`,
              height: `${tile.size}px`,
              backgroundColor: tile.color,
              opacity: tile.opacity,
              transform: `translate(-50%, -50%) rotate(${tile.rotation}deg)`,
            }}
          />
        ))}

        {/* Empty state */}
        {tiles.length === 0 && (
          <div className={styles.emptyState}>
            <Palette size={48} />
            <p>Click or drag to create your mood art</p>
          </div>
        )}

        {/* Tile count */}
        <div className={styles.tileCount}>
          {tiles.length} tiles
        </div>
      </div>

      {/* Mini calendar with mosaic previews */}
      {mosaicDates.length > 0 && (
        <div className={styles.mosaicCalendar}>
          <h3>Your Mood Art</h3>
          <div className={styles.calendarGrid}>
            {mosaicDates.slice(-7).map(date => {
              const mosaic = mosaics.find(m => m.date === date);
              return (
                <div
                  key={date}
                  className={`${styles.calendarDay} ${date === currentDate ? styles.active : ''}`}
                  onClick={() => setCurrentDate(date)}
                >
                  <span className={styles.dayDate}>
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className={styles.dayPreview}>
                    {mosaic?.tiles.slice(0, 6).map((t, i) => (
                      <div
                        key={i}
                        className={styles.previewTile}
                        style={{ backgroundColor: t.color }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
