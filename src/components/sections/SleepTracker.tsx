import { useState, useMemo } from 'react';
import { Moon, Bed, Clock, TrendingUp, Star, Cloud } from 'lucide-react';
import styles from './SleepTracker.module.css';

interface SleepEntry {
  id: string;
  date: string;
  duration: number; // hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  bedtime: string;
  wakeTime: string;
  notes: string;
}

const qualityIcons = {
  poor: Cloud,
  fair: Cloud,
  good: Moon,
  excellent: Star,
};

const qualityColors = {
  poor: '#e74c3c',
  fair: '#f39c12',
  good: '#58d68d',
  excellent: '#f4d03f',
};

const sampleEntries: SleepEntry[] = [
  { id: '1', date: '2026-03-10', duration: 6.5, quality: 'fair', bedtime: '23:30', wakeTime: '06:00', notes: 'Woke up once' },
  { id: '2', date: '2026-03-11', duration: 7.5, quality: 'good', bedtime: '22:30', wakeTime: '06:00', notes: 'Restful' },
  { id: '3', date: '2026-03-12', duration: 8, quality: 'excellent', bedtime: '22:00', wakeTime: '06:00', notes: 'Deep sleep' },
  { id: '4', date: '2026-03-13', duration: 5.5, quality: 'poor', bedtime: '01:00', wakeTime: '06:30', notes: 'Late night coding' },
  { id: '5', date: '2026-03-14', duration: 7, quality: 'good', bedtime: '23:00', wakeTime: '06:00', notes: 'Better schedule' },
  { id: '6', date: '2026-03-15', duration: 7.5, quality: 'excellent', bedtime: '22:30', wakeTime: '06:00', notes: 'Perfect night' },
];

export default function SleepTracker() {
  const [entries, setEntries] = useState<SleepEntry[]>(sampleEntries);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<SleepEntry>>({
    duration: 7,
    quality: 'good',
    bedtime: '22:30',
    wakeTime: '06:30',
    notes: '',
  });

  const stats = useMemo(() => {
    const avgDuration = entries.reduce((acc, e) => acc + e.duration, 0) / entries.length;
    const avgQuality = entries.reduce((acc, e) => {
      const scores = { poor: 1, fair: 2, good: 3, excellent: 4 };
      return acc + scores[e.quality];
    }, 0) / entries.length;
    const qualityLabels = ['poor', 'fair', 'good', 'excellent'];
    const dominantQuality = qualityLabels[Math.round(avgQuality) - 1] || 'fair';
    return { avgDuration: avgDuration.toFixed(1), dominantQuality };
  }, [entries]);

  const addEntry = () => {
    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      duration: newEntry.duration || 7,
      quality: newEntry.quality as SleepEntry['quality'],
      bedtime: newEntry.bedtime || '22:30',
      wakeTime: newEntry.wakeTime || '06:30',
      notes: newEntry.notes || '',
    };
    setEntries([...entries, entry]);
    setShowAddForm(false);
    setNewEntry({ duration: 7, quality: 'good', bedtime: '22:30', wakeTime: '06:30', notes: '' });
  };

  const getSleepScore = (duration: number, quality: string) => {
    const qualityScores = { poor: 1, fair: 2, good: 3, excellent: 4 };
    const durationScore = Math.min(duration / 2, 4);
    const total = (qualityScores[quality as keyof typeof qualityScores] + durationScore) / 2;
    return Math.round(total * 25);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Moon className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Sleep Tracker</h2>
        <p className={styles.sectionSubtitle}>Rest well, grow well</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.avgDuration}h</span>
          <span className={styles.statLabel}>Avg Duration</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: qualityColors[stats.dominantQuality as keyof typeof qualityColors] }}>
            {stats.dominantQuality}
          </span>
          <span className={styles.statLabel}>Avg Quality</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{getSleepScore(parseFloat(stats.avgDuration), stats.dominantQuality)}</span>
          <span className={styles.statLabel}>Sleep Score</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Sleep History</h3>
            <button onClick={() => setShowAddForm(!showAddForm)} className={styles.button}>
              {showAddForm ? 'Cancel' : 'Log Sleep'}
            </button>
          </div>

          {showAddForm ? (
            <div className={styles.addForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Bedtime</label>
                  <input
                    type="time"
                    value={newEntry.bedtime}
                    onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Wake Time</label>
                  <input
                    type="time"
                    value={newEntry.wakeTime}
                    onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Duration: {newEntry.duration}h</label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={newEntry.duration}
                  onChange={(e) => setNewEntry({ ...newEntry, duration: parseFloat(e.target.value) })}
                  className={styles.slider}
                />
              </div>
              <div className={styles.qualitySelector}>
                {(Object.keys(qualityIcons) as Array<keyof typeof qualityIcons>).map((quality) => {
                  const Icon = qualityIcons[quality];
                  return (
                    <button
                      key={quality}
                      onClick={() => setNewEntry({ ...newEntry, quality })}
                      className={styles.qualityButton}
                      data-active={newEntry.quality === quality}
                      style={{ '--quality-color': qualityColors[quality] } as React.CSSProperties}
                    >
                      <Icon size={20} />
                      <span>{quality}</span>
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                placeholder="Notes..."
                className={styles.input}
              />
              <button onClick={addEntry} className={styles.button}>Save Entry</button>
            </div>
          ) : (
            <div className={styles.sleepList}>
              {entries.slice(-7).reverse().map((entry) => {
                const Icon = qualityIcons[entry.quality];
                const score = getSleepScore(entry.duration, entry.quality);
                return (
                  <div key={entry.id} className={styles.sleepItem}>
                    <div className={styles.sleepIcon} style={{ color: qualityColors[entry.quality] }}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.sleepInfo}>
                      <div className={styles.sleepHeader}>
                        <span className={styles.sleepDate}>{entry.date}</span>
                        <span className={styles.sleepScore} style={{ color: qualityColors[entry.quality] }}>
                          {score}%
                        </span>
                      </div>
                      <div className={styles.sleepDetails}>
                        <span><Bed size={14} /> {entry.duration}h</span>
                        <span><Clock size={14} /> {entry.bedtime} - {entry.wakeTime}</span>
                      </div>
                      {entry.notes && <p className={styles.sleepNotes}>{entry.notes}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Sleep Insights</h3>
          <div className={styles.insights}>
            <div className={styles.insight}>
              <TrendingUp size={20} />
              <div>
                <span className={styles.insightLabel}>Consistency</span>
                <span className={styles.insightValue}>Your sleep schedule has been consistent this week</span>
              </div>
            </div>
            <div className={styles.insight}>
              <Moon size={20} />
              <div>
                <span className={styles.insightLabel}>Optimal Bedtime</span>
                <span className={styles.insightValue}>Aim for 22:00 - 22:30 for best rest</span>
              </div>
            </div>
            <div className={styles.insight}>
              <Star size={20} />
              <div>
                <span className={styles.insightLabel}>Quality Trend</span>
                <span className={styles.insightValue}>Sleep quality improved 15% this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
