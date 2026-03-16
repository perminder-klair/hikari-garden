import { useState } from 'react';
import { Waves, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import styles from './ReflectionPool.module.css';

interface Reflection {
  id: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  wins: string[];
  challenges: string[];
  learnings: string[];
  intentions: string[];
}

const sampleReflections: Reflection[] = [
  {
    id: '1',
    period: 'weekly',
    date: '2026-03-09',
    wins: ['Shipped 3 new features', 'Maintained workout streak', 'Deep work sessions increased'],
    challenges: ['Sleep schedule drifted', 'Context switching between projects'],
    learnings: ['Batch similar tasks for flow', 'Evening wind-down is crucial'],
    intentions: ['Protect morning focus time', 'Earlier bedtimes'],
  },
  {
    id: '2',
    period: 'daily',
    date: '2026-03-15',
    wins: ['Completed Digital Garden cycle', 'Meditated 15 min'],
    challenges: ['Afternoon energy dip'],
    learnings: ['Short walks reset focus'],
    intentions: ['Try pomodoro with movement breaks'],
  },
];

const prompts = {
  wins: 'What went well?',
  challenges: 'What was difficult?',
  learnings: 'What did I learn?',
  intentions: 'What will I focus on next?',
};

export default function ReflectionPool() {
  const [reflections, setReflections] = useState<Reflection[]>(sampleReflections);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'wins' | 'challenges' | 'learnings' | 'intentions'>('wins');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newReflection, setNewReflection] = useState<Partial<Reflection>>({
    period: 'daily',
    wins: [],
    challenges: [],
    learnings: [],
    intentions: [],
  });
  const [newItem, setNewItem] = useState('');

  const currentReflection = reflections[currentIndex];

  const addItem = () => {
    if (!newItem.trim()) return;
    setNewReflection(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] as string[] || []), newItem],
    }));
    setNewItem('');
  };

  const saveReflection = () => {
    const reflection: Reflection = {
      id: Date.now().toString(),
      period: newReflection.period || 'daily',
      date: new Date().toISOString().split('T')[0],
      wins: newReflection.wins || [],
      challenges: newReflection.challenges || [],
      learnings: newReflection.learnings || [],
      intentions: newReflection.intentions || [],
    };
    setReflections([reflection, ...reflections]);
    setShowNewForm(false);
    setNewReflection({ period: 'daily', wins: [], challenges: [], learnings: [], intentions: [] });
    setCurrentIndex(0);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Waves className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Reflection Pool</h2>
        <p className={styles.sectionSubtitle}>Pause, reflect, grow</p>
      </div>

      {!showNewForm ? (
        <>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} className={styles.icon} />
                <span className={styles.cardSubtitle}>
                  {currentReflection?.period === 'daily' ? 'Daily' : 
                   currentReflection?.period === 'weekly' ? 'Weekly' : 'Monthly'} Reflection
                </span>
                <span className={styles.badge}>{currentReflection?.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setCurrentIndex(Math.min(currentIndex + 1, reflections.length - 1))}
                  disabled={currentIndex >= reflections.length - 1}
                  className={styles.iconButton}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
                  disabled={currentIndex <= 0}
                  className={styles.iconButton}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(Object.keys(prompts) as Array<keyof typeof prompts>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={styles.tab}
                  data-active={activeTab === key}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ minHeight: 150 }}>
              <p className={styles.label}>{prompts[activeTab]}</p>
              {currentReflection?.[activeTab].length ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentReflection[activeTab].map((item, i) => (
                    <li key={i} className={styles.listItem}>
                      <Sparkles size={14} className={styles.icon} />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyState}>No entries yet</p>
              )}
            </div>
          </div>

          <button onClick={() => setShowNewForm(true)} className={styles.button} style={{ marginTop: '1rem' }}>
            New Reflection
          </button>
        </>
      ) : (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>New Reflection</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setNewReflection({ ...newReflection, period: p })}
                className={styles.tab}
                data-active={newReflection.period === p}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {(Object.keys(prompts) as Array<keyof typeof prompts>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={styles.tab}
                data-active={activeTab === key}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <p className={styles.label}>{prompts[activeTab]}</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add an item..."
              className={styles.input}
              style={{ flex: 1 }}
            />
            <button onClick={addItem} className={styles.button}>Add</button>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {(newReflection[activeTab] as string[] || []).map((item, i) => (
              <li key={i} className={styles.listItem}>
                <Sparkles size={14} className={styles.icon} />
                {item}
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={saveReflection} className={styles.button}>Save Reflection</button>
            <button onClick={() => setShowNewForm(false)} className={styles.buttonSecondary}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
