import { useState, useEffect, useCallback } from 'react';
import { Telescope, Star, Moon, Sun, Calendar, Trash2, Compass, Clock } from 'lucide-react';
import styles from './Stargazer.module.css';

interface Observation {
  id: string;
  date: Date;
  object: string;
  type: 'planet' | 'star' | 'constellation' | 'moon' | 'meteor' | 'galaxy' | 'nebula';
  magnitude?: number;
  notes: string;
  location: string;
  conditions: 'excellent' | 'good' | 'fair' | 'poor';
}

const celestialObjects = [
  { name: 'Moon', type: 'moon' as const, emoji: '🌙' },
  { name: 'Mars', type: 'planet' as const, emoji: '🔴' },
  { name: 'Jupiter', type: 'planet' as const, emoji: '🟠' },
  { name: 'Saturn', type: 'planet' as const, emoji: '🪐' },
  { name: 'Venus', type: 'planet' as const, emoji: '✨' },
  { name: 'Orion', type: 'constellation' as const, emoji: '⭐' },
  { name: 'Big Dipper', type: 'constellation' as const, emoji: '🥄' },
  { name: 'Cassiopeia', type: 'constellation' as const, emoji: '👑' },
  { name: 'Andromeda', type: 'galaxy' as const, emoji: '🌌' },
  { name: 'Pleiades', type: 'star' as const, emoji: '✨' },
  { name: 'Sirius', type: 'star' as const, emoji: '💎' },
  { name: 'Meteor Shower', type: 'meteor' as const, emoji: '☄️' },
];

const conditions = [
  { value: 'excellent', label: 'Excellent', stars: 5, color: '#00B894' },
  { value: 'good', label: 'Good', stars: 4, color: '#FDCB6E' },
  { value: 'fair', label: 'Fair', stars: 3, color: '#E17055' },
  { value: 'poor', label: 'Poor', stars: 2, color: '#636E72' },
];

export function Stargazer() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedObject, setSelectedObject] = useState(celestialObjects[0]);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<typeof conditions[0]>(conditions[1]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Load observations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stargazer-observations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setObservations(parsed.map((o: Observation) => ({
          ...o,
          date: new Date(o.date)
        })));
      } catch {
        console.error('Failed to load observations');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('stargazer-observations', JSON.stringify(observations));
  }, [observations]);

  const addObservation = useCallback(() => {
    if (!location.trim()) return;

    const newObservation: Observation = {
      id: Date.now().toString(),
      date: new Date(),
      object: selectedObject.name,
      type: selectedObject.type,
      notes: notes.trim(),
      location: location.trim(),
      conditions: selectedCondition.value as Observation['conditions'],
    };

    setObservations(prev => [newObservation, ...prev]);
    setNotes('');
    setLocation('');
    setShowForm(false);
  }, [selectedObject, notes, location, selectedCondition]);

  const deleteObservation = (id: string) => {
    setObservations(prev => prev.filter(o => o.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'planet': return '🪐';
      case 'star': return '⭐';
      case 'constellation': return '✨';
      case 'moon': return '🌙';
      case 'meteor': return '☄️';
      case 'galaxy': return '🌌';
      case 'nebula': return '🌫️';
      default: return '🔭';
    }
  };

  const filteredObservations = filter === 'all' 
    ? observations 
    : observations.filter(o => o.type === filter);

  const stats = {
    total: observations.length,
    planets: observations.filter(o => o.type === 'planet').length,
    constellations: observations.filter(o => o.type === 'constellation').length,
    stars: observations.filter(o => o.type === 'star').length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Telescope className={styles.icon} />
          <h2 className={styles.title}>Stargazer</h2>
        </div>
        <p className={styles.subtitle}>Track your celestial observations and discoveries</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.total}</span>
          <span className={styles.statLabel}>Total Observations</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.planets}</span>
          <span className={styles.statLabel}>Planets</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.constellations}</span>
          <span className={styles.statLabel}>Constellations</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.stars}</span>
          <span className={styles.statLabel}>Stars</span>
        </div>
      </div>

      {/* Add Observation Button */}
      <button 
        className={styles.addButton}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '➕ Log Observation'}
      </button>

      {/* Observation Form */}
      {showForm && (
        <div className={styles.form}>
          <h3 className={styles.formTitle}>New Observation</h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Celestial Object</label>
              <div className={styles.objectGrid}>
                {celestialObjects.map((obj) => (
                  <button
                    key={obj.name}
                    className={`${styles.objectButton} ${selectedObject.name === obj.name ? styles.selected : ''}`}
                    onClick={() => setSelectedObject(obj)}
                  >
                    <span className={styles.objectEmoji}>{obj.emoji}</span>
                    <span className={styles.objectName}>{obj.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <div className={styles.inputWrapper}>
                <Compass size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Where did you observe from?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Viewing Conditions</label>
              <div className={styles.conditionsGrid}>
                {conditions.map((cond) => (
                  <button
                    key={cond.value}
                    className={`${styles.conditionButton} ${selectedCondition.value === cond.value ? styles.selected : ''}`}
                    onClick={() => setSelectedCondition(cond)}
                    style={{ '--condition-color': cond.color } as React.CSSProperties}
                  >
                    <span className={styles.conditionStars}>{'★'.repeat(cond.stars)}</span>
                    <span className={styles.conditionLabel}>{cond.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Notes</label>
              <textarea
                className={styles.textarea}
                placeholder="What did you see? Any details worth remembering..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <button 
            className={styles.submitButton}
            onClick={addObservation}
            disabled={!location.trim()}
          >
            <Star size={18} />
            Log Observation
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {['all', 'planet', 'star', 'constellation', 'moon', 'meteor', 'galaxy'].map((type) => (
          <button
            key={type}
            className={`${styles.filterTab} ${filter === type ? styles.active : ''}`}
            onClick={() => setFilter(type)}
          >
            {type === 'all' ? 'All' : `${getTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}s`}
          </button>
        ))}
      </div>

      {/* Observations List */}
      <div className={styles.observations}>
        {filteredObservations.length === 0 ? (
          <div className={styles.emptyState}>
            <Telescope className={styles.emptyIcon} />
            <p>No observations yet</p>
            <p className={styles.emptyHint}>Start logging your stargazing sessions!</p>
          </div>
        ) : (
          <div className={styles.observationList}>
            {filteredObservations.map((obs) => (
              <div key={obs.id} className={styles.observationCard}>
                <div className={styles.observationHeader}>
                  <div className={styles.objectInfo}>
                    <span className={styles.objectIcon}>{getTypeIcon(obs.type)}</span>
                    <div>
                      <span className={styles.objectName}>{obs.object}</span>
                      <span className={styles.objectType}>{obs.type}</span>
                    </div>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteObservation(obs.id)}
                    aria-label={`Delete observation of ${obs.object}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className={styles.observationMeta}>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    {obs.date.toLocaleDateString()}
                  </div>
                  <div className={styles.metaItem}>
                    <Compass size={14} />
                    {obs.location}
                  </div>
                  <div className={styles.metaItem}>
                    <Star size={14} />
                    {conditions.find(c => c.value === obs.conditions)?.label}
                  </div>
                </div>

                {obs.notes && (
                  <p className={styles.observationNotes}>{obs.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
