import { useState, useEffect, useCallback } from 'react';
import { Trees, Play, Pause, RotateCcw, TreePine, Sprout, Flower2 } from 'lucide-react';
import styles from './FocusForest.module.css';

interface Tree {
  id: string;
  plantedAt: string;
  duration: number;
  type: 'seedling' | 'sapling' | 'tree' | 'flowering';
  completed: boolean;
}

const treeStages = [
  { duration: 0, icon: Sprout, label: 'Seedling', color: '#85c1e9' },
  { duration: 15, icon: TreePine, label: 'Sapling', color: '#58d68d' },
  { duration: 30, icon: Trees, label: 'Tree', color: '#27ae60' },
  { duration: 60, icon: Flower2, label: 'Flowering', color: '#f4d03f' },
];

const sampleTrees: Tree[] = [
  { id: '1', plantedAt: '2026-03-10', duration: 45, type: 'tree', completed: true },
  { id: '2', plantedAt: '2026-03-12', duration: 25, type: 'sapling', completed: true },
  { id: '3', plantedAt: '2026-03-14', duration: 60, type: 'flowering', completed: true },
  { id: '4', plantedAt: '2026-03-15', duration: 30, type: 'tree', completed: true },
];

export default function FocusForest() {
  const [trees, setTrees] = useState<Tree[]>(sampleTrees);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTreeStage = (duration: number) => {
    for (let i = treeStages.length - 1; i >= 0; i--) {
      if (duration >= treeStages[i].duration) {
        return treeStages[i];
      }
    }
    return treeStages[0];
  };

  const plantTree = useCallback(() => {
    const stage = getTreeStage(selectedDuration);
    const newTree: Tree = {
      id: Date.now().toString(),
      plantedAt: new Date().toISOString().split('T')[0],
      duration: selectedDuration,
      type: stage.duration >= 60 ? 'flowering' : stage.duration >= 30 ? 'tree' : stage.duration >= 15 ? 'sapling' : 'seedling',
      completed: true,
    };
    setTrees([...trees, newTree]);
    setTotalFocusTime(prev => prev + selectedDuration);
  }, [selectedDuration, trees]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      plantTree();
      setTimeLeft(selectedDuration * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedDuration, plantTree]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
  };

  const forestGrid = [...trees].reverse().slice(0, 12);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Trees className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Focus Forest</h2>
        <p className={styles.sectionSubtitle}>Grow your forest with focused time</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{trees.length}</span>
          <span className={styles.statLabel}>Trees Planted</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</span>
          <span className={styles.statLabel}>Total Focus</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{trees.filter(t => t.type === 'flowering').length}</span>
          <span className={styles.statLabel}>Flowering</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.timerCard}>
          <div className={styles.timerDisplay}>
            <span className={styles.timerTime}>{formatTime(timeLeft)}</span>
            <span className={styles.timerLabel}>{isActive ? 'Focusing...' : 'Ready to plant'}</span>
          </div>

          <div className={styles.durationSelector}>
            {[15, 25, 45, 60].map((min) => (
              <button
                key={min}
                onClick={() => {
                  setSelectedDuration(min);
                  setTimeLeft(min * 60);
                }}
                className={styles.durationButton}
                data-active={selectedDuration === min}
              >
                {min}m
              </button>
            ))}
          </div>

          <div className={styles.timerControls}>
            <button onClick={toggleTimer} className={styles.controlButton} data-primary>
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer} className={styles.controlButton}>
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          <div className={styles.preview}>
            <p className={styles.previewLabel}>You'll grow:</p>
            <div className={styles.previewTree}>
              {(() => {
                const stage = getTreeStage(selectedDuration);
                const Icon = stage.icon;
                return (
                  <>
                    <Icon size={32} color={stage.color} />
                    <span style={{ color: stage.color }}>{stage.label}</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className={styles.forestCard}>
          <h3 className={styles.forestTitle}>Your Forest</h3>
          <div className={styles.forestGrid}>
            {forestGrid.map((tree) => {
              const stage = treeStages.find(s => s.label.toLowerCase() === tree.type) || treeStages[0];
              const Icon = stage.icon;
              return (
                <div key={tree.id} className={styles.treeItem} title={`${tree.duration}min on ${tree.plantedAt}`}>
                  <Icon size={28} color={stage.color} />
                  <span className={styles.treeDate}>{tree.plantedAt.slice(5)}</span>
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, 12 - forestGrid.length) }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptySpot}>
                <Sprout size={20} color="var(--border)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
