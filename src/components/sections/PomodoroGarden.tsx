import { useState, useEffect, useCallback } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, TreePine, CheckCircle2 } from 'lucide-react';
import styles from './PomodoroGarden.module.css';

interface Session {
  id: string;
  type: 'focus' | 'break';
  duration: number;
  completed: boolean;
  timestamp: string;
}

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

export default function PomodoroGarden() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', type: 'focus', duration: 25, completed: true, timestamp: '2026-03-16T08:00:00' },
    { id: '2', type: 'break', duration: 5, completed: true, timestamp: '2026-03-16T08:30:00' },
    { id: '3', type: 'focus', duration: 25, completed: true, timestamp: '2026-03-16T08:35:00' },
  ]);
  const [treesGrown, setTreesGrown] = useState(2);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completeSession();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const completeSession = () => {
    setIsActive(false);
    
    const newSession: Session = {
      id: Date.now().toString(),
      type: mode,
      duration: mode === 'focus' ? 25 : 5,
      completed: true,
      timestamp: new Date().toISOString()
    };
    
    setSessions([...sessions, newSession]);
    
    if (mode === 'focus') {
      setTreesGrown(treesGrown + 1);
    }
    
    // Switch mode
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft(nextMode === 'focus' ? FOCUS_TIME : SHORT_BREAK);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : SHORT_BREAK);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : SHORT_BREAK);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedFocusSessions = sessions.filter(s => s.type === 'focus' && s.completed).length;
  const totalFocusMinutes = completedFocusSessions * 25;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Timer className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Pomodoro Garden</h2>
        <p className={styles.sectionSubtitle}>Grow focus, harvest productivity</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <TreePine className={styles.statIcon} />
          <span className={styles.statValue}>{treesGrown}</span>
          <span className={styles.statLabel}>Trees Grown</span>
        </div>
        <div className={styles.stat}>
          <CheckCircle2 className={styles.statIcon} />
          <span className={styles.statValue}>{completedFocusSessions}</span>
          <span className={styles.statLabel}>Sessions</span>
        </div>
        <div className={styles.stat}>
          <Brain className={styles.statIcon} />
          <span className={styles.statValue}>{totalFocusMinutes}</span>
          <span className={styles.statLabel}>Focus Minutes</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.timerCard}>
          <div className={styles.modeSelector}>
            <button
              className={styles.modeButton}
              data-active={mode === 'focus'}
              onClick={() => switchMode('focus')}
            >
              <Brain size={18} />
              <span>Focus</span>
            </button>
            <button
              className={styles.modeButton}
              data-active={mode === 'break'}
              onClick={() => switchMode('break')}
            >
              <Coffee size={18} />
              <span>Break</span>
            </button>
          </div>

          <div className={styles.timerDisplay}>
            <div className={styles.time}>{formatTime(timeLeft)}</div>
            <div className={styles.progressRing}>
              <svg viewBox="0 0 100 100">
                <circle
                  className={styles.progressBg}
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className={styles.progressFill}
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - timeLeft / (mode === 'focus' ? FOCUS_TIME : SHORT_BREAK))}`
                  }}
                />
              </svg>
            </div>
          </div>

          <div className={styles.controls}>
            <button
              className={styles.controlButton}
              data-primary
              onClick={toggleTimer}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            
            <button
              className={styles.controlButton}
              onClick={resetTimer}
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>
          </div>

          <div className={styles.treeVisual}>
            <div className={styles.forest}>
              {[...Array(Math.min(treesGrown, 8))].map((_, i) => (
                <div 
                  key={i} 
                  className={styles.tree}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <TreePine size={24} />
                </div>
              ))}
              {treesGrown > 8 && (
                <div className={styles.moreTrees}>+{treesGrown - 8}</div>
              )}
            </div>
            <p className={styles.treeMessage}>
              {mode === 'focus' 
                ? 'Stay focused to grow another tree!' 
                : 'Take a break, your garden is thriving!'}
            </p>
          </div>
        </div>

        <div className={styles.sessionsCard}>
          <h3 className={styles.cardTitle}>Today's Sessions</h3>
          
          <div className={styles.sessionsList}>
            {sessions.length === 0 ? (
              <p className={styles.emptyState}>No sessions yet. Start your first focus!</p>
            ) : (
              [...sessions].reverse().map((session) => (
                <div 
                  key={session.id} 
                  className={styles.sessionItem}
                  data-type={session.type}
                >
                  <div className={styles.sessionIcon}>
                    {session.type === 'focus' ? <Brain size={16} /> : <Coffee size={16} />}
                  </div>
                  
                  <div className={styles.sessionInfo}>
                    <span className={styles.sessionType}>
                      {session.type === 'focus' ? 'Focus Session' : 'Break'}
                    </span>
                    <span className={styles.sessionTime}>
                      {new Date(session.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <span className={styles.sessionDuration}>
                    {session.duration}m
                  </span>
                </div>
              ))
            )}
          </div>

          <div className={styles.tips}>
            <h4>Focus Tips</h4>
            <ul>
              <li>Eliminate distractions before starting</li>
              <li>Take short breaks between sessions</li>
              <li>After 4 focus sessions, take a longer break</li>
              <li>Stay hydrated during breaks</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
