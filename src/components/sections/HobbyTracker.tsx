import { useState, useRef, useEffect } from 'react';
import { Palette, Plus, X, Clock, TrendingUp, Calendar, Star, Trash2 } from 'lucide-react';
import styles from './HobbyTracker.module.css';

interface HobbySession {
  id: string;
  date: string;
  duration: number; // in minutes
  notes: string;
}

interface Hobby {
  id: string;
  name: string;
  category: 'creative' | 'physical' | 'intellectual' | 'social' | 'relaxation' | 'other';
  color: string;
  icon: string;
  totalHours: number;
  sessions: HobbySession[];
  goal: number; // weekly goal in hours
  streak: number;
  lastSession: string;
}

const categories = [
  { id: 'creative', label: 'Creative', color: '#e91e63' },
  { id: 'physical', label: 'Physical', color: '#2ecc71' },
  { id: 'intellectual', label: 'Intellectual', color: '#3498db' },
  { id: 'social', label: 'Social', color: '#f39c12' },
  { id: 'relaxation', label: 'Relaxation', color: '#9b59b6' },
  { id: 'other', label: 'Other', color: '#95a5a6' },
];

const hobbyIcons = ['🎨', '📚', '🏃', '🎸', '🍳', '🌱', '✍️', '🎮', '📷', '🧘', '🎭', '🔧'];

const sampleHobbies: Hobby[] = [
  {
    id: '1',
    name: 'Digital Art',
    category: 'creative',
    color: '#e91e63',
    icon: '🎨',
    totalHours: 45.5,
    sessions: [
      { id: 's1', date: '2026-03-12', duration: 120, notes: 'Practicing portraits' },
      { id: 's2', date: '2026-03-10', duration: 90, notes: 'Color theory study' },
    ],
    goal: 5,
    streak: 3,
    lastSession: '2026-03-12',
  },
  {
    id: '2',
    name: 'Running',
    category: 'physical',
    color: '#2ecc71',
    icon: '🏃',
    totalHours: 28,
    sessions: [
      { id: 's3', date: '2026-03-13', duration: 45, notes: '5k morning run' },
      { id: 's4', date: '2026-03-11', duration: 30, notes: 'Interval training' },
    ],
    goal: 3,
    streak: 5,
    lastSession: '2026-03-13',
  },
  {
    id: '3',
    name: 'Reading',
    category: 'intellectual',
    color: '#3498db',
    icon: '📚',
    totalHours: 62,
    sessions: [
      { id: 's5', date: '2026-03-12', duration: 60, notes: 'Finished chapter 5' },
    ],
    goal: 4,
    streak: 12,
    lastSession: '2026-03-12',
  },
];

