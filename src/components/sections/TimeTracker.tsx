import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, CheckCircle } from 'lucide-react';
import styles from './TimeTracker.module.css';

interface TimeSession {
  id: number;
  task: string;
  duration: number;
  startTime: string;
}

const initialSessions: TimeSession[] = [
  { id: 1, task: 'Frontend Development', duration: 7200, startTime: '09:00' },
  { id: 2, task: 'Code Review', duration: 3600, startTime: '11:30' },
  { id: 3, task: 'Documentation', duration: 1800, startTime: '14:00' },
];

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessions] = useState(initialSessions);
  const [currentTask] = useState('Garden Development');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const totalTracked = sessions.reduce((acc, s) => acc + s.duration, 0) + elapsed;
  const todayTotal = formatDuration(totalTracked);
  const sessionCount = sessions.length + (isRunning ? 1 : 0);

  return (
    <section className={styles.timeTracker}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Clock className={styles.icon} size={20} />
          Time Tracker
        </h2>
      </div>

      <div className={styles.timerDisplay}>
        <div className={styles.time}>{formatTime(elapsed)}</div>
        <div className={styles.taskName}>{currentTask}</div>
      </div>

      <div className={styles.controls}>
        {!isRunning ? (
          <button className={`${styles.controlBtn} ${styles.startBtn}`} onClick={() => setIsRunning(true)}>
            <Play size={16} />
            Start
          </button>
        ) : (
          <button className={`${styles.controlBtn} ${styles.pauseBtn}`} onClick={() => setIsRunning(false)}>
            <Pause size={16} />
            Pause
          </button>
        )}
        <button className={`${styles.controlBtn} ${styles.stopBtn}`} onClick={() => { setIsRunning(false); setElapsed(0); }}>
          <Square size={16} />
          Stop
        </button>
      </div>

      <div className={styles.sessionsList}>
        <h3 className={styles.sectionTitle}>Today's Sessions</h3>
        {sessions.map((session) => (
          <div key={session.id} className={styles.session}>
            <div className={styles.sessionIcon}>
              <CheckCircle size={16} />
            </div>
            <div className={styles.sessionInfo}>
              <div className={styles.sessionTask}>{session.task}</div>
              <div className={styles.sessionTime}>Started at {session.startTime}</div>
            </div>
            <div className={styles.sessionDuration}>{formatDuration(session.duration)}</div>
          </div>
        ))}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{todayTotal}</div>
          <div className={styles.statLabel}>Total Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{sessionCount}</div>
          <div className={styles.statLabel}>Sessions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>4.2h</div>
          <div className={styles.statLabel}>Daily Avg</div>
        </div>
      </div>
    </section>
  );
}
