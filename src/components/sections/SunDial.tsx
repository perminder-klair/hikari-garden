import { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Sunrise, Sunset, Compass, Clock, Calendar } from 'lucide-react';
import styles from './SunDial.module.css';

interface SolarEvent {
  name: string;
  time: string;
  icon: typeof Sunrise;
  color: string;
}

interface MoonPhase {
  name: string;
  emoji: string;
  illumination: number;
}

const moonPhases: MoonPhase[] = [
  { name: 'New Moon', emoji: '🌑', illumination: 0 },
  { name: 'Waxing Crescent', emoji: '🌒', illumination: 25 },
  { name: 'First Quarter', emoji: '🌓', illumination: 50 },
  { name: 'Waxing Gibbous', emoji: '🌔', illumination: 75 },
  { name: 'Full Moon', emoji: '🌕', illumination: 100 },
  { name: 'Waning Gibbous', emoji: '🌖', illumination: 75 },
  { name: 'Last Quarter', emoji: '🌗', illumination: 50 },
  { name: 'Waning Crescent', emoji: '🌘', illumination: 25 },
];

const solarTerms = [
  { name: 'Spring Equinox', date: '03-20', meaning: 'Balance of light and dark' },
  { name: 'Summer Solstice', date: '06-21', meaning: 'Longest day of the year' },
  { name: 'Autumn Equinox', date: '09-22', meaning: 'Day and night equal again' },
  { name: 'Winter Solstice', date: '12-21', meaning: 'Shortest day, return of light' },
];

