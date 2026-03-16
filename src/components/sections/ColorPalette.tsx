import { useState } from 'react';
import { Palette, Copy, Check, Plus, Trash2, Lock, Unlock } from 'lucide-react';
import styles from './ColorPalette.module.css';

interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  category: 'brand' | 'ui' | 'accent' | 'neutral' | 'custom';
  isLocked: boolean;
}

interface PaletteCollection {
  id: string;
  name: string;
  description: string;
  colors: ColorSwatch[];
  createdAt: string;
}

const initialPalettes: PaletteCollection[] = [
  {
    id: '1',
    name: 'Garden Theme',
    description: 'Current digital garden color scheme',
    createdAt: '2026-03-01',
    colors: [
      { id: 'c1', name: 'Amber Gold', hex: '#f4d03f', category: 'brand', isLocked: true },
      { id: 'c2', name: 'Deep Purple', hex: '#1a1a2e', category: 'ui', isLocked: true },
      { id: 'c3', name: 'Soft Cream', hex: '#f5f5f0', category: 'neutral', isLocked: false },
      { id: 'c4', name: 'Muted Rose', hex: '#c9a9a6', category: 'accent', isLocked: false },
      { id: 'c5', name: 'Sage Green', hex: '#9caf88', category: 'accent', isLocked: false },
    ],
  },
  {
    id: '2',
    name: 'Midnight Coding',
    description: 'Dark mode development palette',
    createdAt: '2026-02-15',
    colors: [
      { id: 'c6', name: 'Void Black', hex: '#0d0d0d', category: 'ui', isLocked: true },
      { id: 'c7', name: 'Neon Cyan', hex: '#00f5ff', category: 'accent', isLocked: false },
      { id: 'c8', name: 'Electric Purple', hex: '#b829dd', category: 'accent', isLocked: false },
      { id: 'c9', name: 'Terminal Green', hex: '#00ff41', category: 'brand', isLocked: true },
      { id: 'c10', name: 'Steel Gray', hex: '#2a2a3c', category: 'neutral', isLocked: false },
    ],
  },
  {
    id: '3',
    name: 'Sunset Vibes',
    description: 'Warm gradient inspiration',
    createdAt: '2026-02-28',
    colors: [
      { id: 'c11', name: 'Sunset Orange', hex: '#ff6b35', category: 'accent', isLocked: false },
      { id: 'c12', name: 'Coral Pink', hex: '#f7931e', category: 'accent', isLocked: false },
      { id: 'c13', name: 'Golden Hour', hex: '#ffd23f', category: 'brand', isLocked: true },
      { id: 'c14', name: 'Dusk Purple', hex: '#6b4c7a', category: 'ui', isLocked: false },
      { id: 'c15', name: 'Evening Blue', hex: '#2d3561', category: 'ui', isLocked: false },
    ],
  },
];

const categoryColors: Record<string, string> = {
  brand: '#f4d03f',
  ui: '#60a5fa',
  accent: '#f472b6',
  neutral: '#9ca3af',
  custom: '#34d399',
};

