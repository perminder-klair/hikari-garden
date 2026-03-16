import { useState, useEffect } from 'react';
import { Target, Trophy, Zap, Calendar, CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'yearly';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  status: 'active' | 'completed' | 'failed';
  progress: number;
  target: number;
  unit: string;
  xp: number;
  deadline?: string;
  completedAt?: string;
  streak: number;
}

const initialQuests: Quest[] = [
  {
    id: '1',
    title: 'Morning Routine',
    description: 'Complete morning meditation and journaling',
    category: 'daily',
    difficulty: 'easy',
    status: 'active',
    progress: 0,
    target: 1,
    unit: 'session',
    xp: 10,
    streak: 12,
  },
  {
    id: '2',
    title: 'Code Commit',
    description: 'Push at least one meaningful commit',
    category: 'daily',
    difficulty: 'easy',
    status: 'active',
    progress: 1,
    target: 1,
    unit: 'commit',
    xp: 15,
    streak: 45,
  },
  {
    id: '3',
    title: 'Gym Sessions',
    description: 'Hit the gym 4 times this week',
    category: 'weekly',
    difficulty: 'medium',
    status: 'active',
    progress: 3,
    target: 4,
    unit: 'sessions',
    xp: 50,
    streak: 8,
  },
  {
    id: '4',
    title: 'Side Project',
    description: 'Ship a new feature to the Digital Garden',
    category: 'weekly',
    difficulty: 'hard',
    status: 'active',
    progress: 1,
    target: 1,
    unit: 'feature',
    xp: 100,
    streak: 4,
  },
  {
    id: '5',
    title: 'Learn Rust',
    description: 'Complete Rust programming course',
    category: 'monthly',
    difficulty: 'epic',
    status: 'active',
    progress: 35,
    target: 100,
    unit: '%',
    xp: 500,
    deadline: '2026-03-31',
    streak: 0,
  },
  {
    id: '6',
    title: 'Read 24 Books',
    description: 'Complete reading challenge for the year',
    category: 'yearly',
    difficulty: 'epic',
    status: 'active',
    progress: 5,
    target: 24,
    unit: 'books',
    xp: 1000,
    streak: 0,
  },
];

const difficultyConfig = {
  easy: { color: '#2ecc71', xp: 10, icon: Zap },
  medium: { color: '#3498db', xp: 25, icon: Target },
  hard: { color: '#e67e22', xp: 50, icon: Trophy },
  epic: { color: '#9b59b6', xp: 100, icon: TrendingUp },
};

const categories = ['all', 'daily', 'weekly', 'monthly', 'yearly'];

export default function GoalQuest() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [filter, setFilter] = useState<string>('all');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.goal-quest-section');
  }, [revealRef]);

  const filteredQuests = filter === 'all' 
    ? quests 
    : quests.filter(q => q.category === filter);

  const stats = {
    total: quests.length,
    completed: quests.filter(q => q.status === 'completed').length,
    active: quests.filter(q => q.status === 'active').length,
    totalXP: quests.reduce((acc, q) => acc + (q.status === 'completed' ? q.xp : 0), 0),
  };

  const completeQuest = (questId: string) => {
    setQuests(quests.map(q => 
      q.id === questId 
        ? { ...q, status: 'completed', progress: q.target, completedAt: new Date().toISOString().split('T')[0] }
        : q
    ));
  };

  const updateProgress = (questId: string, amount: number) => {
    setQuests(quests.map(q => {
      if (q.id !== questId) return q;
      const newProgress = Math.min(q.progress + amount, q.target);
      return { ...q, progress: newProgress };
    }));
  };

  return (
    <section className="goal-quest-section" id="quests" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Achievement System
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Goal Quest
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Target size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
              {stats.active}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>
            {stats.completed}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
            <Zap size={16} style={{ color: '#f39c12' }} />
            <span style={{ fontSize: '2rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>
              {stats.totalXP}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>XP Earned</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === cat ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredQuests.map(quest => {
          const config = difficultyConfig[quest.difficulty];
          const Icon = config.icon;
          const progressPercent = (quest.progress / quest.target) * 100;
          
          return (
            <div
              key={quest.id}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${quest.status === 'completed' ? '#2ecc71' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${config.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: `${config.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: config.color,
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
                      {quest.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {quest.category} • {quest.difficulty}
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  background: `${config.color}20`,
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: config.color,
                }}>
                  +{quest.xp} XP
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {quest.description}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {quest.progress}/{quest.target} {quest.unit}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: quest.status === 'completed' ? '#2ecc71' : config.color,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  {quest.deadline ? `Due ${quest.deadline}` : `Streak: ${quest.streak}`}
                </div>
                
                {quest.status === 'active' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => updateProgress(quest.id, 1)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      +1
                    </button>
                    {quest.progress >= quest.target && (
                      <button
                        onClick={() => completeQuest(quest.id)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: '#2ecc71',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'var(--bg-primary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                )}
                
                {quest.status === 'completed' && (
                  <span style={{ fontSize: '0.75rem', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} />
                    Done
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
