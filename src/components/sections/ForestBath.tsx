import React, { useState, useEffect, useCallback } from 'react';
import { Trees, Play, Pause, RotateCcw, Ear, Eye, Hand, Flower2 } from 'lucide-react';
import styles from './ForestBath.module.css';

interface ForestSession {
  id: string;
  date: string;
  duration: number;
  senses: string[];
}

const SENSES = [
  { id: 'sight', name: 'Sight', icon: Eye },
  { id: 'sound', name: 'Sound', icon: Ear },
  { id: 'touch', name: 'Touch', icon: Hand },
  { id: 'smell', name: 'Scent', icon: Flower2 },
];

const ForestBath: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeSenses, setActiveSenses] = useState<string[]>([]);
  const [sessions, setSessions] = useState<ForestSession[]>(() => {
    const saved = localStorage.getItem('forestBath_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('forestBath_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = useCallback((totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (seconds > 60) {
      const newSession: ForestSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: seconds,
        senses: activeSenses,
      };
      setSessions(prev => [newSession, ...prev].slice(0, 10));
    }
    setIsActive(false);
    setSeconds(0);
    setActiveSenses([]);
  };

  const toggleSense = (senseId: string) => {
    setActiveSenses(prev =>
      prev.includes(senseId)
        ? prev.filter(s => s !== senseId)
        : [...prev, senseId]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.forestBath}>
      <div className={styles.header}>
        <Trees className={styles.icon} size={28} />
        <div>
          <h2 className={styles.title}>Forest Bath</h2>
          <p className={styles.subtitle}>Shinrin-yoku — immerse in nature</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.timerCard}>
          <div className={styles.forestVisual}>
            <span className={styles.tree}>🌲</span>
            <span className={styles.tree}>🌳</span>
            <span className={styles.tree}>🌲</span>
            <span className={styles.tree}>🌳</span>
            <span className={styles.tree}>🌲</span>
            <span className={styles.bird}>🦅</span>
            <span className={styles.bird}>🐦</span>
          </div>
          
          <div className={styles.timerDisplay}>
            <div className={styles.time}>{formatTime(seconds)}</div>
            <div className={styles.timerLabel}>
              {isActive ? 'Bathing in the forest...' : 'Ready to begin'}
            </div>
          </div>

          <div className={styles.controls}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={toggleTimer}
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={resetTimer}
              disabled={seconds === 0}
            >
              <RotateCcw size={18} />
              Finish
            </button>
          </div>
        </div>

        <div className={styles.sensesCard}>
          <h3 className={styles.sensesTitle}>
            <Flower2 size={18} />
            Engage Your Senses
          </h3>
          <div className={styles.sensesGrid}>
            {SENSES.map(sense => {
              const Icon = sense.icon;
              return (
                <button
                  key={sense.id}
                  className={`${styles.senseItem} ${activeSenses.includes(sense.id) ? styles.active : ''}`}
                  onClick={() => toggleSense(sense.id)}
                >
                  <div className={styles.senseIcon}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.senseName}>{sense.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.historyCard}>
          <h3 className={styles.historyTitle}>Recent Sessions</h3>
          {sessions.length === 0 ? (
            <div className={styles.emptyState}>
              No forest baths yet. Take your first session!
            </div>
          ) : (
            <div className={styles.sessionList}>
              {sessions.map(session => (
                <div key={session.id} className={styles.sessionItem}>
                  <span className={styles.sessionDate}>
                    {formatDate(session.date)}
                  </span>
                  <span className={styles.sessionSenses}>
                    {session.senses.map(s => {
                      const sense = SENSES.find(x => x.id === s);
                      return sense ? (
                        <span key={s} title={sense.name}>
                          {s === 'sight' && '👁️'}
                          {s === 'sound' && '👂'}
                          {s === 'touch' && '✋'}
                          {s === 'smell' && '🌸'}
                        </span>
                      ) : null;
                    })}
                  </span>
                  <span className={styles.sessionDuration}>
                    {formatTime(session.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForestBath;
