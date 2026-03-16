import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Smile, Frown, Meh, Zap, Sun, Moon, Activity } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  notes: string;
  tags: string[];
}

const moodData: MoodEntry[] = [
  { date: '2026-03-13', mood: 4, energy: 5, notes: 'Great day, productive morning', tags: ['productive', 'focused'] },
  { date: '2026-03-12', mood: 3, energy: 3, notes: 'Average day, bit tired', tags: ['tired'] },
  { date: '2026-03-11', mood: 5, energy: 4, notes: 'Excellent! Garden evolution cycle completed', tags: ['creative', 'accomplished'] },
  { date: '2026-03-10', mood: 4, energy: 4, notes: 'Good progress on projects', tags: ['productive'] },
  { date: '2026-03-09', mood: 3, energy: 2, notes: 'Low energy, needed rest', tags: ['rest', 'recovery'] },
  { date: '2026-03-08', mood: 4, energy: 5, notes: 'Weekend vibes, relaxed', tags: ['weekend', 'relaxed'] },
  { date: '2026-03-07', mood: 5, energy: 5, notes: 'Amazing day with friends', tags: ['social', 'happy'] },
];

const moodLabels: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: 'Rough', emoji: '😔', color: '#e74c3c' },
  2: { label: 'Low', emoji: '😕', color: '#e67e22' },
  3: { label: 'Okay', emoji: '😐', color: '#f39c12' },
  4: { label: 'Good', emoji: '🙂', color: '#2ecc71' },
  5: { label: 'Great', emoji: '😄', color: '#27ae60' },
};

export default function MoodAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.mood-analytics-section');
  }, [revealRef]);

  const avgMood = moodData.reduce((acc, m) => acc + m.mood, 0) / moodData.length;
  const avgEnergy = moodData.reduce((acc, m) => acc + m.energy, 0) / moodData.length;
  const bestDay = moodData.reduce((best, current) => current.mood > best.mood ? current : best, moodData[0]);
  
  const moodCounts = moodData.reduce((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const topTags = moodData
    .flatMap(m => m.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedTags = Object.entries(topTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="mood-analytics-section" id="mood-analytics" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Emotional Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Mood Analytics
        </h2>
      </div>

      {/* Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        {(['week', 'month', 'year'] as const).map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={{
              padding: '0.5rem 1.5rem',
              background: selectedPeriod === period ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              color: selectedPeriod === period ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '0.9rem',
            }}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Smile size={24} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{avgMood.toFixed(1)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Mood</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Zap size={24} style={{ color: '#f39c12', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{avgEnergy.toFixed(1)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Energy</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Sun size={24} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{bestDay.date.slice(5)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Best Day</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Activity size={24} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{moodData.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Entries</div>
        </div>
      </div>

      {/* Mood Chart */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mood Trend</span>
          <TrendingUp size={18} color="var(--accent-gold)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '150px', padding: '1rem 0' }}>
          {moodData.slice().reverse().map((day) => {
            const mood = moodLabels[day.mood];
            return (
              <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '1.2rem' }}>{mood.emoji}</div>
                <div style={{
                  width: '100%',
                  height: `${day.mood * 20}%`,
                  background: mood.color,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px',
                  transition: 'height 0.3s ease',
                }} />
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mood Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mood Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[5, 4, 3, 2, 1].map(level => {
              const count = moodCounts[level] || 0;
              const percentage = (count / moodData.length) * 100;
              const mood = moodLabels[level];
              return (
                <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '40px', fontSize: '1.2rem' }}>{mood.emoji}</span>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: mood.color,
                      borderRadius: '4px',
                    }} />
                  </div>
                  <span style={{ width: '30px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Top Tags</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedTags.map(([tag, count]) => (
              <div key={tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(244, 208, 63, 0.1)',
                  borderRadius: '4px',
                  color: 'var(--accent-gold)',
                  fontSize: '0.85rem',
                  textTransform: 'capitalize',
                }}>
                  {tag}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{count} entries</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Recent Entries</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {moodData.slice(0, 5).map(entry => {
            const mood = moodLabels[entry.mood];
            return (
              <div key={entry.date} style={{
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: `${mood.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {mood.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{mood.label}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {entry.date}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{entry.notes}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {entry.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '0.15rem 0.4rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
