import { useState, useEffect, useCallback } from 'react';
import { Focus, Play, Pause, RotateCcw, Trophy, Clock, TrendingUp, Calendar, Target } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface FocusSession {
  id: string;
  date: string;
  duration: number; // minutes
  task: string;
  category: string;
  completed: boolean;
}

const categories = [
  { name: 'Deep Work', color: '#9b59b6' },
  { name: 'Learning', color: '#3498db' },
  { name: 'Creative', color: '#e74c3c' },
  { name: 'Planning', color: '#2ecc71' },
  { name: 'Review', color: '#f39c12' },
];

const initialSessions: FocusSession[] = [
  { id: '1', date: '2026-03-12', duration: 90, task: 'Garden development', category: 'Deep Work', completed: true },
  { id: '2', date: '2026-03-12', duration: 45, task: 'Reading documentation', category: 'Learning', completed: true },
  { id: '3', date: '2026-03-11', duration: 120, task: 'Architecture design', category: 'Creative', completed: true },
  { id: '4', date: '2026-03-11', duration: 60, task: 'Code review', category: 'Review', completed: true },
  { id: '5', date: '2026-03-10', duration: 75, task: 'Feature planning', category: 'Planning', completed: true },
];

export default function FocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>(initialSessions);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [currentTask, setCurrentTask] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Deep Work');
  const [showComplete, setShowComplete] = useState(false);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.focus-sessions-section');
  }, [revealRef]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowComplete(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && !currentTask) {
      setCurrentTask('Focus Session');
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
  };

  const completeSession = () => {
    const session: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      duration: selectedDuration,
      task: currentTask || 'Focus Session',
      category: currentCategory,
      completed: true,
    };
    setSessions([session, ...sessions]);
    setShowComplete(false);
    setTimeLeft(selectedDuration * 60);
    setCurrentTask('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  const categoryStats = categories.map(cat => ({
    ...cat,
    minutes: sessions.filter(s => s.category === cat.name).reduce((acc, s) => acc + s.duration, 0),
  })).filter(c => c.minutes > 0).sort((a, b) => b.minutes - a.minutes);

  // Last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const getDayMinutes = (date: string) => 
    sessions.filter(s => s.date === date).reduce((acc, s) => acc + s.duration, 0);

  return (
    <section className="focus-sessions-section" id="focus" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Deep Work
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Focus Sessions
        </h2>
      </div>

      {/* Timer Card */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        
        {/* Duration Selector */}
        {!isActive && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {[15, 25, 45, 60, 90].map(min => (
              <button
                key={min}
                onClick={() => { setSelectedDuration(min); setTimeLeft(min * 60); }}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedDuration === min ? 'var(--accent-gold)' : 'transparent',
                  border: `1px solid ${selectedDuration === min ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '4px',
                  color: selectedDuration === min ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {min}m
              </button>
            ))}
          </div>
        )}

        {/* Timer Display */}
        <div style={{ fontSize: '6rem', fontWeight: 300, color: isActive ? '#2ecc71' : 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '2rem', letterSpacing: '0.05em' }}>
          {formatTime(timeLeft)}
        </div>

        {/* Task Input */}
        {!isActive && (
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="What are you focusing on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                textAlign: 'center',
              }}
            />
          </div>
        )}

        {/* Category Selector */}
        {!isActive && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setCurrentCategory(cat.name)}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentCategory === cat.name ? cat.color : 'transparent',
                  border: `1px solid ${currentCategory === cat.name ? cat.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '20px',
                  color: currentCategory === cat.name ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTimer}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isActive ? '#e74c3c' : '#2ecc71',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>
          
          <button
            onClick={resetTimer}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Clock size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{todayMinutes}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Minutes Today</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Target size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{todaySessions.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sessions Today</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Trophy size={20} style={{ color: '#f39c12', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{totalSessions}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Sessions</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <TrendingUp size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{Math.floor(totalMinutes / 60)}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Time</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} />
          Last 7 Days
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '100px' }}>
          {last7Days.map(date => {
            const minutes = getDayMinutes(date);
            const maxMinutes = Math.max(...last7Days.map(getDayMinutes)) || 1;
            const height = minutes > 0 ? (minutes / maxMinutes) * 100 : 4;
            const isToday = date === today;
            return (
              <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    background: isToday ? 'var(--accent-gold)' : '#3498db',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '4px',
                    opacity: minutes > 0 ? 1 : 0.3,
                  }}
                  title={`${date}: ${minutes} minutes`}
                />
                <span style={{ fontSize: '0.65rem', color: isToday ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                  {new Date(date).toLocaleDateString('en-GB', { weekday: 'narrow' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {categoryStats.map(cat => (
          <div key={cat.name} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{cat.name}</span>
              <span style={{ fontSize: '0.8rem', color: cat.color }}>{cat.minutes}m</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(cat.minutes / categoryStats[0].minutes) * 100}%`, height: '100%', background: cat.color, borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Recent Sessions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sessions.slice(0, 5).map(session => {
            const cat = categories.find(c => c.name === session.category);
            return (
              <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: cat?.color || '#95a5a6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Focus size={20} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{session.task}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{session.date} • {session.category}</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{session.duration}m</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Modal */}
      {showComplete && (
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
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(46, 204, 113, 0.3)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#2ecc71', marginBottom: '1rem' }}>
              Session Complete!
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              You focused for {selectedDuration} minutes on "{currentTask || 'Focus Session'}"
            </p>
            <button
              onClick={completeSession}
              style={{
                padding: '0.75rem 2rem',
                background: '#2ecc71',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Save Session
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
