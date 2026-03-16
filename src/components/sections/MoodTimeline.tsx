import { useState, useMemo } from 'react';
import { LineChart, TrendingUp, Calendar, Smile, Frown, Meh, Sun, CloudRain } from 'lucide-react';
import styles from './MoodTimeline.module.css';

interface MoodEntry {
  id: string;
  date: string;
  mood: 'amazing' | 'good' | 'neutral' | 'bad' | 'terrible';
  note: string;
  energy: number;
}

const moodIcons = {
  amazing: Sun,
  good: Smile,
  neutral: Meh,
  bad: CloudRain,
  terrible: Frown,
};

const moodColors = {
  amazing: '#f4d03f',
  good: '#58d68d',
  neutral: '#85c1e9',
  bad: '#f39c12',
  terrible: '#e74c3c',
};

const sampleEntries: MoodEntry[] = [
  { id: '1', date: '2026-03-10', mood: 'good', note: 'Productive day', energy: 7 },
  { id: '2', date: '2026-03-11', mood: 'amazing', note: 'Shipped new feature!', energy: 9 },
  { id: '3', date: '2026-03-12', mood: 'neutral', note: 'Average day', energy: 5 },
  { id: '4', date: '2026-03-13', mood: 'bad', note: 'Tired and stressed', energy: 3 },
  { id: '5', date: '2026-03-14', mood: 'good', note: 'Better sleep helped', energy: 6 },
  { id: '6', date: '2026-03-15', mood: 'amazing', note: 'Great workout + meditation', energy: 8 },
  { id: '7', date: '2026-03-16', mood: 'good', note: 'Steady progress', energy: 7 },
];

export default function MoodTimeline() {
  const [entries, setEntries] = useState<MoodEntry[]>(sampleEntries);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<MoodEntry>>({
    mood: 'neutral',
    energy: 5,
    note: '',
  });

  const stats = useMemo(() => {
    const avgEnergy = entries.reduce((acc, e) => acc + e.energy, 0) / entries.length;
    const moodCounts = entries.reduce((acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
    return { avgEnergy: avgEnergy.toFixed(1), dominantMood };
  }, [entries]);

  const addEntry = () => {
    if (!newEntry.note?.trim()) return;
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.mood as MoodEntry['mood'],
      energy: newEntry.energy || 5,
      note: newEntry.note,
    };
    setEntries([...entries, entry]);
    setShowAddForm(false);
    setNewEntry({ mood: 'neutral', energy: 5, note: '' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <LineChart className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Mood Timeline</h2>
        <p className={styles.sectionSubtitle}>Track your emotional journey</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{entries.length}</span>
          <span className={styles.statLabel}>Entries</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.avgEnergy}</span>
          <span className={styles.statLabel}>Avg Energy</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: moodColors[stats.dominantMood as keyof typeof moodColors] }}>
            {stats.dominantMood}
          </span>
          <span className={styles.statLabel}>Dominant</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={styles.tab}
                data-active={selectedPeriod === period}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className={styles.button}>
            {showAddForm ? 'Cancel' : 'Log Mood'}
          </button>
        </div>

        {showAddForm ? (
          <div className={styles.addForm}>
            <div className={styles.moodSelector}>
              {(Object.keys(moodIcons) as Array<keyof typeof moodIcons>).map((mood) => {
                const Icon = moodIcons[mood];
                return (
                  <button
                    key={mood}
                    onClick={() => setNewEntry({ ...newEntry, mood })}
                    className={styles.moodButton}
                    data-active={newEntry.mood === mood}
                    style={{ '--mood-color': moodColors[mood] } as React.CSSProperties}
                  >
                    <Icon size={24} />
                    <span>{mood}</span>
                  </button>
                );
              })}
            </div>
            <div className={styles.energySlider}>
              <label>Energy Level: {newEntry.energy}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newEntry.energy}
                onChange={(e) => setNewEntry({ ...newEntry, energy: parseInt(e.target.value) })}
              />
            </div>
            <input
              type="text"
              value={newEntry.note}
              onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
              placeholder="How are you feeling?"
              className={styles.input}
            />
            <button onClick={addEntry} className={styles.button}>Save Entry</button>
          </div>
        ) : (
          <div className={styles.timeline}>
            {entries.slice(-7).map((entry, index) => {
              const Icon = moodIcons[entry.mood];
              return (
                <div key={entry.id} className={styles.timelineItem}>
                  <div 
                    className={styles.moodDot}
                    style={{ background: moodColors[entry.mood] }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineDate}>{entry.date}</span>
                      <span className={styles.timelineEnergy}>⚡ {entry.energy}/10</span>
                    </div>
                    <p className={styles.timelineNote}>{entry.note}</p>
                  </div>
                  {index < entries.slice(-7).length - 1 && (
                    <div className={styles.timelineConnector} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.trendIndicator}>
        <TrendingUp size={16} />
        <span>Your mood has been trending upward over the last week</span>
      </div>
    </section>
  );
}
