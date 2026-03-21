import { useState, useEffect } from 'react';
import styles from './MoonPhase.module.css';

interface MoonPhaseData {
  name: string;
  icon: string;
  illumination: number;
  emoji: string;
  description: string;
  nextFull: string;
  nextNew: string;
  rising: string;
  setting: string;
}

function calculateMoonPhase(date: Date): MoonPhaseData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Calculate Julian date
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Calculate moon phase (synodic month = 29.53 days)
  const daysSinceNew = (jd - 2451550.1) % 29.530588853;
  const phase = daysSinceNew / 29.530588853;
  
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);
  
  let name, icon, description;
  let phaseClass = '';
  
  if (phase < 0.026) {
    name = 'New Moon';
    icon = '🌑';
    description = 'A time for new beginnings, setting intentions, and planting seeds for the future.';
    phaseClass = 'new';
  } else if (phase < 0.223) {
    name = 'Waxing Crescent';
    icon = '🌒';
    description = 'Build momentum. Take action on your intentions, overcome hesitation.';
    phaseClass = 'waxing';
  } else if (phase < 0.477) {
    name = 'First Quarter';
    icon = '🌓';
    description = 'Time for decisions and taking action. Face challenges head-on.';
    phaseClass = 'waxing';
  } else if (phase < 0.73) {
    name = 'Waxing Gibbous';
    icon = '🌔';
    description = 'Refine and adjust. Fine-tune your efforts before the full moon.';
    phaseClass = 'waxing';
  } else if (phase < 0.977) {
    name = 'Full Moon';
    icon = '🌕';
    description = 'Peak energy, culmination, and celebration. Harvest and gratitude.';
    phaseClass = 'full';
  } else {
    name = 'Waning Crescent';
    icon = '🌘';
    description = 'Release and let go. Reflect, rest, and prepare for the next cycle.';
    phaseClass = 'waning';
  }

  // Calculate next full and new moon
  const synodicMonth = 29.530588853;
  const daysToFull = phase < 0.5 ? (0.5 - phase) * synodicMonth : (1.5 - phase) * synodicMonth;
  const daysToNew = phase < 0.026 ? (0.026 - phase) * synodicMonth : (1.026 - phase) * synodicMonth;
  
  const nextFullDate = new Date(date.getTime() + daysToFull * 24 * 60 * 60 * 1000);
  const nextNewDate = new Date(date.getTime() + daysToNew * 24 * 60 * 60 * 1000);

  return {
    name,
    icon,
    illumination,
    emoji: icon,
    description,
    nextFull: nextFullDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    nextNew: nextNewDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    rising: '00:47 AM',
    setting: '10:23 AM',
  };
}

export default function MoonPhase() {
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);
  const [floatingStars, setFloatingStars] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);

  useEffect(() => {
    setMoonData(calculateMoonPhase(new Date()));
    
    const stars = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setFloatingStars(stars);
  }, []);

  if (!moonData) return null;

  const phaseNames = ['New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full', 'Waning Crescent'];
  const phaseIcons = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌘'];
  const currentPhaseIndex = phaseNames.findIndex(n => n === moonData.name) || 0;

  const getPhaseDate = (offset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={styles.moonPhase}>
      <div className={styles.floatingStars}>
        {floatingStars.map(s => (
          <span
            key={s.id}
            className={styles.floatingStar}
            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.icon}>🌙</span>
          <div>
            <h2 className={styles.title}>MoonPhase Tracker</h2>
            <p className={styles.subtitle}>Align with the lunar cycle</p>
          </div>
        </div>
      </div>

      <div className={styles.phaseInfo}>
        <div className={styles.moonDisplay}>
          <div className={`${styles.moonVisual} ${styles[moonData.name.split(' ')[0].toLowerCase()]}`}>
            <div className={styles.moonShadow} />
          </div>
          <h3 className={styles.moonName}>{moonData.name}</h3>
          <p className={styles.moonIllumination}>{moonData.illumination}% illuminated</p>
          <p className={styles.moonDate}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className={styles.details}>
          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>🌕</span>
            <div className={styles.detailText}>
              <p className={styles.detailLabel}>Next Full Moon</p>
              <p className={styles.detailValue}>{moonData.nextFull}</p>
            </div>
          </div>
          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>🌑</span>
            <div className={styles.detailText}>
              <p className={styles.detailLabel}>Next New Moon</p>
              <p className={styles.detailValue}>{moonData.nextNew}</p>
            </div>
          </div>
          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>💫</span>
            <div className={styles.detailText}>
              <p className={styles.detailLabel}>Current Phase</p>
              <p className={styles.detailValue}>{moonData.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.moonCalendar}>
        <h3 className={styles.sectionTitle}>🌒 Lunar Calendar</h3>
        <div className={styles.phases}>
          {phaseNames.map((name, i) => {
            const offset = i - currentPhaseIndex;
            return (
              <div
                key={name}
                className={`${styles.phase} ${i === currentPhaseIndex ? styles.current : ''}`}
              >
                <span className={styles.phaseIcon}>{phaseIcons[i]}</span>
                <p className={styles.phaseName}>{name}</p>
                <p className={styles.phaseDate}>{getPhaseDate(offset > 0 ? offset * 5 : 29 + offset * 5)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.rituals}>
        <h3 className={styles.sectionTitle}>✨ Moon Rituals</h3>
        <div className={styles.ritualList}>
          <div className={styles.ritual}>
            <span className={styles.ritualIcon}>🌱</span>
            <h4 className={styles.ritualTitle}>Plant Seeds</h4>
            <p className={styles.ritualText}>New moons are perfect for setting intentions and starting new projects.</p>
          </div>
          <div className={styles.ritual}>
            <span className={styles.ritualIcon}>🌾</span>
            <h4 className={styles.ritualTitle}>Harvest</h4>
            <p className={styles.ritualText}>Full moons are ideal for celebrating achievements and expressing gratitude.</p>
          </div>
          <div className={styles.ritual}>
            <span className={styles.ritualIcon}>🧹</span>
            <h4 className={styles.ritualTitle}>Release</h4>
            <p className={styles.ritualText}>Waning moons are for letting go of what no longer serves you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
