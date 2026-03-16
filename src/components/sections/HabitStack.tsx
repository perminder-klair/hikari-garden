import { useState } from 'react';
import { Layers, Plus, Trash2, Check, ArrowRight } from 'lucide-react';
import styles from './HabitStack.module.css';

interface HabitChain {
  id: string;
  name: string;
  habits: { id: string; name: string; completed: boolean }[];
  streak: number;
}

const initialChains: HabitChain[] = [
  {
    id: '1',
    name: 'Morning Routine',
    habits: [
      { id: '1a', name: 'Drink water', completed: true },
      { id: '1b', name: 'Stretch for 5 min', completed: true },
      { id: '1c', name: 'Meditate', completed: false },
      { id: '1d', name: 'Plan the day', completed: false },
    ],
    streak: 12,
  },
  {
    id: '2',
    name: 'Evening Wind-down',
    habits: [
      { id: '2a', name: 'Review day', completed: false },
      { id: '2b', name: 'Read 20 pages', completed: false },
      { id: '2c', name: 'No screens', completed: false },
    ],
    streak: 5,
  },
];

export default function HabitStack() {
  const [chains, setChains] = useState<HabitChain[]>(initialChains);
  const [newChainName, setNewChainName] = useState('');
  const [showAddChain, setShowAddChain] = useState(false);

  const toggleHabit = (chainId: string, habitId: string) => {
    setChains(prev => prev.map(chain => {
      if (chain.id !== chainId) return chain;
      const updatedHabits = chain.habits.map(h =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      );
      const allCompleted = updatedHabits.every(h => h.completed);
      return {
        ...chain,
        habits: updatedHabits,
        streak: allCompleted ? chain.streak + 1 : chain.streak,
      };
    }));
  };

  const addChain = () => {
    if (!newChainName.trim()) return;
    const newChain: HabitChain = {
      id: Date.now().toString(),
      name: newChainName,
      habits: [],
      streak: 0,
    };
    setChains([...chains, newChain]);
    setNewChainName('');
    setShowAddChain(false);
  };

  const deleteChain = (id: string) => {
    setChains(chains.filter(c => c.id !== id));
  };

  const completedCount = chains.reduce((acc, c) => 
    acc + c.habits.filter(h => h.completed).length, 0
  );
  const totalCount = chains.reduce((acc, c) => acc + c.habits.length, 0);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Layers className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Habit Stack</h2>
        <p className={styles.sectionSubtitle}>Chain habits together for momentum</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{chains.length}</span>
          <span className={styles.statLabel}>Stacks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedCount}/{totalCount}</span>
          <span className={styles.statLabel}>Today</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.max(...chains.map(c => c.streak), 0)}</span>
          <span className={styles.statLabel}>Best Streak</span>
        </div>
      </div>

      <div className={styles.grid}>
        {chains.map((chain) => (
          <div key={chain.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{chain.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={styles.badge}>{chain.streak}🔥</span>
                <button
                  onClick={() => deleteChain(chain.id)}
                  className={styles.iconButton}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chain.habits.map((habit, index) => (
                <div key={habit.id}>
                  <button
                    onClick={() => toggleHabit(chain.id, habit.id)}
                    className={styles.listItem}
                    style={{
                      opacity: habit.completed ? 0.6 : 1,
                      borderColor: habit.completed ? 'var(--accent-gold)' : 'var(--border)',
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${habit.completed ? 'var(--accent-gold)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: habit.completed ? 'var(--accent-gold)' : 'transparent',
                    }}>
                      {habit.completed && <Check size={12} color="#1a1a2e" />}
                    </div>
                    <span style={{
                      textDecoration: habit.completed ? 'line-through' : 'none',
                      flex: 1,
                      textAlign: 'left',
                    }}>
                      {habit.name}
                    </span>
                  </button>
                  {index < chain.habits.length - 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '0.25rem 0',
                      color: 'var(--text-muted)',
                    }}>
                      <ArrowRight size={14} style={{ transform: 'rotate(90deg)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {showAddChain ? (
          <div className={styles.card}>
            <input
              type="text"
              value={newChainName}
              onChange={(e) => setNewChainName(e.target.value)}
              placeholder="Stack name..."
              className={styles.input}
              onKeyDown={(e) => e.key === 'Enter' && addChain()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button onClick={addChain} className={styles.button}>Add</button>
              <button onClick={() => setShowAddChain(false)} className={styles.buttonSecondary}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddChain(true)} className={styles.addCard}>
            <Plus size={24} />
            <span>New Stack</span>
          </button>
        )}
      </div>
    </section>
  );
}
