import { useState, useEffect, useCallback } from 'react';
import { Origami, RotateCcw, Save, Trash2, Sparkles } from 'lucide-react';
import styles from './OrigamiStudio.module.css';

interface FoldedCreation {
  id: string;
  type: 'crane' | 'boat' | 'frog' | 'flower' | 'star' | 'butterfly';
  color: string;
  createdAt: Date;
  name: string;
}

const origamiTypes = [
  { type: 'crane' as const, name: 'Peace Crane', difficulty: 3, emoji: '🕊️' },
  { type: 'boat' as const, name: 'Paper Boat', difficulty: 1, emoji: '⛵' },
  { type: 'frog' as const, name: 'Jumping Frog', difficulty: 2, emoji: '🐸' },
  { type: 'flower' as const, name: 'Lotus Flower', difficulty: 4, emoji: '🪷' },
  { type: 'star' as const, name: 'Lucky Star', difficulty: 1, emoji: '⭐' },
  { type: 'butterfly' as const, name: 'Butterfly', difficulty: 3, emoji: '🦋' },
];

const paperColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F8B500', '#E17055'
];

export function OrigamiStudio() {
  const [creations, setCreations] = useState<FoldedCreation[]>([]);
  const [selectedType, setSelectedType] = useState<typeof origamiTypes[0]>(origamiTypes[0]);
  const [selectedColor, setSelectedColor] = useState(paperColors[0]);
  const [isFolding, setIsFolding] = useState(false);
  const [foldProgress, setFoldProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load creations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('origami-creations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCreations(parsed.map((c: FoldedCreation) => ({
          ...c,
          createdAt: new Date(c.createdAt)
        })));
      } catch {
        console.error('Failed to load origami creations');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('origami-creations', JSON.stringify(creations));
  }, [creations]);

  const foldOrigami = useCallback(() => {
    if (isFolding) return;
    
    setIsFolding(true);
    setFoldProgress(0);
    
    const foldInterval = setInterval(() => {
      setFoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(foldInterval);
          return 100;
        }
        return prev + (100 / (selectedType.difficulty * 20));
      });
    }, 50);

    setTimeout(() => {
      const newCreation: FoldedCreation = {
        id: Date.now().toString(),
        type: selectedType.type,
        color: selectedColor,
        createdAt: new Date(),
        name: selectedType.name,
      };
      
      setCreations(prev => [newCreation, ...prev]);
      setIsFolding(false);
      setFoldProgress(0);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }, selectedType.difficulty * 1000 + 500);
  }, [isFolding, selectedType, selectedColor]);

  const deleteCreation = (id: string) => {
    setCreations(prev => prev.filter(c => c.id !== id));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all your origami creations?')) {
      setCreations([]);
    }
  };

  const getFoldStage = () => {
    if (foldProgress < 25) return 'folding';
    if (foldProgress < 50) return 'shaping';
    if (foldProgress < 75) return 'refining';
    if (foldProgress < 100) return 'finishing';
    return 'complete';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Origami className={styles.icon} />
          <h2 className={styles.title}>Origami Studio</h2>
        </div>
        <p className={styles.subtitle}>Fold paper into art, one crease at a time</p>
      </div>

      <div className={styles.content}>
        {/* Folding Station */}
        <div className={styles.foldingStation}>
          <h3 className={styles.sectionTitle}>Folding Station</h3>
          
          {/* Paper Preview */}
          <div className={styles.paperPreview}>
            <div 
              className={`${styles.paper} ${isFolding ? styles.folding : ''} ${styles[getFoldStage()]}`}
              style={{ backgroundColor: selectedColor }}
            >
              {!isFolding && <span className={styles.paperEmoji}>📄</span>}
              {isFolding && foldProgress > 80 && (
                <span className={styles.foldedEmoji}>{selectedType.emoji}</span>
              )}
            </div>
            
            {isFolding && (
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${foldProgress}%` }}
                />
              </div>
            )}
            
            {isFolding && (
              <p className={styles.foldStatus}>
                {getFoldStage() === 'folding' && 'Folding paper...'}
                {getFoldStage() === 'shaping' && 'Shaping creases...'}
                {getFoldStage() === 'refining' && 'Refining edges...'}
                {getFoldStage() === 'finishing' && 'Almost there...'}
              </p>
            )}

            {showCelebration && (
              <div className={styles.celebration}>
                <Sparkles className={styles.sparkleIcon} />
                <span>Beautiful {selectedType.name} created!</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.typeSelector}>
              <label className={styles.label}>Choose Design</label>
              <div className={styles.typeGrid}>
                {origamiTypes.map((type) => (
                  <button
                    key={type.type}
                    className={`${styles.typeButton} ${selectedType.type === type.type ? styles.selected : ''}`}
                    onClick={() => setSelectedType(type)}
                    disabled={isFolding}
                  >
                    <span className={styles.typeEmoji}>{type.emoji}</span>
                    <span className={styles.typeName}>{type.name}</span>
                    <span className={styles.difficulty}>
                      {'★'.repeat(type.difficulty)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.colorSelector}>
              <label className={styles.label}>Paper Color</label>
              <div className={styles.colorGrid}>
                {paperColors.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorButton} ${selectedColor === color ? styles.selected : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    disabled={isFolding}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <button
              className={styles.foldButton}
              onClick={foldOrigami}
              disabled={isFolding}
            >
              {isFolding ? 'Folding...' : `Fold ${selectedType.name}`}
            </button>
          </div>
        </div>

        {/* Collection Gallery */}
        <div className={styles.gallery}>
          <div className={styles.galleryHeader}>
            <h3 className={styles.sectionTitle}>Your Collection</h3>
            {creations.length > 0 && (
              <button className={styles.clearButton} onClick={clearAll}>
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>

          {creations.length === 0 ? (
            <div className={styles.emptyState}>
              <Origami className={styles.emptyIcon} />
              <p>No origami creations yet</p>
              <p className={styles.emptyHint}>Fold your first piece above!</p>
            </div>
          ) : (
            <div className={styles.creationGrid}>
              {creations.map((creation) => (
                <div 
                  key={creation.id} 
                  className={styles.creationCard}
                  style={{ '--creation-color': creation.color } as React.CSSProperties}
                >
                  <div className={styles.creationPaper}>
                    <span className={styles.creationEmoji}>
                      {origamiTypes.find(t => t.type === creation.type)?.emoji}
                    </span>
                  </div>
                  <div className={styles.creationInfo}>
                    <span className={styles.creationName}>{creation.name}</span>
                    <span className={styles.creationDate}>
                      {creation.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteCreation(creation.id)}
                    aria-label={`Delete ${creation.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
