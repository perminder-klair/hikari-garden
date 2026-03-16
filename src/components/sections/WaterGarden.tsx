import { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Waves, GlassWater, Trophy, Target } from 'lucide-react';
import styles from './WaterGarden.module.css';

interface WaterLog {
  id: string;
  timestamp: string;
  amount: number;
}

const GLASS_SIZE = 250; // ml
const DAILY_GOAL = 2500; // ml

export default function WaterGarden() {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(5);

  const todayTotal = logs.reduce((acc, log) => acc + log.amount, 0);
  const progress = Math.min((todayTotal / DAILY_GOAL) * 100, 100);
  const glassesCount = Math.floor(todayTotal / GLASS_SIZE);

  useEffect(() => {
    if (todayTotal >= DAILY_GOAL && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [todayTotal, showCelebration]);

  const addWater = () => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      amount: GLASS_SIZE,
    };
    setLogs([...logs, newLog]);
  };

  const removeWater = () => {
    if (logs.length > 0) {
      setLogs(logs.slice(0, -1));
    }
  };

  const getWaterLevelColor = () => {
    if (progress < 30) return '#e74c3c';
    if (progress < 60) return '#f39c12';
    if (progress < 100) return '#58d68d';
    return '#3498db';
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Droplets className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Water Garden</h2>
        <p className={styles.sectionSubtitle}>Hydrate to cultivate</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{todayTotal}</span>
          <span className={styles.statLabel}>ml Today</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{glassesCount}</span>
          <span className={styles.statLabel}>Glasses</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.waterVisual}>
            <div className={styles.waterContainer}>
              <div 
                className={styles.waterLevel}
                style={{ 
                  height: `${progress}%`,
                  background: `linear-gradient(to top, ${getWaterLevelColor()}, #85c1e9)`
                }}
              >
                <Waves className={styles.waveIcon} size={32} />
              </div>
              <div className={styles.waterOverlay}>
                <span className={styles.percentage}>{Math.round(progress)}%</span>
                <span className={styles.goalText}>of {DAILY_GOAL}ml</span>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <button onClick={removeWater} className={styles.controlButton} disabled={logs.length === 0}>
              <Minus size={20} />
            </button>
            <button onClick={addWater} className={styles.addButton}>
              <GlassWater size={24} />
              <span>Add Glass</span>
            </button>
            <button onClick={addWater} className={styles.controlButton}>
              <Plus size={20} />
            </button>
          </div>

          {showCelebration && (
            <div className={styles.celebration}>
              <Trophy size={32} />
              <span>Daily Goal Reached!</span>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Today's Log</h3>
          <div className={styles.logList}>
            {logs.length === 0 ? (
              <p className={styles.emptyLog}>No water logged yet today</p>
            ) : (
              logs.slice().reverse().map((log, index) => (
                <div key={log.id} className={styles.logItem}>
                  <div className={styles.logIcon}>
                    <Droplets size={16} />
                  </div>
                  <div className={styles.logInfo}>
                    <span className={styles.logAmount}>+{log.amount}ml</span>
                    <span className={styles.logTime}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.milestones}>
            <h4 className={styles.milestonesTitle}>Milestones</h4>
            <div className={styles.milestoneList}>
              {[500, 1000, 1500, 2000, 2500].map((milestone) => (
                <div 
                  key={milestone}
                  className={styles.milestone}
                  data-achieved={todayTotal >= milestone}
                >
                  <Target size={16} />
                  <span>{milestone}ml</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
