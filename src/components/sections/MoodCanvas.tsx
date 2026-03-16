import { useState, useEffect } from 'react';
import { Palette, Smile, Frown, Meh, Zap, Cloud, Sun, Moon, Plus, X } from 'lucide-react';
import styles from './MoodCanvas.module.css';

interface MoodEntry {
  id: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  note: string;
  color: string;
  timestamp: string;
}

const MOOD_OPTIONS = [
  { id: 'great', label: 'Great', icon: Zap, color: '#f1c40f', emoji: '⚡' },
  { id: 'good', label: 'Good', icon: Sun, color: '#2ecc71', emoji: '☀️' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: '#95a5a6', emoji: '😐' },
  { id: 'bad', label: 'Bad', icon: Cloud, color: '#7f8c8d', emoji: '☁️' },
  { id: 'terrible', label: 'Terrible', icon: Moon, color: '#34495e', emoji: '🌑' },
];

const COLOR_PALETTE = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
  '#3498db', '#9b59b6', '#34495e', '#95a5a6', '#ecf0f1'
];

export default function MoodCanvas() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('moodBoardEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodBoardEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!selectedMood) return;
    
    const moodOption = MOOD_OPTIONS.find(m => m.id === selectedMood);
    if (!moodOption) return;

    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood as MoodEntry['mood'],
      note: note.trim(),
      color: selectedColor,
      timestamp: new Date().toISOString()
    };

    setEntries([entry, ...entries]);
    setSelectedMood('');
    setNote('');
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getMoodStats = () => {
    const stats: Record<string, number> = {};
    entries.forEach(e => {
      stats[e.mood] = (stats[e.mood] || 0) + 1;
    });
    return stats;
  };

  const moodStats = getMoodStats();
  const dominantMood = Object.entries(moodStats).sort((a, b) => b[1] - a[1])[0];

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Palette className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Mood Board</h2>
        <p className={styles.sectionSubtitle}>Visualize your emotional landscape</p>
      </div>

      <div className={styles.stats}>
        <span>{entries.length} entries</span>
        {dominantMood && (
          <>
            <span className={styles.dot}>•</span>
            <span>
              Dominant: {MOOD_OPTIONS.find(m => m.id === dominantMood[0])?.emoji} {dominantMood[0]}
            </span>
          </>
        )}
      </div>

      <button className={styles.addButton} onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? <X size={18} /> : <Plus size={18} />}
        {showAddForm ? 'Cancel' : 'Log Mood'}
      </button>

      {showAddForm && (
        <div className={styles.addForm}>
          <div className={styles.moodSelector}>
            <label>How are you feeling?</label>
            <div className={styles.moodOptions}>
              {MOOD_OPTIONS.map(mood => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.id}
                    className={styles.moodOption}
                    data-selected={selectedMood === mood.id}
                    style={{ '--mood-color': mood.color } as React.CSSProperties}
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <Icon size={24} />
                    <span>{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.colorSelector}>
            <label>Pick a color</label>
            <div className={styles.colorPalette}>
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  className={styles.colorSwatch}
                  data-selected={selectedColor === color}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <textarea
            placeholder="Add a note (optional)..."
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button 
            className={styles.saveButton}
            disabled={!selectedMood}
            onClick={addEntry}
          >
            Save Entry
          </button>
        </div>
      )}

      <div className={styles.moodGrid}>
        {entries.length === 0 ? (
          <p className={styles.emptyState}>No mood entries yet. Start tracking your emotions above.</p>
        ) : (
          entries.map(entry => {
            const moodOption = MOOD_OPTIONS.find(m => m.id === entry.mood);
            const Icon = moodOption?.icon || Smile;
            const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={entry.id} 
                className={styles.moodCard}
                style={{ background: entry.color }}
              >
                <button 
                  className={styles.deleteButton}
                  onClick={() => deleteEntry(entry.id)}
                >
                  <X size={14} />
                </button>
                <div className={styles.moodIcon}>
                  <Icon size={28} />
                </div>
                <div className={styles.moodInfo}>
                  <span className={styles.moodLabel}>{moodOption?.label}</span>
                  <span className={styles.moodDate}>{date}</span>
                </div>
                {entry.note && (
                  <p className={styles.moodNote}>{entry.note}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
