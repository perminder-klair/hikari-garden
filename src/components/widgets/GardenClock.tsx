import { useState, useCallback } from 'react';
import { useInterval } from '../../hooks/useInterval';
import styles from './GardenClock.module.css';

function formatTime(is24: boolean): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');

  if (!is24) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

export default function GardenClock() {
  const [is24Hour, setIs24Hour] = useState(false);
  const [time, setTime] = useState(() => formatTime(false));

  useInterval(() => {
    setTime(formatTime(is24Hour));
  }, 1000);

  const toggle = useCallback(() => {
    setIs24Hour(prev => {
      const next = !prev;
      setTime(formatTime(next));
      return next;
    });
  }, []);

  return (
    <div className={styles.clock} onClick={toggle} title="Click to toggle format">
      <span>{time}</span>
    </div>
  );
}
