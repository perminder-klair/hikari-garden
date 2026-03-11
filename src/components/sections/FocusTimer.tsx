import { useState, useCallback, useEffect, useRef } from 'react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './FocusTimer.module.css';

const FOCUS_TIME = 25 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 90;

export default function FocusTimer() {
  const ref = useIntersectionReveal<HTMLElement>();
  const [currentTime, setCurrentTime] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(3);
  const [totalMinutes, setTotalMinutes] = useState(75);
  const [label, setLabel] = useState('Ready to focus');
  const [strokeColor, setStrokeColor] = useState('var(--accent-gold)');
  const intervalRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 1) {
          stopTimer();
          setIsRunning(false);
          setLabel('Session complete!');
          setSessions(s => s + 1);
          setTotalMinutes(t => t + 25);
          setStrokeColor('#2ecc71');
          setTimeout(() => setStrokeColor('var(--accent-gold)'), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return stopTimer;
  }, [isRunning, stopTimer]);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => {
      if (prev) {
        setLabel('Paused');
      } else {
        setLabel('Focusing...');
      }
      return !prev;
    });
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setIsRunning(false);
    setCurrentTime(FOCUS_TIME);
    setLabel('Ready to focus');
  }, [stopTimer]);

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = (FOCUS_TIME - currentTime) / FOCUS_TIME;
  const offset = CIRCUMFERENCE * progress;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <section ref={ref} className={`${styles.section} focus-section reveal`} id="focus">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Deep Work</span>
        <h2 className={styles.sectionTitle}>Focus Timer</h2>
      </div>
      <div className={styles.container}>
        <div className={styles.timerDisplay}>
          <div className={styles.timerRing}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle className={styles.ringBg} cx="100" cy="100" r="90" />
              <circle
                className={styles.ringProgress}
                cx="100" cy="100" r="90"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={offset}
                style={{ stroke: strokeColor }}
              />
            </svg>
            <div className={styles.timerTime}>{timeStr}</div>
          </div>
          <div className={styles.timerLabel}>{label}</div>
          <div className={styles.controls}>
            <button
              className={`${styles.timerBtn} ${isRunning ? styles.active : ''}`}
              onClick={toggleTimer}
            >
              {isRunning ? 'Pause' : currentTime === FOCUS_TIME ? 'Start' : 'Resume'}
            </button>
            <button className={styles.timerBtn} onClick={resetTimer}>Reset</button>
          </div>
        </div>
        <div className={styles.focusStats}>
          <div className={styles.focusStat}>
            <span className={styles.focusStatLabel}>Today's Sessions</span>
            <span className={styles.focusStatValue}>{sessions}</span>
          </div>
          <div className={styles.focusStat}>
            <span className={styles.focusStatLabel}>Total Focus Time</span>
            <span className={styles.focusStatValue}>{totalStr}</span>
          </div>
          <div className={styles.focusStat}>
            <span className={styles.focusStatLabel}>Current Streak</span>
            <span className={styles.focusStatValue}>5 days</span>
          </div>
          <div className={styles.focusStat}>
            <span className={styles.focusStatLabel}>Garden Level</span>
            <span className={styles.focusStatValue}>Sprout</span>
          </div>
        </div>
      </div>
    </section>
  );
}
