import { useState } from 'react';
import { Moon, Star, Cloud, Sparkles } from 'lucide-react';

interface Dream {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'lucid' | 'vivid' | 'foggy' | 'fragmented';
  symbols: string[];
}

const moodIcons = {
  lucid: Sparkles,
  vivid: Star,
  foggy: Cloud,
  fragmented: Moon,
};

const moodColors = {
  lucid: '#f4d03f',
  vivid: '#9b59b6',
  foggy: '#95a5a6',
  fragmented: '#607d8b',
};

export default function DreamJournal() {
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: '1',
      date: '2026-03-10',
      title: 'The Floating Library',
      content: 'Bookshelves suspended in mid-air, connected by bridges of light. Each book whispered its contents as I passed.',
      mood: 'lucid',
      symbols: ['books', 'flight', 'knowledge'],
    },
    {
      id: '2',
      date: '2026-03-08',
      title: 'Garden of Code',
      content: 'Plants growing in patterns of syntax and logic. Bugs were literal insects that needed gentle relocation.',
      mood: 'vivid',
      symbols: ['garden', 'code', 'nature'],
    },
    {
      id: '3',
      date: '2026-03-05',
      title: 'The Silent Train',
      content: 'Traveling through landscapes that shifted like paintings. No sound, only the sensation of movement.',
      mood: 'foggy',
      symbols: ['journey', 'silence', 'change'],
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDream, setNewDream] = useState({ title: '', content: '', mood: 'vivid' as Dream['mood'], symbols: '' });

  const addDream = () => {
    if (!newDream.title || !newDream.content) return;
    
    const dream: Dream = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: newDream.title,
      content: newDream.content,
      mood: newDream.mood,
      symbols: newDream.symbols.split(',').map(s => s.trim()).filter(Boolean),
    };
    
    setDreams([dream, ...dreams]);
    setNewDream({ title: '', content: '', mood: 'vivid', symbols: '' });
    setIsAdding(false);
  };

  return (
    <section className="dream-journal-section" id="dreams" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Subconscious Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Dream Journal
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Add Dream Card */}
        <div
          onClick={() => setIsAdding(true)}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px dashed rgba(244, 208, 63, 0.3)',
            borderRadius: '8px',
            padding: '2rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
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
          <Moon size={32} style={{ color: 'var(--accent-gold)', marginBottom: '1rem', opacity: 0.6 }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Record a Dream</span>
        </div>

        {/* Dream Cards */}
        {dreams.map((dream) => {
          const MoodIcon = moodIcons[dream.mood];
          return (
            <div
              key={dream.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1.5rem',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {dream.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dream.date}</span>
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${moodColors[dream.mood]}20`,
                  }}
                >
                  <MoodIcon size={16} style={{ color: moodColors[dream.mood] }} />
                </div>
              </div>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {dream.content}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {dream.symbols.map((symbol, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '4px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Dream Modal */}
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
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Record a Dream
            </h3>
            
            <input
              type="text"
              placeholder="Dream title..."
              value={newDream.title}
              onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
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
              }}
            />
            
            <textarea
              placeholder="What did you dream?"
              value={newDream.content}
              onChange={(e) => setNewDream({ ...newDream, content: e.target.value })}
              rows={4}
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
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {(['lucid', 'vivid', 'foggy', 'fragmented'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setNewDream({ ...newDream, mood })}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: newDream.mood === mood ? `${moodColors[mood]}30` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${newDream.mood === mood ? moodColors[mood] : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '4px',
                    color: newDream.mood === mood ? moodColors[mood] : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
            
            <input
              type="text"
              placeholder="Symbols (comma separated)..."
              value={newDream.symbols}
              onChange={(e) => setNewDream({ ...newDream, symbols: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addDream}
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
                Save Dream
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