export default function ColorPalette() {
  const [palettes, setPalettes] = useState<PaletteCollection[]>(initialPalettes);
  const [selectedPalette, setSelectedPalette] = useState<PaletteCollection | null>(initialPalettes[0]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hex: '#f4d03f', category: 'custom' as ColorSwatch['category'] });

  const copyToClipboard = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const toggleLock = (paletteId: string, colorId: string) => {
    setPalettes(palettes.map(p => {
      if (p.id === paletteId) {
        return {
          ...p,
          colors: p.colors.map(c => c.id === colorId ? { ...c, isLocked: !c.isLocked } : c),
        };
      }
      return p;
    }));
    
    if (selectedPalette?.id === paletteId) {
      setSelectedPalette({
        ...selectedPalette,
        colors: selectedPalette.colors.map(c => c.id === colorId ? { ...c, isLocked: !c.isLocked } : c),
      });
    }
  };

  const addColor = () => {
    if (!selectedPalette || !newColor.name) return;
    
    const color: ColorSwatch = {
      id: Date.now().toString(),
      name: newColor.name,
      hex: newColor.hex,
      category: newColor.category,
      isLocked: false,
    };
    
    const updatedPalettes = palettes.map(p => 
      p.id === selectedPalette.id 
        ? { ...p, colors: [...p.colors, color] }
        : p
    );
    
    setPalettes(updatedPalettes);
    setSelectedPalette({
      ...selectedPalette,
      colors: [...selectedPalette.colors, color],
    });
    
    setNewColor({ name: '', hex: '#f4d03f', category: 'custom' });
    setShowAddModal(false);
  };

  const deleteColor = (paletteId: string, colorId: string) => {
    setPalettes(palettes.map(p => {
      if (p.id === paletteId) {
        return { ...p, colors: p.colors.filter(c => c.id !== colorId) };
      }
      return p;
    }));
    
    if (selectedPalette?.id === paletteId) {
      setSelectedPalette({
        ...selectedPalette,
        colors: selectedPalette.colors.filter(c => c.id !== colorId),
      });
    }
  };

  const generateRandomPalette = () => {
    const randomColors: ColorSwatch[] = Array.from({ length: 5 }, (_, i) => ({
      id: `random-${Date.now()}-${i}`,
      name: `Color ${i + 1}`,
      hex: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      category: 'custom',
      isLocked: false,
    }));
    
    const newPalette: PaletteCollection = {
      id: Date.now().toString(),
      name: `Random Palette ${palettes.length + 1}`,
      description: 'Auto-generated color scheme',
      createdAt: new Date().toISOString().split('T')[0],
      colors: randomColors,
    };
    
    setPalettes([newPalette, ...palettes]);
    setSelectedPalette(newPalette);
  };

  const allColors = palettes.flatMap(p => p.colors);
  const lockedColors = allColors.filter(c => c.isLocked).length;

  return (
    <section className={styles.palette} id="color-palette">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Palette size={28} />
        </div>
        <h2 className={styles.title}>Color Palette</h2>
        <p className={styles.subtitle}>Personal color collections and inspiration</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{palettes.length}</span>
          <span className={styles.statLabel}>Palettes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{allColors.length}</span>
          <span className={styles.statLabel}>Colors</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{lockedColors}</span>
          <span className={styles.statLabel}>Locked</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Palettes</h3>
            <button className={styles.generateBtn} onClick={generateRandomPalette}>
              <Palette size={14} />
              Generate
            </button>
          </div>
          
          <div className={styles.paletteList}>
            {palettes.map(palette => (
              <button
                key={palette.id}
                className={`${styles.paletteItem} ${selectedPalette?.id === palette.id ? styles.active : ''}`}
                onClick={() => setSelectedPalette(palette)}
              >
                <div className={styles.palettePreview}>
                  {palette.colors.slice(0, 5).map(c => (
                    <span key={c.id} className={styles.previewDot} style={{ background: c.hex }} />
                  ))}
                </div>
                <div className={styles.paletteInfo}>
                  <span className={styles.paletteName}>{palette.name}</span>
                  <span className={styles.paletteDesc}>{palette.colors.length} colors • {palette.createdAt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          {selectedPalette ? (
            <>
              <div className={styles.paletteHeader}>
                <div>
                  <h3>{selectedPalette.name}</h3>
                  <p>{selectedPalette.description}</p>
                </div>
                <button 
                  className={styles.addColorBtn}
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} />
                  Add Color
                </button>
              </div>

              <div className={styles.colorsGrid}>
                {selectedPalette.colors.map(color => (
                  <div 
                    key={color.id} 
                    className={styles.colorCard}
                    style={{ '--color-value': color.hex } as React.CSSProperties}
                  >
                    <div 
                      className={styles.colorSwatch}
                      style={{ background: color.hex }}
                      onClick={() => copyToClipboard(color.hex)}
                    >
                      <button 
                        className={styles.lockBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(selectedPalette.id, color.id);
                        }}
                      >
                        {color.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                      
                      <div className={styles.copyOverlay}>
                        {copiedColor === color.hex ? <Check size={24} /> : <Copy size={24} />}
                        <span>{copiedColor === color.hex ? 'Copied!' : 'Copy'}</span>
                      </div>
                    </div>

                    <div className={styles.colorInfo}>
                      <span className={styles.colorName}>{color.name}</span>
                      <div className={styles.colorMeta}>
                        <span 
                          className={styles.categoryBadge}
                          style={{ color: categoryColors[color.category] }}
                        >
                          {color.category}
                        </span>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => deleteColor(selectedPalette.id, color.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className={styles.hexValue}>{color.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <Palette size={48} />
              <p>Select a palette to view colors</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className={styles.modal} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>×</button>
            <h3>Add New Color</h3>
            
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Color name..."
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Hex Code</label>
              <div className={styles.colorInput}>
                <input
                  type="color"
                  value={newColor.hex}
                  onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                />
                <input
                  type="text"
                  value={newColor.hex}
                  onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={newColor.category}
                onChange={(e) => setNewColor({ ...newColor, category: e.target.value as ColorSwatch['category'] })}
              >
                <option value="brand">Brand</option>
                <option value="ui">UI</option>
                <option value="accent">Accent</option>
                <option value="neutral">Neutral</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <button 
              className={styles.saveBtn}
              onClick={addColor}
              disabled={!newColor.name}
            >
              Add Color
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
