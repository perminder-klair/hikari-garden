import { useState, useEffect } from 'react';
import styles from './BirdWatcher.module.css';

interface Bird {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  size: 'small' | 'medium' | 'large';
  colors: string[];
  habitat: string[];
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  points: number;
}

const birdCollection: Bird[] = [
  {
    id: '1',
    name: 'Robin',
    scientificName: 'Erithacus rubecula',
    family: 'Flycatcher',
    size: 'small',
    colors: ['orange', 'brown', 'grey'],
    habitat: ['garden', 'woodland', 'park'],
    description: 'The gardener\'s friend with its distinctive red breast',
    rarity: 'common',
    points: 10,
  },
  {
    id: '2',
    name: 'Blue Tit',
    scientificName: 'Cyanistes caeruleus',
    family: 'Tit',
    size: 'small',
    colors: ['blue', 'yellow', 'green', 'white'],
    habitat: ['garden', 'woodland', 'park'],
    description: 'Acrobatic little bird with vibrant blue cap and wings',
    rarity: 'common',
    points: 10,
  },
  {
    id: '3',
    name: 'Great Tit',
    scientificName: 'Parus major',
    family: 'Tit',
    size: 'small',
    colors: ['black', 'yellow', 'white', 'green'],
    habitat: ['garden', 'woodland', 'park'],
    description: 'Larger than blue tit with distinctive black stripe down chest',
    rarity: 'common',
    points: 10,
  },
  {
    id: '4',
    name: 'Blackbird',
    scientificName: 'Turdus merula',
    family: 'Thrush',
    size: 'medium',
    colors: ['black', 'yellow', 'brown'],
    habitat: ['garden', 'woodland', 'park'],
    description: 'Male is black with yellow beak, female is brown',
    rarity: 'common',
    points: 10,
  },
  {
    id: '5',
    name: 'Goldfinch',
    scientificName: 'Carduelis carduelis',
    family: 'Finch',
    size: 'small',
    colors: ['red', 'yellow', 'black', 'white', 'brown'],
    habitat: ['garden', 'meadow', 'scrubland'],
    description: 'Stunning bird with red face and yellow wing patches',
    rarity: 'uncommon',
    points: 25,
  },
  {
    id: '6',
    name: 'Woodpecker',
    scientificName: 'Dendrocopos major',
    family: 'Woodpecker',
    size: 'medium',
    colors: ['black', 'white', 'red', 'pink'],
    habitat: ['woodland', 'park', 'garden'],
    description: 'Great spotted woodpecker with drumming call',
    rarity: 'uncommon',
    points: 30,
  },
  {
    id: '7',
    name: 'Kingfisher',
    scientificName: 'Alcedo atthis',
    family: 'Kingfisher',
    size: 'small',
    colors: ['blue', 'orange', 'white'],
    habitat: ['river', 'stream', 'lake'],
    description: 'Brilliant flash of blue along waterways',
    rarity: 'rare',
    points: 50,
  },
  {
    id: '8',
    name: 'Barn Owl',
    scientificName: 'Tyto alba',
    family: 'Owl',
    size: 'large',
    colors: ['white', 'tan', 'grey'],
    habitat: ['farmland', 'woodland', 'grassland'],
    description: 'Ghostly white hunter with heart-shaped face',
    rarity: 'rare',
    points: 75,
  },
  {
    id: '9',
    name: 'Peregrine Falcon',
    scientificName: 'Falco peregrinus',
    family: 'Falcon',
    size: 'medium',
    colors: ['grey', 'black', 'white', 'yellow'],
    habitat: ['cliff', 'urban', 'coast'],
    description: 'Fastest bird in the world, reaching 200+ mph in dives',
    rarity: 'epic',
    points: 100,
  },
  {
    id: '10',
    name: 'Hummingbird Hawk-moth',
    scientificName: 'Macroglossum stellatarum',
    family: 'Moth',
    size: 'small',
    colors: ['brown', 'orange', 'black'],
    habitat: ['garden', 'meadow'],
    description: 'Not a bird but flies and feeds like a hummingbird!',
    rarity: 'uncommon',
    points: 40,
  },
];

interface Sighting {
  id: string;
  birdId: string;
  date: string;
  location: string;
  notes: string;
}

