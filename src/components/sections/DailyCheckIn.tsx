import { useState, useEffect } from 'react';
import { Activity, Heart, Moon, Dumbbell } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface DailyCheck {
  date: string;
  energy: number;
  mood: number;
  sleep: number;
  caffeine: number;
  exercise: boolean;
  notes: string;
}

const initialChecks: DailyCheck[] = [
  { date: '2026-03-08', energy: 4, mood: 4, sleep: 7.5, caffeine: 2, exercise: true, notes: 'Good day, productive' },
  { date: '2026-03-09', energy: 3, mood: 3, sleep: 6, caffeine: 3, exercise: false, notes: 'Tired but managed' },
  { date: '2026-03-10', energy: 5, mood: 5, sleep: 8, caffeine: 1, exercise: true, notes: 'Excellent day!' },
  { date: '2026-03-11', energy: 4, mood: 4, sleep: 7, caffeine: 2, exercise: true, notes: 'Steady progress' },
  { date: '2026-03-12', energy: 3, mood: 3, sleep: 6.5, caffeine: 2, exercise: false, notes: 'Late night coding' },
];

const moodLabels = ['😔', '😕', '😐', '🙂', '😄'];
const energyLabels = ['⚪', '🔵', '🟢', '🟡', '🔴'];

export default function DailyCheckIn() {
  const [checks, setChecks] = useState<DailyCheck[]>(initialChecks);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [todayCheck, setTodayCheck] = useState<Partial<DailyCheck>>({
    energy: 3,
    mood: 3,
    sleep: 7,
    caffeine: 2,
    exercise: false,
    notes: '',
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.daily-check-section');
  }, [revealRef]);

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = checks.some(c => c.date === today);

  const avgEnergy = checks.reduce((acc, c) => acc + c.energy, 0) / checks.length;
  const avgMood = checks.reduce((acc, c) => acc + c.mood, 0) / checks.length;
  const avgSleep = checks.reduce((acc, c) => acc + c.sleep, 0) / checks.length;
  const exerciseDays = checks.filter(c => c.exercise).length;

  const submitCheckIn = () => {
    const check: DailyCheck = {
      date: today,
      energy: todayCheck.energy || 3,
      mood: todayCheck.mood || 3,
      sleep: todayCheck.sleep || 7,
      caffeine: todayCheck.caffeine || 0,
      exercise: todayCheck.exercise || false,
      notes: todayCheck.notes || '',
    };
    setChecks([...checks.filter(c => c.date !== today), check]);
    setShowCheckIn(false);
  };

  return (
    <section className="daily-check-section" id="checkin" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Daily Reflection
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Daily Check-In
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Activity size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{avgEnergy.toFixed(1)}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Energy</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Heart size={20} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{avgMood.toFixed(1)}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Mood</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Moon size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{avgSleep.toFixed(1)}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Sleep</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Dumbbell size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{exerciseDays}/{checks.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Exercise Days</div>
        </div>
      </div>

      {!hasCheckedInToday && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setShowCheckIn(true)}
            style={{
              padding: '1rem 2rem',
              background: 'var(--accent-gold)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--bg-primary)',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Activity size={20} />
            Check In Today
          </button>
        </div>
      )}

      {hasCheckedInToday && (
        <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
          <span style={{ color: '#2ecc71' }}>✓ Checked in for today</span>
        </div>
      )}

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Recent History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...checks].reverse().slice(0, 7).map((check) => (
            <div
              key={check.date}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px repeat(4, 1fr)',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                background: check.date === today ? 'rgba(244, 208, 63, 0.05)' : 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: check.date === today ? '1px solid rgba(244, 208, 63, 0.2)' : '1px solid transparent',
              }}
            >
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {new Date(check.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem' }}>{energyLabels[check.energy - 1]}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Energy</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem' }}>{moodLabels[check.mood - 1]}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mood</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{check.sleep}h</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sleep</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: check.exercise ? '#2ecc71' : '#e74c3c' }}>{check.exercise ? '✓' : '✗'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Exercise</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCheckIn && (
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
          onClick={() => setShowCheckIn(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem', textAlign: 'center' }}>
              How are you today?
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Energy Level</label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setTodayCheck({ ...todayCheck, energy: level })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: `2px solid ${todayCheck.energy === level ? '#3498db' : 'rgba(255,255,255,0.1)'}`,
                      background: todayCheck.energy === level ? 'rgba(52, 152, 219, 0.2)' : 'transparent',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    {energyLabels[level - 1]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mood</label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setTodayCheck({ ...todayCheck, mood: level })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: `2px solid ${todayCheck.mood === level ? '#e74c3c' : 'rgba(255,255,255,0.1)'}`,
                      background: todayCheck.mood === level ? 'rgba(231, 76, 60, 0.2)' : 'transparent',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    {moodLabels[level - 1]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sleep (hours)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={todayCheck.sleep}
                onChange={(e) => setTodayCheck({ ...todayCheck, sleep: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={todayCheck.exercise}
                  onChange={(e) => setTodayCheck({ ...todayCheck, exercise: e.target.checked })}
                  style={{ width: '20px', height: '20px' }}
                />
                Did you exercise today?
              </label>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <textarea
                placeholder="Any notes for today..."
                value={todayCheck.notes}
                onChange={(e) => setTodayCheck({ ...todayCheck, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  minHeight: '80px',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={submitCheckIn}
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
                Submit Check-In
              </button>
              <button
                onClick={() => setShowCheckIn(false)}
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
