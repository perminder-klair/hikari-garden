import { useState, useEffect } from 'react';
import { Code, GitBranch, Bug, Zap, Trophy, Flame, Target, Calendar, Plus, CheckCircle, Circle } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface CodingSession {
  id: string;
  date: string;
  language: string;
  duration: number; // minutes
  project: string;
  commits: number;
  notes: string;
}

interface Streak {
  current: number;
  longest: number;
  lastActive: string;
}

const languages = [
  { name: 'TypeScript', color: '#3178c6', icon: 'TS' },
  { name: 'JavaScript', color: '#f7df1e', icon: 'JS' },
  { name: 'Python', color: '#3776ab', icon: 'PY' },
  { name: 'Rust', color: '#dea584', icon: 'RS' },
  { name: 'Go', color: '#00add8', icon: 'GO' },
  { name: 'Other', color: '#95a5a6', icon: '??' },
];

const initialSessions: CodingSession[] = [
  { id: '1', date: '2026-03-12', language: 'TypeScript', duration: 180, project: 'hikari-garden', commits: 5, notes: 'Added new sections' },
  { id: '2', date: '2026-03-11', language: 'TypeScript', duration: 120, project: 'thoth', commits: 3, notes: 'Bug fixes' },
  { id: '3', date: '2026-03-10', language: 'Python', duration: 90, project: 'mignomic', commits: 2, notes: 'API integration' },
  { id: '4', date: '2026-03-09', language: 'TypeScript', duration: 240, project: 'hikari-garden', commits: 8, notes: 'Major refactor' },
  { id: '5', date: '2026-03-08', language: 'JavaScript', duration: 60, project: 'side-project', commits: 1, notes: 'Quick fix' },
];

export default function DevTracker() {
  const [sessions, setSessions] = useState<CodingSession[]>(initialSessions);
  const [showAdd, setShowAdd] = useState(false);
  const [newSession, setNewSession] = useState<Partial<CodingSession>>({
    language: 'TypeScript',
    duration: 60,
    commits: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.dev-tracker-section');
  }, [revealRef]);

  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
  const totalCommits = sessions.reduce((acc, s) => acc + s.commits, 0);
  const currentStreak = calculateStreak(sessions);
  const longestStreak = 12; // Mock data

  const languageStats = languages.map(lang => {
    const langSessions = sessions.filter(s => s.language === lang.name);
    const minutes = langSessions.reduce((acc, s) => acc + s.duration, 0);
    return { ...lang, minutes, sessions: langSessions.length };
  }).filter(l => l.minutes > 0).sort((a, b) => b.minutes - a.minutes);

  const projectStats = [...new Set(sessions.map(s => s.project))].map(project => ({
    name: project,
    hours: sessions.filter(s => s.project === project).reduce((acc, s) => acc + s.duration, 0) / 60,
    commits: sessions.filter(s => s.project === project).reduce((acc, s) => acc + s.commits, 0),
  })).sort((a, b) => b.hours - a.hours);

  function calculateStreak(sessions: CodingSession[]): number {
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 && (dates[i] === today || dates[i] === yesterday)) {
        streak++;
      } else if (i > 0) {
        const curr = new Date(dates[i]);
        const prev = new Date(dates[i - 1]);
        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
      }
    }
    return streak;
  }

  const addSession = () => {
    if (!newSession.project) return;
    const session: CodingSession = {
      id: Date.now().toString(),
      date: newSession.date || new Date().toISOString().split('T')[0],
      language: newSession.language || 'TypeScript',
      duration: newSession.duration || 60,
      project: newSession.project,
      commits: newSession.commits || 0,
      notes: newSession.notes || '',
    };
    setSessions([session, ...sessions]);
    setShowAdd(false);
    setNewSession({ language: 'TypeScript', duration: 60, commits: 0, date: new Date().toISOString().split('T')[0] });
  };

  // Generate last 30 days activity
  const activityDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const getActivityLevel = (date: string) => {
    const daySessions = sessions.filter(s => s.date === date);
    const minutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
    if (minutes === 0) return 0;
    if (minutes < 60) return 1;
    if (minutes < 120) return 2;
    if (minutes < 180) return 3;
    return 4;
  };

  const activityColors = ['rgba(255,255,255,0.05)', '#2ecc7133', '#2ecc7166', '#2ecc71aa', '#2ecc71'];

  return (
    <section className="dev-tracker-section" id="dev" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Code & Craft
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Dev Tracker
        </h2>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Code size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{totalHours.toFixed(1)}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Hours</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <GitBranch size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{totalCommits}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Commits</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Flame size={20} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{currentStreak}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Day Streak</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Trophy size={20} style={{ color: '#f39c12', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{longestStreak}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best Streak</div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} />
          Activity (Last 30 Days)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '4px' }}>
          {activityDays.map(date => (
            <div
              key={date}
              style={{
                aspectRatio: '1',
                background: activityColors[getActivityLevel(date)],
                borderRadius: '2px',
                cursor: 'pointer',
              }}
              title={`${date}: ${sessions.filter(s => s.date === date).reduce((acc, s) => acc + s.duration, 0)} minutes`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Less</span>
          {activityColors.slice(1).map((color, i) => (
            <div key={i} style={{ width: '12px', height: '12px', background: color, borderRadius: '2px' }} />
          ))}
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>

      {/* Languages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Languages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {languageStats.map(lang => (
              <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: lang.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: 'white' }}>
                  {lang.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lang.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(lang.minutes / 60).toFixed(1)}h</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(lang.minutes / languageStats[0].minutes) * 100}%`, height: '100%', background: lang.color, borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Projects</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {projectStats.map((project, i) => (
              <div key={project.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `hsl(${(i * 60) % 360}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={12} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{project.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{project.hours.toFixed(1)}h</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${(project.hours / projectStats[0].hours) * 100}%`, height: '100%', background: `hsl(${(i * 60) % 360}, 70%, 50%)`, borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{project.commits} commits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Recent Sessions</h3>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-gold)',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
            }}
          >
            <Plus size={14} />
            Log Session
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sessions.slice(0, 5).map(session => {
            const lang = languages.find(l => l.name === session.language);
            return (
              <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: lang?.color || '#95a5a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                  {lang?.icon || '??'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{session.project}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{session.date} • {session.language}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{session.duration} min</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{session.commits} commits</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
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
          onClick={() => setShowAdd(false)}
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
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Log Coding Session
            </h3>

            <input
              type="text"
              placeholder="Project name"
              value={newSession.project || ''}
              onChange={(e) => setNewSession({ ...newSession, project: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            />

            <select
              value={newSession.language}
              onChange={(e) => setNewSession({ ...newSession, language: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {languages.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Minutes"
                value={newSession.duration || ''}
                onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <input
                type="number"
                placeholder="Commits"
                value={newSession.commits || ''}
                onChange={(e) => setNewSession({ ...newSession, commits: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <input
              type="date"
              value={newSession.date}
              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addSession}
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
                Log Session
              </button>
              <button
                onClick={() => setShowAdd(false)}
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