export default function HobbyTracker() {
  const [hobbies, setHobbies] = useState<Hobby[]>(sampleHobbies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [filter, setFilter] = useState<'all' | Hobby['category']>('all');
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
        }
      },
      { threshold: 0.1 }
    );

    if (revealRef.current) {
      observer.observe(revealRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredHobbies = filter === 'all' 
    ? hobbies 
    : hobbies.filter(h => h.category === filter);

  const totalHours = hobbies.reduce((acc, h) => acc + h.totalHours, 0);
  const activeHobbies = hobbies.length;
  const longestStreak = Math.max(...hobbies.map(h => h.streak), 0);

  function addHobby(hobby: Omit<Hobby, 'id' | 'totalHours' | 'sessions' | 'streak' | 'lastSession'>) {
    const newHobby: Hobby = {
      ...hobby,
      id: Date.now().toString(),
      totalHours: 0,
      sessions: [],
      streak: 0,
      lastSession: '',
    };
    setHobbies(prev => [...prev, newHobby]);
    setShowAddModal(false);
  }

  function logSession(hobbyId: string, duration: number, notes: string) {
    const today = new Date().toISOString().split('T')[0];
    
    setHobbies(prev => prev.map(h => {
      if (h.id !== hobbyId) return h;
      
      const newSession: HobbySession = {
        id: Date.now().toString(),
        date: today,
        duration,
        notes,
      };
      
      // Calculate streak
      const lastDate = h.lastSession ? new Date(h.lastSession) : null;
      const todayDate = new Date(today);
      const diffDays = lastDate ? Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      let newStreak = h.streak;
      if (diffDays === 1) {
        newStreak = h.streak + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      } else if (diffDays === 0) {
        newStreak = h.streak;
      }
      
      return {
        ...h,
        sessions: [...h.sessions, newSession],
        totalHours: h.totalHours + (duration / 60),
        streak: newStreak,
        lastSession: today,
      };
    }));
    
    setShowLogModal(false);
    setSelectedHobby(null);
  }

  function deleteHobby(id: string) {
    setHobbies(prev => prev.filter(h => h.id !== id));
  }

  function deleteSession(hobbyId: string, sessionId: string) {
    setHobbies(prev => prev.map(h => {
      if (h.id !== hobbyId) return h;
      const session = h.sessions.find(s => s.id === sessionId);
      if (!session) return h;
      
      return {
        ...h,
        sessions: h.sessions.filter(s => s.id !== sessionId),
        totalHours: h.totalHours - (session.duration / 60),
      };
    }));
  }

  return (
    <section className={styles.hobbyTracker} ref={revealRef}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Palette className={styles.icon} />
          <h2>Hobby Tracker</h2>
        </div>
        <p className={styles.subtitle}>Cultivate your passions. Track your progress.</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeHobbies}</span>
          <span className={styles.statLabel}>Hobbies</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalHours.toFixed(1)}</span>
          <span className={styles.statLabel}>Total Hours</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{longestStreak}</span>
          <span className={styles.statLabel}>Best Streak</span>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${filter === cat.id ? styles.active : ''}`}
            onClick={() => setFilter(cat.id as Hobby['category'])}
            style={{ '--category-color': cat.color } as React.CSSProperties}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.hobbiesGrid}>
        {filteredHobbies.map(hobby => {
          const category = categories.find(c => c.id === hobby.category);
          const weeklyProgress = Math.min((hobby.totalHours / hobby.goal) * 100, 100);
          
          return (
            <div
              key={hobby.id}
              className={styles.hobbyCard}
              style={{ '--hobby-color': hobby.color } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <div className={styles.hobbyIcon}>{hobby.icon}</div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteHobby(hobby.id)}
                >
                  <X size={14} />
                </button>
              </div>

              <h3 className={styles.hobbyName}>{hobby.name}</h3>
              <span className={styles.categoryBadge} style={{ background: category?.color }}>
                {category?.label}
              </span>

              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <Clock size={14} />
                  <span>{hobby.totalHours.toFixed(1)}h</span>
                </div>
                <div className={styles.statItem}>
                  <TrendingUp size={14} />
                  <span>{hobby.streak} day streak</span>
                </div>
              </div>

              <div className={styles.goalSection}>
                <div className={styles.goalHeader}>
                  <span>Weekly Goal</span>
                  <span>{hobby.totalHours.toFixed(1)}/{hobby.goal}h</span>
                </div>
                <div className={styles.goalBar}>
                  <div className={styles.goalFill} style={{ width: `${weeklyProgress}%` }} />
                </div>
              </div>

              {hobby.sessions.length > 0 && (
                <div className={styles.recentSessions}>
                  <h4>Recent Sessions</h4>
                  {hobby.sessions.slice(-3).reverse().map(session => (
                    <div key={session.id} className={styles.session}>
                      <div className={styles.sessionInfo}>
                        <Calendar size={12} />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span className={styles.duration}>{session.duration}min</span>
                      </div>
                      {session.notes && (
                        <p className={styles.sessionNotes}>{session.notes}</p>
                      )}
                      <button
                        className={styles.deleteSessionBtn}
                        onClick={() => deleteSession(hobby.id, session.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className={styles.logBtn}
                onClick={() => {
                  setSelectedHobby(hobby);
                  setShowLogModal(true);
                }}
              >
                <Plus size={14} />
                Log Session
              </button>
            </div>
          );
        })}

        <button className={styles.addCard} onClick={() => setShowAddModal(true)}>
          <Plus size={32} />
          <span>Add Hobby</span>
        </button>
      </div>

      {showAddModal && (
        <AddHobbyModal
          onClose={() => setShowAddModal(false)}
          onAdd={addHobby}
        />
      )}

      {showLogModal && selectedHobby && (
        <LogSessionModal
          hobby={selectedHobby}
          onClose={() => {
            setShowLogModal(false);
            setSelectedHobby(null);
          }}
          onLog={logSession}
        />
      )}
    </section>
  );
}

interface AddHobbyModalProps {
  onClose: () => void;
  onAdd: (hobby: Omit<Hobby, 'id' | 'totalHours' | 'sessions' | 'streak' | 'lastSession'>) => void;
}

function AddHobbyModal({ onClose, onAdd }: AddHobbyModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Hobby['category']>('creative');
  const [goal, setGoal] = useState(5);
  const [selectedIcon, setSelectedIcon] = useState(hobbyIcons[0]);
  const [selectedColor, setSelectedColor] = useState(categories[0].color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      category,
      color: selectedColor,
      icon: selectedIcon,
      goal,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3><Palette size={20} /> Add New Hobby</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Hobby Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Photography"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as Hobby['category'])}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Weekly Goal (hours)</label>
              <input
                type="number"
                min={1}
                max={40}
                value={goal}
                onChange={e => setGoal(parseInt(e.target.value) || 5)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Icon</label>
            <div className={styles.iconPicker}>
              {hobbyIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`${styles.iconOption} ${selectedIcon === icon ? styles.selected : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Color</label>
            <div className={styles.colorPicker}>
              {categories.map(c => (
                <button
                  key={c.color}
                  type="button"
                  className={`${styles.colorOption} ${selectedColor === c.color ? styles.selected : ''}`}
                  style={{ background: c.color }}
                  onClick={() => setSelectedColor(c.color)}
                />
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn}>
              <Plus size={16} /> Add Hobby
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface LogSessionModalProps {
  hobby: Hobby;
  onClose: () => void;
  onLog: (hobbyId: string, duration: number, notes: string) => void;
}

function LogSessionModal({ hobby, onClose, onLog }: LogSessionModalProps) {
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLog(hobby.id, duration, notes);
  };

  const quickDurations = [15, 30, 45, 60, 90, 120];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3><Clock size={20} /> Log Session: {hobby.name}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Duration (minutes)</label>
            <input
              type="number"
              min={5}
              max={480}
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value) || 60)}
            />
            <div className={styles.quickDurations}>
              {quickDurations.map(d => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.quickBtn} ${duration === d ? styles.selected : ''}`}
                  onClick={() => setDuration(d)}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What did you work on?"
              rows={3}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn}>
              <Plus size={16} /> Log Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