export default function SunDial() {
  const [now, setNow] = useState(new Date());
  const [location, setLocation] = useState({ lat: 51.5, lng: -0.1 }); // London default

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate sun position (simplified)
  const sunPosition = useMemo(() => {
    const hours = now.getHours() + now.getMinutes() / 60;
    const angle = ((hours - 6) / 12) * 180; // 6am = 0°, 6pm = 180°
    const clampedAngle = Math.max(0, Math.min(180, angle));
    return clampedAngle;
  }, [now]);

  // Calculate moon phase
  const moonPhase = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Simple moon phase calculation
    const c = Math.floor((year - 1900) / 100);
    const e = Math.floor((c * 36525 + (month + 9) % 12 * 30.6 + day) % 29.53);
    const phaseIndex = Math.floor((e / 29.53) * 8) % 8;
    
    return moonPhases[phaseIndex];
  }, [now]);

  // Calculate solar events (simplified for demo)
  const solarEvents: SolarEvent[] = useMemo(() => {
    const baseDate = new Date(now);
    baseDate.setHours(6, 0, 0, 0);
    
    return [
      { name: 'Sunrise', time: '06:12', icon: Sunrise, color: '#f59e0b' },
      { name: 'Solar Noon', time: '12:34', icon: Sun, color: '#fbbf24' },
      { name: 'Sunset', time: '18:56', icon: Sunset, color: '#f97316' },
    ];
  }, [now]);

  const dayProgress = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100;
  
  const daylightHours = 12 + Math.sin((now.getMonth() / 12) * Math.PI * 2) * 4;
  const daylightPercent = (daylightHours / 24) * 100;

  // Find current/next solar term
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentTerm = solarTerms.find(term => {
    const [termMonth, termDay] = term.date.split('-').map(Number);
    return termMonth === currentMonth && Math.abs(termDay - currentDay) <= 7;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Compass className={styles.icon} />
        <h2>SunDial</h2>
        <p>Track the sun's journey through your day</p>
      </div>

      <div className={styles.mainGrid}>
        {/* Sun Dial Visualizer */}
        <div className={styles.dialCard}>
          <div className={styles.dialHeader}>
            <Clock size={18} />
            <span>{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          
          <div className={styles.dialFace}>
            <div className={styles.horizon}></div>
            <div 
              className={styles.sun}
              style={{ 
                left: `${(sunPosition / 180) * 100}%`,
                bottom: `${Math.sin((sunPosition * Math.PI) / 180) * 80}%`,
              }}
            >
              <Sun size={32} />
            </div>
            
            <div className={styles.timeMarkers}>
              <span>6am</span>
              <span>12pm</span>
              <span>6pm</span>
            </div>
          </div>

          <div className={styles.dayProgress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            <span>{Math.round(dayProgress)}% through the day</span>
          </div>
        </div>

        {/* Solar Events */}
        <div className={styles.eventsCard}>
          <h3>Today's Solar Events</h3>
          <div className={styles.eventsList}>
            {solarEvents.map((event) => (
              <div key={event.name} className={styles.event}>
                <div className={styles.eventIcon} style={{ color: event.color }}>
                  <event.icon size={24} />
                </div>
                <div className={styles.eventInfo}>
                  <span className={styles.eventName}>{event.name}</span>
                  <span className={styles.eventTime}>{event.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.daylightStats}>
            <div className={styles.stat}>
              <Sun size={18} />
              <span>{daylightHours.toFixed(1)}h daylight</span>
            </div>
            <div className={styles.stat}>
              <Moon size={18} />
              <span>{(24 - daylightHours).toFixed(1)}h darkness</span>
            </div>
          </div>
        </div>

        {/* Moon Phase */}
        <div className={styles.moonCard}>
          <div className={styles.moonDisplay}>
            <span className={styles.moonEmoji}>{moonPhase.emoji}</span>
            <div className={styles.moonInfo}>
              <span className={styles.moonName}>{moonPhase.name}</span>
              <span className={styles.moonIllumination}>{moonPhase.illumination}% illuminated</span>
            </div>
          </div>

          <div className={styles.moonCycle}>
            {moonPhases.map((phase, i) => (
              <div 
                key={phase.name}
                className={`${styles.cyclePhase} ${phase.name === moonPhase.name ? styles.active : ''}`}
                title={phase.name}
              >
                <span>{phase.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Solar Terms */}
        <div className={styles.termsCard}>
          <div className={styles.termsHeader}>
            <Calendar size={18} />
            <span>Solar Terms</span>
          </div>
          
          {currentTerm ? (
            <div className={styles.currentTerm}>
              <span className={styles.termBadge}>Now Near</span>
              <h4>{currentTerm.name}</h4>
              <p>{currentTerm.meaning}</p>
              <span className={styles.termDate}>~{currentTerm.date}</span>
            </div>
          ) : (
            <div className={styles.nextTerm}>
              <p>Next solar term approaching... </p>
            </div>
          )}

          <div className={styles.termsList}>
            {solarTerms.map((term) => (
              <div 
                key={term.name} 
                className={`${styles.term} ${term.name === currentTerm?.name ? styles.current : ''}`}
              >
                <span className={styles.termName}>{term.name}</span>
                <span className={styles.termShortDate}>{term.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Season Info */}
      <div className={styles.seasonCard}>
        <div className={styles.seasonInfo}>
          <div className={styles.seasonIcon}>
            {now.getMonth() >= 2 && now.getMonth() <= 4 && '🌸'}
            {now.getMonth() >= 5 && now.getMonth() <= 7 && '☀️'}
            {now.getMonth() >= 8 && now.getMonth() <= 10 && '🍂'}
            {(now.getMonth() >= 11 || now.getMonth() <= 1) && '❄️'}
          </div>
          <div className={styles.seasonText}>
            <span className={styles.seasonLabel}>Current Season</span>
            <span className={styles.seasonName}>
              {now.getMonth() >= 2 && now.getMonth() <= 4 && 'Spring'}
              {now.getMonth() >= 5 && now.getMonth() <= 7 && 'Summer'}
              {now.getMonth() >= 8 && now.getMonth() <= 10 && 'Autumn'}
              {(now.getMonth() >= 11 || now.getMonth() <= 1) && 'Winter'}
            </span>
            <span className={styles.dayOfYear}>Day {Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))} of 365</span>
          </div>
        </div>

        <div className={styles.yearProgress}>
          <div className={styles.yearBar}>
            <div 
              className={styles.yearFill}
              style={{ width: `${((now.getMonth() + now.getDate() / 30) / 12) * 100}%` }}
            />
          </div>
          <span>{now.getFullYear()} Progress</span>
        </div>
      </div>
    </div>
  );
}