export function BirdWatcher() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [filterRarity, setFilterRarity] = useState<Bird['rarity'] | 'all'>('all');
  const [filterHabitat, setFilterHabitat] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ location: '', notes: '' });
  const [animatedBirds, setAnimatedBirds] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBirds(prev => {
        const newBirds = [...prev, Date.now()];
        return newBirds.slice(-5);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredBirds = filterRarity === 'all' && filterHabitat === 'all'
    ? birdCollection
    : birdCollection.filter(bird => {
        if (filterRarity !== 'all' && bird.rarity !== filterRarity) return false;
        if (filterHabitat !== 'all' && !bird.habitat.includes(filterHabitat)) return false;
        return true;
      });

  const getSpottedBirds = () => {
    const spottedIds = new Set(sightings.map(s => s.birdId));
    return birdCollection.filter(b => spottedIds.has(b.id));
  };

  const getBirdSightings = (birdId: string) => {
    return sightings.filter(s => s.birdId === birdId);
  };

  const addSighting = () => {
    if (!selectedBird) return;
    const newSighting: Sighting = {
      id: Date.now().toString(),
      birdId: selectedBird.id,
      date: new Date().toISOString(),
      location: formData.location,
      notes: formData.notes,
    };
    setSightings(prev => [newSighting, ...prev]);
    setFormData({ location: '', notes: '' });
    setShowAddForm(false);
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: '#8bc34a',
      uncommon: '#4fc3f7',
      rare: '#ba68c8',
      epic: '#ffd54f',
    };
    return colors[rarity] || '#9e9e9e';
  };

  const getSizeEmoji = (size: string) => {
    const emojis: Record<string, string> = {
      small: '🐦',
      medium: '🦅',
      large: '🦉',
    };
    return emojis[size] || '🐦';
  };

  const spottedBirds = getSpottedBirds();
  const totalPoints = spottedBirds.reduce((sum, b) => sum + b.points, 0);
  const habitats = Array.from(new Set(birdCollection.flatMap(b => b.habitat)));

  return (
    <section className={styles.birdWatcher}>
      <div className={styles.skyBackground}>
        {animatedBirds.map((id, i) => (
          <div
            key={id}
            className={styles.flyingBird}
            style={{
              top: `${10 + (i % 5) * 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            🐦
          </div>
        ))}
        <div className={styles.clouds}>
          <div className={styles.cloud} style={{ top: '10%', animationDelay: '0s' }} />
          <div className={styles.cloud} style={{ top: '25%', animationDelay: '5s' }} />
          <div className={styles.cloud} style={{ top: '15%', animationDelay: '10s' }} />
        </div>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>🐦 Bird Watcher</h2>
        <p className={styles.subtitle}>Track your avian encounters and build your life list</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{spottedBirds.length}</span>
          <span className={styles.statLabel}>Species Spotted</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{sightings.length}</span>
          <span className={styles.statLabel}>Total Sightings</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalPoints}</span>
          <span className={styles.statLabel}>Bird Points</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.round((spottedBirds.length / birdCollection.length) * 100)}%</span>
          <span className={styles.statLabel}>Collection</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label>Rarity:</label>
            <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value as any)}>
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Habitat:</label>
            <select value={filterHabitat} onChange={(e) => setFilterHabitat(e.target.value)}>
              <option value="all">All Habitats</option>
              {habitats.map(h => (
                <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.birdGrid}>
          {filteredBirds.map(bird => {
            const birdSightings = getBirdSightings(bird.id);
            const isSpotted = birdSightings.length > 0;
            return (
              <div
                key={bird.id}
                className={`${styles.birdCard} ${isSpotted ? styles.spotted : ''}`}
                onClick={() => {
                  setSelectedBird(bird);
                  setShowAddForm(false);
                }}
              >
                <div className={styles.birdHeader}>
                  <span className={styles.sizeEmoji}>{getSizeEmoji(bird.size)}</span>
                  <span
                    className={styles.rarityBadge}
                    style={{ backgroundColor: getRarityColor(bird.rarity) }}
                  >
                    {bird.rarity}
                  </span>
                </div>
                <h4 className={styles.birdName}>{bird.name}</h4>
                <p className={styles.scientificName}>{bird.scientificName}</p>
                <p className={styles.description}>{bird.description}</p>
                <div className={styles.birdMeta}>
                  <span className={styles.metaItem}>🏠 {bird.family}</span>
                  <span className={styles.metaItem}>⭐ {bird.points} pts</span>
                </div>
                {isSpotted && (
                  <div className={styles.sightingCount}>
                    👁️ {birdSightings.length} sighting{birdSightings.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedBird && (
          <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <h3>{getSizeEmoji(selectedBird.size)} {selectedBird.name}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedBird(null)}>×</button>
            </div>
            <p className={styles.detailScientific}>{selectedBird.scientificName}</p>
            <p className={styles.detailDescription}>{selectedBird.description}</p>
            
            <div className={styles.detailStats}>
              <div className={styles.detailStat}>
                <span className={styles.detailLabel}>Family</span>
                <span>{selectedBird.family}</span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailLabel}>Size</span>
                <span>{selectedBird.size}</span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailLabel}>Rarity</span>
                <span style={{ color: getRarityColor(selectedBird.rarity) }}>
                  {selectedBird.rarity}
                </span>
              </div>
              <div className={styles.detailStat}>
                <span className={styles.detailLabel}>Points</span>
                <span>{selectedBird.points}</span>
              </div>
            </div>

            <div className={styles.habitatTags}>
              {selectedBird.habitat.map(h => (
                <span key={h} className={styles.habitatTag}>{h}</span>
              ))}
            </div>

            {!showAddForm ? (
              <button
                className={styles.sightingBtn}
                onClick={() => setShowAddForm(true)}
              >
                + Log Sighting
              </button>
            ) : (
              <div className={styles.sightingForm}>
                <h4>How was your sighting? 🐦</h4>
                <input
                  type="text"
                  placeholder="Location (e.g., Garden, Park)"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                <textarea
                  placeholder="Notes about the sighting..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
                <div className={styles.formActions}>
                  <button className={styles.saveBtn} onClick={addSighting}>
                    Save Sighting
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {getBirdSightings(selectedBird.id).length > 0 && (
              <div className={styles.sightingHistory}>
                <h4>Previous Sightings</h4>
                {getBirdSightings(selectedBird.id).map(sighting => (
                  <div key={sighting.id} className={styles.sightingItem}>
                    <span className={styles.sightingDate}>
                      {new Date(sighting.date).toLocaleDateString()}
                    </span>
                    <span className={styles.sightingLocation}>📍 {sighting.location}</span>
                    {sighting.notes && <p className={styles.sightingNotes}>"{sighting.notes}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
