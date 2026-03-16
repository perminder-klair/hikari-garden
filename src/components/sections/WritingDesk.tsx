import { useState, useEffect } from 'react';
import { PenLine, Save, Trash2, Calendar, Clock } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface WritingEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  wordCount: number;
  type: 'morning-pages' | 'journal' | 'idea' | 'draft';
}

const writingPrompts = [
  "What would you do if you knew you couldn't fail?",
  "Describe your ideal day from start to finish.",
  "What are you avoiding that you need to face?",
  "Write a letter to your future self.",
  "What did you learn from your biggest mistake?",
  "Describe a place that makes you feel at peace.",
  "What are you grateful for right now?",
  "If you could change one thing about today, what would it be?",
  "What does success look like to you?",
  "Write about a book that changed your perspective.",
];

const typeLabels = {
  'morning-pages': 'Morning Pages',
  'journal': 'Journal Entry',
  'idea': 'Idea Seed',
  'draft': 'Draft',
};

const typeColors = {
  'morning-pages': '#f4d03f',
  'journal': '#9b59b6',
  'idea': '#2ecc71',
  'draft': '#3498db',
};

export default function WritingDesk() {
  const [entries, setEntries] = useState<WritingEntry[]>([
    {
      id: '1',
      title: 'Morning Thoughts',
      content: 'The quiet hours before dawn are when the mind speaks most clearly. No notifications, no demands, just the gentle hum of the server and the soft glow of the monitor. This is when ideas take root.',
      date: '2026-03-11',
      wordCount: 42,
      type: 'morning-pages',
    },
    {
      id: '2',
      title: 'On Digital Gardens',
      content: 'A digital garden is not a blog. It is not a portfolio. It is a living document, constantly evolving, growing wild in some corners, carefully pruned in others. It reflects the messiness of thought itself.',
      date: '2026-03-10',
      wordCount: 38,
      type: 'idea',
    },
  ]);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', type: 'morning-pages' as const });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.writing-section');
  }, [revealRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % writingPrompts.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const wordCount = newEntry.content.split(/\s+/).filter(Boolean).length;

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    const entry: WritingEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      date: new Date().toISOString().split('T')[0],
      wordCount,
      type: newEntry.type,
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', type: 'morning-pages' });
    setIsWriting(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const totalWords = entries.reduce((acc, e) => acc + e.wordCount, 0);

  return (
    <section className="writing-section" id="writing" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Creative Space
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Writing Desk
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <PenLine size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{entries.length}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Entries</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{totalWords}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Words</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{Math.round(totalWords / entries.length || 0)}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Words</span>
        </div>
      </div>

      {/* Prompt Card */}
      {!isWriting && (
        <div
          onClick={() => setIsWriting(true)}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px dashed rgba(244, 208, 63, 0.3)',
            borderRadius: '8px',
            padding: '2rem',
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
          <PenLine size={24} style={{ color: 'var(--accent-gold)', marginBottom: '1rem', opacity: 0.6 }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            Start Writing
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {writingPrompts[currentPrompt]}
          </span>
        </div>
      )}

      {/* Writing Interface */}
      {isWriting && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
              }}
            />
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <textarea
            placeholder="Start writing..."
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            rows={8}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              resize: 'vertical',
              marginBottom: '1rem',
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{wordCount} words</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setIsWriting(false)}
                style={{
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
              <button
                onClick={saveEntry}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {entry.title}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {entry.date}
                  </span>
                  <span>{entry.wordCount} words</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.2rem 0.4rem',
                  background: `${typeColors[entry.type]}20`,
                  color: typeColors[entry.type],
                  borderRadius: '4px',
                }}>
                  {typeLabels[entry.type]}
                </span>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {entry.content.substring(0, 150)}{entry.content.length > 150 ? '...' : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
