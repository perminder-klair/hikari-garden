import { useState, useEffect } from 'react';
import { Zap, Sun, Moon, Coffee, TrendingUp, Calendar } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface EnergyEntry {
  id: string;
  date: string;
  morning: number;
  afternoon: number;
  evening: number;
  notes: string;
  factors: string[];
}

const energyLevels = [
  { level: 1, label: 'Drained', color: '#e74c3c', emoji: '😴' },
  { level: 2, label: 'Low', color: '#e67e22', emoji: '😔' },
  { level: 3, label: 'Moderate', color: '#f39c12', emoji: '😐' },
  { level: 4, label: 'Good', color: '#2ecc71', emoji: '🙂' },
  { level: 5, label: 'Peak', color: '#27ae60', emoji: '⚡' },
];

const factors = ['Sleep', 'Exercise', 'Caffeine', 'Stress', 'Social', 'Work', 'Weather', 'Meals'];

export default function EnergyTracker() {
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    morning: 3,
    afternoon: 3,
    evening: 3,
    notes: '',
    factors: [] as string[],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.energy-tracker-section');
    const sample: EnergyEntry[] = [
      { id: '1', date: '2026-03-11', morning: 4, afternoon: 5, evening: 3, notes: 'Great workout', factors: ['Exercise', 'Sleep'] },
      { id: '2', date: '2026-03-10', morning: 3, afternoon: 4, evening: 2, notes: 'Long meeting day', factors: ['Work', 'Stress'] },
      { id: '3', date: '2026-03-09', morning: 5, afternoon: 4, evening: 4, notes: 'Productive day', factors: ['Sleep', 'Caffeine'] },
      { id: '4', date: '2026-03-08', morning: 2, afternoon: 3, evening: 3, notes: 'Recovery day', factors: ['Weather'] },
      { id: '5', date: '2026-03-07', morning: 4, afternoon: 5, evening: 4, notes: 'Weekend energy', factors: ['Social', 'Sleep'] },
    ];
    setEntries(sample);
  }, [revealRef]);

  const addEntry = () => {
    const entry: EnergyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newEntry,
    };
    setEntries([entry, ...entries]);
    setIsAdding(false);
    setNewEntry({ morning: 3, afternoon: 3, evening: 3, notes: '', factors: [] });
  };

  const toggleFactor = (factor: string) => {
    setNewEntry(prev => ({
      ...prev,
      factors: prev.factors.includes(factor)
        ? prev.factors.filter(f => f !== factor)
        : [...prev.factors, factor],
    }));
  };

  const avgEnergy = entries.length
    ? (entries.reduce((acc, e) => acc + e.morning + e.afternoon + e.evening, 0) / (entries.length * 3)).toFixed(1)
    : '0';

  const getEnergyColor = (level: number) => energyLevels.find(e => e.level === level)?.color || '#95a5a6';

  return (
    <section className="energy-tracker-section" id="energy" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Vitality Patterns
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Energy Tracker
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Zap size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{avgEnergy}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Energy</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{entries.length}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Days Tracked</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>
            {entries.length > 0 ? Math.max(...entries.map(e => Math.max(e.morning, e.afternoon, e.evening))) : 0}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Peak Level</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Log Energy
        </button>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span><Sun size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />Morning</span>
          <span>Day</span>
          <span><Moon size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />Evening</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.slice(0, 7).map(entry => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '80px' }}>
                {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                {[entry.morning, entry.afternoon, entry.evening].map((level, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '24px',
                      background: getEnergyColor(level),
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: level >= 4 ? 'var(--bg-primary)' : 'var(--text-primary)',
                    }}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {factors.map(factor => {
          const count = entries.filter(e => e.factors.includes(factor)).length;
          const avgWithFactor = entries
            .filter(e => e.factors.includes(factor))
            .reduce((acc, e) => acc + (e.morning + e.afternoon + e.evening) / 3, 0) / (count || 1);
          
          return (
            <div
              key={factor}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{factor}</div>
              <div style={{ fontSize: '1.5rem', color: getEnergyColor(Math.round(avgWithFactor)), fontFamily: 'Cormorant Garamond, serif' }}>
                {count > 0 ? avgWithFactor.toFixed(1) : '-'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{count} entries</div>
            </div>
          );
        })}
      </div>

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
              Log Today's Energy
            </h3>

            {['morning', 'afternoon', 'evening'].map((time) => (
              <div key={time} style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize', display: 'block', marginBottom: '0.5rem' }}>
                  {time}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {energyLevels.map((level) => (
                    <button
                      key={level.level}
                      onClick={() => setNewEntry({ ...newEntry, [time]: level.level })}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: newEntry[time as keyof typeof newEntry] === level.level ? level.color : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '4px',
                        color: newEntry[time as keyof typeof newEntry] === level.level ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                      }}
                    >
                      {level.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Factors</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {factors.map(factor => (
                  <button
                    key={factor}
                    onClick={() => toggleFactor(factor)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: newEntry.factors.includes(factor) ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '4px',
                      color: newEntry.factors.includes(factor) ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Notes..."
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addEntry}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                }}
              >
                Save Entry
              </button>
              <button
                onClick={() => setIsAdding(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
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
