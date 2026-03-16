import { useState, useEffect } from 'react';
import { Target, Sun, Moon, Wind, Check, Plus, X } from 'lucide-react';
import styles from './IntentionsGarden.module.css';

interface Intention {
  id: string;
  text: string;
  category: 'morning' | 'day' | 'evening';
  completed: boolean;
  createdAt: string;
}

const timeBasedSuggestions = {
  morning: [
    'Approach today with curiosity',
    'Protect my focus time',
    'Move my body with joy',
    'Eat mindfully',
    'Create before consuming',
  ],
  day: [
    'Take breaks when needed',
    'Stay present in conversations',
    'Progress over perfection',
    'Help someone today',
    'Learn one new thing',
  ],
  evening: [
    'Release what did not serve me',
    'Celebrate small wins',
    'Prepare for restful sleep',
    'Reflect with kindness',
    'Set tomorrow up for ease',
  ],
};

export default function IntentionsGarden() {
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [newIntention, setNewIntention] = useState('');
  const [activeCategory, setActiveCategory] = useState<'morning' | 'day' | 'evening'>('morning');
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setActiveCategory('morning');
    else if (hour < 18) setActiveCategory('day');
    else setActiveCategory('evening');
  }, []);

  const addIntention = (text: string) => {
    if (!text.trim()) return;
    const intention: Intention = {
      id: Date.now().toString(),
      text,
      category: activeCategory,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setIntentions([intention, ...intentions]);
    setNewIntention('');
  };

  const toggleIntention = (id: string) => {
    setIntentions(prev => prev.map(i =>
      i.id === id ? { ...i, completed: !i.completed } : i
    ));
  };

  const deleteIntention = (id: string) => {
    setIntentions(intentions.filter(i => i.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'morning': return <Sun size={14} />;
      case 'day': return <Wind size={14} />;
      case 'evening': return <Moon size={14} />;
      default: return <Target size={14} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'morning': return 'Morning Intentions';
      case 'day': return 'Day Intentions';
      case 'evening': return 'Evening Intentions';
      default: return 'Intentions';
    }
  };

  const filteredIntentions = intentions.filter(i => i.category === activeCategory);
  const completedCount = filteredIntentions.filter(i => i.completed).length;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Target className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Intentions Garden</h2>
        <p className={styles.sectionSubtitle}>Plant seeds of purpose</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['morning', 'day', 'evening'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={styles.tab}
            data-active={activeCategory === cat}
          >
            {getCategoryIcon(cat)}
            <span style={{ marginLeft: '0.25rem' }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{getCategoryLabel(activeCategory)}</h3>
          <span className={styles.badge}>
            {completedCount}/{filteredIntentions.length}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIntention(newIntention)}
            placeholder="Set an intention..."
            className={styles.input}
            style={{ flex: 1 }}
          />
          <button onClick={() => addIntention(newIntention)} className={styles.iconButton}>
            <Plus size={18} />
          </button>
        </div>

        {showSuggestions && (
          <div style={{ marginBottom: '1rem' }}>
            <p className={styles.label} style={{ marginBottom: '0.5rem' }}>Suggestions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {timeBasedSuggestions[activeCategory].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => addIntention(suggestion)}
                  className={styles.tag}
                  style={{ cursor: 'pointer' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredIntentions.length === 0 ? (
            <p className={styles.emptyState}>No intentions set yet. Plant your first seed above.</p>
          ) : (
            filteredIntentions.map((intention) => (
              <div
                key={intention.id}
                className={styles.listItem}
                style={{
                  opacity: intention.completed ? 0.6 : 1,
                  borderColor: intention.completed ? 'var(--accent-gold)' : 'var(--border)',
                }}
              >
                <button
                  onClick={() => toggleIntention(intention.id)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${intention.completed ? 'var(--accent-gold)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: intention.completed ? 'var(--accent-gold)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {intention.completed && <Check size={12} color="#1a1a2e" />}
                </button>
                <span style={{
                  flex: 1,
                  textDecoration: intention.completed ? 'line-through' : 'none',
                  textAlign: 'left',
                }}>
                  {intention.text}
                </span>
                <button
                  onClick={() => deleteIntention(intention.id)}
                  className={styles.iconButton}
                  style={{ opacity: 0.5 }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.statsBar} style={{ marginTop: '1rem' }}>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {intentions.filter(i => i.category === 'morning').length}
          </span>
          <span className={styles.statLabel}>Morning</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {intentions.filter(i => i.category === 'day').length}
          </span>
          <span className={styles.statLabel}>Day</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {intentions.filter(i => i.category === 'evening').length}
          </span>
          <span className={styles.statLabel}>Evening</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {intentions.filter(i => i.completed).length}
          </span>
          <span className={styles.statLabel}>Done</span>
        </div>
      </div>
    </section>
  );
}
