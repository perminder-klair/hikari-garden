import { useState, useRef, useEffect } from 'react';
import { Trophy, Plus, X, Calendar, Target, Flame, CheckCircle2, Clock } from 'lucide-react';
import styles from './ChallengeTracker.module.css';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  duration: number; // in days
  startDate: string;
  endDate: string;
  progress: number[]; // array of 0/1 for each day
  streak: number;
  bestStreak: number;
  color: string;
}

const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness every morning',
    type: 'daily',
    duration: 30,
    startDate: '2026-03-01',
    endDate: '2026-03-30',
    progress: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    streak: 5,
    bestStreak: 7,
    color: '#9b59b6',
  },
  {
    id: '2',
    title: 'Read 2 Books',
    description: 'Complete 2 books this month',
    type: 'monthly',
    duration: 30,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    progress: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    streak: 0,
    bestStreak: 2,
    color: '#3498db',
  },
  {
    id: '3',
    title: 'No Sugar Week',
    description: 'Zero refined sugar for 7 days',
    type: 'weekly',
    duration: 7,
    startDate: '2026-03-10',
    endDate: '2026-03-16',
    progress: [1, 1, 1, 0, 1, 1, 1],
    streak: 1,
    bestStreak: 6,
    color: '#e74c3c',
  },
];

const challengeTypes = [
  { id: 'daily', label: 'Daily', icon: Clock },
  { id: 'weekly', label: 'Weekly', icon: Calendar },
  { id: 'monthly', label: 'Monthly', icon: Target },
];

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63', '#ff5722'];

export default function ChallengeTracker() {
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
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

  const filteredChallenges = filter === 'all' 
    ? challenges 
    : challenges.filter(c => c.type === filter);

  const activeChallenges = challenges.filter(c => !isCompleted(c)).length;
  const completedChallenges = challenges.filter(isCompleted).length;
  const totalStreak = challenges.reduce((acc, c) => acc + c.streak, 0);

  function isCompleted(challenge: Challenge): boolean {
    const today = new Date().toISOString().split('T')[0];
    return today > challenge.endDate || challenge.progress.filter(p => p === 1).length >= challenge.duration;
  }

  function getProgressPercentage(challenge: Challenge): number {
    const completed = challenge.progress.filter(p => p === 1).length;
    return Math.round((completed / challenge.duration) * 100);
  }

  function toggleDay(challengeId: string, dayIndex: number) {
    setChallenges(prev => prev.map(c => {
      if (c.id !== challengeId) return c;
      const newProgress = [...c.progress];
      newProgress[dayIndex] = newProgress[dayIndex] === 1 ? 0 : 1;
      
      // Calculate streak
      let streak = 0;
      for (let i = newProgress.length - 1; i >= 0; i--) {
        if (newProgress[i] === 1) streak++;
        else break;
      }
      
      return {
        ...c,
        progress: newProgress,
        streak,
        bestStreak: Math.max(streak, c.bestStreak),
      };
    }));
  }

  function addChallenge(challenge: Omit<Challenge, 'id' | 'progress' | 'streak' | 'bestStreak'>) {
    const newChallenge: Challenge = {
      ...challenge,
      id: Date.now().toString(),
      progress: new Array(challenge.duration).fill(0),
      streak: 0,
      bestStreak: 0,
    };
    setChallenges(prev => [...prev, newChallenge]);
    setShowAddModal(false);
  }

  function deleteChallenge(id: string) {
    setChallenges(prev => prev.filter(c => c.id !== id));
  }

  return (
    <section className={styles.challengeTracker} ref={revealRef}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Trophy className={styles.icon} />
          <h2>Challenge Tracker</h2>
        </div>
        <p className={styles.subtitle}>Build habits. Crush goals. Level up.</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeChallenges}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedChallenges}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalStreak}</span>
          <span className={styles.statLabel}>Total Streak</span>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {challengeTypes.map(type => (
          <button
            key={type.id}
            className={`${styles.filterBtn} ${filter === type.id ? styles.active : ''}`}
            onClick={() => setFilter(type.id as any)}
          >
            <type.icon size={14} />
            {type.label}
          </button>
        ))}
      </div>

      <div className={styles.challengesGrid}>
        {filteredChallenges.map(challenge => {
          const progress = getProgressPercentage(challenge);
          const completed = isCompleted(challenge);
          const TypeIcon = challengeTypes.find(t => t.id === challenge.type)?.icon || Target;

          return (
            <div
              key={challenge.id}
              className={`${styles.challengeCard} ${completed ? styles.completed : ''}`}
              style={{ '--challenge-color': challenge.color } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <div className={styles.typeBadge}>
                  <TypeIcon size={12} />
                  <span>{challenge.type}</span>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteChallenge(challenge.id)}
                >
                  <X size={14} />
                </button>
              </div>

              <h3 className={styles.challengeTitle}>{challenge.title}</h3>
              <p className={styles.challengeDesc}>{challenge.description}</p>

              <div className={styles.metaRow}>
                <div className={styles.streak}>
                  <Flame size={14} />
                  <span>{challenge.streak} day streak</span>
                </div>
                <div className={styles.bestStreak}>
                  Best: {challenge.bestStreak}
                </div>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={styles.progressText}>{progress}%</span>
              </div>

              <div className={styles.daysGrid}>
                {challenge.progress.map((completed, idx) => (
                  <button
                    key={idx}
                    className={`${styles.dayBox} ${completed ? styles.completed : ''}`}
                    onClick={() => toggleDay(challenge.id, idx)}
                    title={`Day ${idx + 1}`}
                  >
                    {completed && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>

              {completed && (
                <div className={styles.completedBadge}>
                  <Trophy size={16} />
                  <span>Challenge Complete!</span>
                </div>
              )}
            </div>
          );
        })}

        <button className={styles.addCard} onClick={() => setShowAddModal(true)}>
          <Plus size={32} />
          <span>New Challenge</span>
        </button>
      </div>

      {showAddModal && (
        <AddChallengeModal
          onClose={() => setShowAddModal(false)}
          onAdd={addChallenge}
        />
      )}
    </section>
  );
}

interface AddChallengeModalProps {
  onClose: () => void;
  onAdd: (challenge: Omit<Challenge, 'id' | 'progress' | 'streak' | 'bestStreak'>) => void;
}

function AddChallengeModal({ onClose, onAdd }: AddChallengeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Challenge['type']>('daily');
  const [duration, setDuration] = useState(30);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    onAdd({
      title: title.trim(),
      description: description.trim(),
      type,
      duration,
      startDate,
      endDate,
      color: selectedColor,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3><Trophy size={20} /> New Challenge</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Challenge Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., 30 Days of Code"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What are you committing to?"
              rows={2}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select value={type} onChange={e => setType(e.target.value as Challenge['type'])}>
                {challengeTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Duration (days)</label>
              <input
                type="number"
                min={1}
                max={365}
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 30)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Color</label>
            <div className={styles.colorPicker}>
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn}>
              <Plus size={16} /> Start Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
