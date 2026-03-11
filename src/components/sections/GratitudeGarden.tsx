import { useState, useEffect } from 'react';
import { Heart, Sprout, Sun, Moon, Wind } from 'lucide-react';

interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
  category: 'people' | 'nature' | 'growth' | 'moment' | 'gift';
}

const categoryIcons = {
  people: Heart,
  nature: Sprout,
  growth: Sun,
  moment: Moon,
  gift: Wind,
};

const categoryColors = {
  people: '#e74c3c',
  nature: '#2ecc71',
  growth: '#f4d03f',
  moment: '#9b59b6',
  gift: '#3498db',
};

const categoryLabels = {
  people: 'People',
  nature: 'Nature',
  growth: 'Growth',
  moment: 'Moment',
  gift: 'Gift',
};

const prompts = [
  'What made you smile today?',
  'Who are you grateful for?',
  'What small joy did you notice?',
  'What challenge helped you grow?',
  'What beauty did you witness?',
  'What are you taking for granted?',
  'What made you feel alive?',
];

export default function GratitudeGarden() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([
    {
      id: '1',
      date: '2026-03-11',
      content: 'The quiet morning hours before the world wakes up.',
      category: 'moment',
    },
    {
      id: '2',
      date: '2026-03-10',
      content: 'A good cup of coffee and a book that makes me think.',
      category: 'gift',
    },
    {
      id: '3',
      date: '2026-03-09',
      content: 'The homelab humming in the background, doing its work.',
      category: 'growth',
    },
    {
      id: '4',
      date: '2026-03-08',
      content: 'Late night gym sessions when the world is asleep.',
      category: 'nature',
    },
    {
      id: '5',
      date: '2026-03-07',
      content: 'Friends who understand the value of silence.',
      category: 'people',
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ content: '', category: 'moment' as const });
  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const addEntry = () => {
    if (!newEntry.content.trim()) return;

    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: newEntry.content,
      category: newEntry.category,
    };

    setEntries([entry, ...entries]);
    setNewEntry({ content: '', category: 'moment' });
    setIsAdding(false);
  };

  // Calculate garden stats
  const gardenStats = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalGratitude = entries.length;
  const streakDays = 5; // Simulated streak

  return (
    <section className="gratitude-section" id="gratitude" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Daily Practice
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Gratitude Garden
        </h2>
      </div>

      {/* Garden Visualization */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Garden Status</span>
            <span style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
              {totalGratitude} seeds of gratitude planted
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Current Streak</span>
            <span style={{ fontSize: '1.25rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>
              {streakDays} days
            </span>
          </div>
        </div>

        {/* Garden Plot */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '0.5rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const entry = entries[i];
            const Icon = entry ? categoryIcons[entry.category] : null;
            const color = entry ? categoryColors[entry.category] : 'transparent';

            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  background: entry ? `${color}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${entry ? color : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                title={entry ? entry.content : 'Empty plot'}
              >
                {Icon && <Icon size={14} style={{ color }} />}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={14} style={{ color: categoryColors[key as keyof typeof categoryColors] }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {label} ({gardenStats[key] || 0})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Entry Button */}
      <div
        onClick={() => setIsAdding(true)}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px dashed rgba(244, 208, 63, 0.3)',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '2rem',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-gold)';
          e.currentTarget.style.background = 'rgba(244, 208, 63, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.3)';
          e.currentTarget.style.background = 'var(--bg-secondary)';
        }}
      >
        <Sprout size={24} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', opacity: 0.6 }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block' }}>
          Plant a seed of gratitude
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          {prompts[currentPrompt]}
        </span>
      </div>

      {/* Recent Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.slice(0, 5).map((entry) => {
          const Icon = categoryIcons[entry.category];
          const color = categoryColors[entry.category];

          return (
            <div
              key={entry.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                  {entry.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{entry.date}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.4rem',
                    background: `${color}20`,
                    color,
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {categoryLabels[entry.category]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Entry Modal */}
      {isAdding && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setIsAdding(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
              Plant a Seed of Gratitude
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              {prompts[currentPrompt]}
            </p>

            <textarea
              placeholder="What are you grateful for?"
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((cat) => {
                const Icon = categoryIcons[cat];
                const color = categoryColors[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setNewEntry({ ...newEntry, category: cat })}
                    style={{
                      flex: 1,
                      minWidth: '80px',
                      padding: '0.5rem',
                      background: newEntry.category === cat ? `${color}30` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${newEntry.category === cat ? color : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '4px',
                      color: newEntry.category === cat ? color : 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon size={16} />
                    {categoryLabels[cat]}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addEntry}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Plant Seed
              </button>
              <button
                onClick={() => setIsAdding(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
