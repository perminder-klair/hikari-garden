import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Circle, Clock, Flame, Target, ChevronRight, RefreshCw } from 'lucide-react';
import styles from './DailyChallenge.module.css';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'coding' | 'learning' | 'fitness' | 'mindfulness';
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  streak: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Code Review',
    description: 'Review 3 pull requests or refactor one piece of legacy code',
    category: 'coding',
    difficulty: 'medium',
    completed: false,
    streak: 5
  },
  {
    id: '2',
    title: 'Learn Something New',
    description: 'Spend 30 minutes learning a new concept or technology',
    category: 'learning',
    difficulty: 'easy',
    completed: true,
    streak: 12
  },
  {
    id: '3',
    title: 'Deep Work Session',
    description: 'Complete a 90-minute focused work session without distractions',
    category: 'mindfulness',
    difficulty: 'medium',
    completed: false,
    streak: 3
  },
  {
    id: '4',
    title: 'Documentation',
    description: 'Write documentation for a project or create a README',
    category: 'coding',
    difficulty: 'easy',
    completed: false,
    streak: 0
  },
  {
    id: '5',
    title: 'Algorithm Practice',
    description: 'Solve one algorithm problem or complete a coding challenge',
    category: 'coding',
    difficulty: 'hard',
    completed: false,
    streak: 7
  },
];

const CATEGORY_ICONS = {
  coding: '💻',
  learning: '📚',
  fitness: '💪',
  mindfulness: '🧘'
};

const DIFFICULTY_COLORS = {
  easy: '#2ecc71',
  medium: '#f39c12',
  hard: '#e74c3c'
};

export default function DailyChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalStreak = challenges.reduce((sum, c) => sum + c.streak, 0);

  const toggleChallenge = (id: string) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, completed: !c.completed, streak: c.completed ? c.streak - 1 : c.streak + 1 } : c
    ));
  };

  const resetDaily = () => {
    setChallenges(challenges.map(c => ({ ...c, completed: false })));
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Trophy className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Daily Challenge</h2>
        <p className={styles.sectionSubtitle}>Level up every day</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <Target className={styles.statIcon} />
          <span className={styles.statValue}>{completedCount}/{challenges.length}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        
        <div className={styles.stat}>
          <Flame className={styles.statIcon} />
          <span className={styles.statValue}>{totalStreak}</span>
          <span className={styles.statLabel}>Total Streak</span>
        </div>
        
        <div className={styles.stat}>
          <Clock className={styles.statIcon} />
          <span className={styles.statValue}>{currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span className={styles.statLabel}>Today</span>
        </div>
      </div>

      <div className={styles.categories}>
        {['all', 'coding', 'learning', 'fitness', 'mindfulness'].map(cat => (
          <button
            key={cat}
            className={styles.categoryButton}
            data-active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat !== 'all' && <span>{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>}
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.challengesList}>
        {filteredChallenges.map(challenge => (
          <div 
            key={challenge.id} 
            className={styles.challengeCard}
            data-completed={challenge.completed}
          >
            <button 
              className={styles.checkbox}
              onClick={() => toggleChallenge(challenge.id)}
            >
              {challenge.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>

            <div className={styles.challengeContent}>
              <div className={styles.challengeHeader}>
                <span className={styles.categoryIcon}>
                  {CATEGORY_ICONS[challenge.category]}
                </span>
                <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                
                <span 
                  className={styles.difficulty}
                  style={{ color: DIFFICULTY_COLORS[challenge.difficulty] }}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <p className={styles.challengeDescription}>{challenge.description}</p>

              {challenge.streak > 0 && (
                <div className={styles.streak}>
                  <Flame size={14} />
                  <span>{challenge.streak} day streak</span>
                </div>
              )}
            </div>

            <ChevronRight className={styles.arrow} size={20} />
          </div>
        ))}
      </div>

      {completedCount === challenges.length && (
        <div className={styles.celebration}>
          <Trophy size={48} />
          <h3>All challenges completed! 🎉</h3>
          <p>Great job today! Come back tomorrow for new challenges.</p>
        </div>
      )}

      <button className={styles.resetButton} onClick={resetDaily}>
        <RefreshCw size={16} />
        Reset Daily Challenges
      </button>
    </section>
  );
}
