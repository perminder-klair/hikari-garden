import { useState, useEffect } from 'react';
import styles from './AstroGarden.module.css';

interface Constellation {
  id: string;
  name: string;
  latinName: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  stars: number;
  description: string;
  bestMonth: string;
}

const constellations: Constellation[] = [
  { id: '1', name: 'Orion', latinName: 'Orion', season: 'winter', stars: 7, description: 'The Hunter, one of the most recognizable constellations', bestMonth: 'January' },
  { id: '2', name: 'Ursa Major', latinName: 'Ursa Major', season: 'spring', stars: 7, description: 'The Great Bear, contains the Big Dipper asterism', bestMonth: 'April' },
  { id: '3', name: 'Cassiopeia', latinName: 'Cassiopeia', season: 'autumn', stars: 5, description: 'The Queen, shaped like a W or M', bestMonth: 'October' },
  { id: '4', name: 'Cygnus', latinName: 'Cygnus', season: 'summer', stars: 9, description: 'The Swan, flying across the Milky Way', bestMonth: 'August' },
  { id: '5', name: 'Leo', latinName: 'Leo', season: 'spring', stars: 9, description: 'The Lion, contains bright star Regulus', bestMonth: 'April' },
  { id: '6', name: 'Scorpius', latinName: 'Scorpius', season: 'summer', stars: 15, description: 'The Scorpion, heart is Antares', bestMonth: 'July' },
  { id: '7', name: 'Gemini', latinName: 'Gemini', season: 'winter', stars: 8, description: 'The Twins, Castor and Pollux', bestMonth: 'February' },
  { id: '8', name: 'Pegasus', latinName: 'Pegasus', season: 'autumn', stars: 12, description: 'The Winged Horse, Great Square visible', bestMonth: 'September' },
];

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

function getCurrentMoonPhase(date: Date): MoonPhase {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();
  
  let c, e, jd, b;
  if (month < 3) { year--; month += 12; }
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = Math.floor(jd);
  jd -= b;
  b = Math.round(jd * 8);
  
  const phaseIndex = b % 8;
  return moonPhases[phaseIndex];
}

export default function AstroGarden() {
  const [selectedSeason, setSelectedSeason] = useState<Constellation['season'] | 'all'>('all');
  const [currentPhase, setCurrentPhase] = useState<MoonPhase>(moonPhases[0]);
  const [starCount, setStarCount] = useState(0);
  const [observedConstellations, setObservedConstellations] = useState<string[]>([]);

  useEffect(() => {
    setCurrentPhase(getCurrentMoonPhase(new Date()));
    const interval = setInterval(() => {
      setCurrentPhase(getCurrentMoonPhase(new Date()));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generateStars = () => {
      const count = Math.floor(Math.random() * 30) + 50;
      setStarCount(count);
    };
    generateStars();
    const interval = setInterval(generateStars, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredConstellations = selectedSeason === 'all' 
    ? constellations 
    : constellations.filter(c => c.season === selectedSeason);

  const toggleObserved = (id: string) => {
    setObservedConstellations(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getSeasonEmoji = (season: string) => {
    const emojis: Record<string, string> = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
    return emojis[season] || '🌟';
  };

  return (
    <section className={styles.astroGarden}>
      <div className={styles.starField}>
        {Array.from({ length: starCount }).map((_, i) => (
          <div
            key={i}
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>🌌 Astro Garden</h2>
        <p className={styles.subtitle}>Explore the night sky and track celestial wonders</p>
      </div>

      <div className={styles.moonCard}>
        <div className={styles.moonDisplay}>
          <span className={styles.moonEmoji}>{currentPhase.emoji}</span>
          <div className={styles.moonInfo}>
            <h3>Current Moon Phase</h3>
            <p className={styles.moonName}>{currentPhase.name}</p>
            <p className={styles.illumination}>{currentPhase.illumination}% illuminated</p>
          </div>
        </div>
      </div>

      <div className={styles.constellationSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>Filter by season:</span>
          <div className={styles.seasonFilters}>
            {(['all', 'spring', 'summer', 'autumn', 'winter'] as const).map(season => (
              <button
                key={season}
                className={`${styles.seasonBtn} ${selectedSeason === season ? styles.active : ''}`}
                onClick={() => setSelectedSeason(season)}
              >
                {season === 'all' ? '🌟 All' : `${getSeasonEmoji(season)} ${season.charAt(0).toUpperCase() + season.slice(1)}`}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.constellationGrid}>
          {filteredConstellations.map(constellation => (
            <div
              key={constellation.id}
              className={`${styles.constellationCard} ${observedConstellations.includes(constellation.id) ? styles.observed : ''}`}
              onClick={() => toggleObserved(constellation.id)}
            >
              <div className={styles.constellationHeader}>
                <h4>{constellation.name}</h4>
                <span className={styles.latinName}>{constellation.latinName}</span>
              </div>
              <p className={styles.description}>{constellation.description}</p>
              <div className={styles.constellationMeta}>
                <span className={styles.metaItem}>⭐ {constellation.stars} stars</span>
                <span className={styles.metaItem}>📅 Best: {constellation.bestMonth}</span>
                <span className={styles.metaItem}>{getSeasonEmoji(constellation.season)} {constellation.season}</span>
              </div>
              {observedConstellations.includes(constellation.id) && (
                <div className={styles.observedBadge}>👁️ Observed</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{observedConstellations.length}</span>
          <span className={styles.statLabel}>Constellations Observed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{constellations.length}</span>
          <span className={styles.statLabel}>Total in Collection</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.round((observedConstellations.length / constellations.length) * 100)}%</span>
          <span className={styles.statLabel}>Completion</span>
        </div>
      </div>
    </section>
  );
}
