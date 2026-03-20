import { useState, useEffect, useRef } from 'react';
import { Package, Clock, Calendar, Lock, Unlock, Eye, Trash2, Send } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Capsule {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  unlockDate: string;
  isOpened: boolean;
  openedAt?: string;
  mood: string;
}

const initialCapsules: Capsule[] = [
  {
    id: '1',
    title: 'To Future Me',
    content: 'Remember why you started this journey. The late nights, the debugging sessions, the moments of breakthrough. It all matters. Keep building.',
    createdAt: '2026-01-01',
    unlockDate: '2026-06-01',
    isOpened: false,
    mood: 'hopeful',
  },
  {
    id: '2',
    title: 'Project Milestone',
    content: 'Just deployed the first version of the AI agent network. It\'s rough, it\'s buggy, but it\'s alive. Can\'t wait to see where this goes.',
    createdAt: '2025-12-15',
    unlockDate: '2025-12-15',
    isOpened: true,
    openedAt: '2025-12-15',
    mood: 'excited',
  },
];

const moods = [
  { id: 'hopeful', emoji: '🌱', color: '#2ecc71' },
  { id: 'excited', emoji: '⚡', color: '#f4d03f' },
  { id: 'reflective', emoji: '🌙', color: '#9b59b6' },
  { id: 'grateful', emoji: '💛', color: '#f39c12' },
  { id: 'determined', emoji: '🔥', color: '#e74c3c' },
];

export default function TimeCapsule() {
  const [capsules, setCapsules] = useState<Capsule[]>(initialCapsules);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    content: '',
    unlockDate: '',
    mood: 'hopeful',
  });
  const idCounter = useRef(0);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.time-capsule-section');
  }, [revealRef]);

  const now = new Date();
  const lockedCapsules = capsules.filter(c => !c.isOpened && new Date(c.unlockDate) > now);
  const unlockedCapsules = capsules.filter(c => !c.isOpened && new Date(c.unlockDate) <= now);
  const openedCapsules = capsules.filter(c => c.isOpened);

  const createCapsule = () => {
    if (!newCapsule.title.trim() || !newCapsule.content.trim() || !newCapsule.unlockDate) return;

    const capsule: Capsule = {
      id: `${Date.now()}-${idCounter.current++}`,
      title: newCapsule.title,
      content: newCapsule.content,
      createdAt: now.toISOString().split('T')[0],
      unlockDate: newCapsule.unlockDate,
      isOpened: false,
      mood: newCapsule.mood,
    };

    setCapsules([...capsules, capsule]);
    setNewCapsule({ title: '', content: '', unlockDate: '', mood: 'hopeful' });
    setIsCreating(false);
  };

  const openCapsule = (capsule: Capsule) => {
    setCapsules(capsules.map(c => 
      c.id === capsule.id 
        ? { ...c, isOpened: true, openedAt: now.toISOString().split('T')[0] }
        : c
    ));
    setSelectedCapsule({ ...capsule, isOpened: true, openedAt: now.toISOString().split('T')[0] });
  };

  const deleteCapsule = (id: string) => {
    setCapsules(capsules.filter(c => c.id !== id));
    setSelectedCapsule(null);
  };

  const getMoodConfig = (moodId: string) => moods.find(m => m.id === moodId) || moods[0];
  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : 'Today';
  };

  return (
    <section className="time-capsule-section" id="capsule" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Messages Through Time
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Time Capsule
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Package size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{capsules.length}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Capsules</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{lockedCapsules.length}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Locked</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{unlockedCapsules.length}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ready to Open</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{openedCapsules.length}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Opened</span>
        </div>
      </div>

      {/* Create Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Send size={16} />
          Bury New Capsule
        </button>
      </div>

      {/* Create Modal */}
      {isCreating && (
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
          onClick={() => setIsCreating(false)}
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
              Bury a Time Capsule
            </h3>
            
            <input
              type="text"
              placeholder="Title..."
              value={newCapsule.title}
              onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            />
            
            <textarea
              placeholder="Write a message to your future self..."
              value={newCapsule.content}
              onChange={(e) => setNewCapsule({ ...newCapsule, content: e.target.value })}
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                resize: 'vertical',
              }}
            />

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Unlock Date</span>
              <input
                type="date"
                value={newCapsule.unlockDate}
                onChange={(e) => setNewCapsule({ ...newCapsule, unlockDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Mood</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setNewCapsule({ ...newCapsule, mood: mood.id })}
                    style={{
                      padding: '0.5rem 1rem',
                      background: newCapsule.mood === mood.id ? `${mood.color}30` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${newCapsule.mood === mood.id ? mood.color : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '4px',
                      color: newCapsule.mood === mood.id ? mood.color : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    {mood.emoji} {mood.id}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={createCapsule}
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
                Bury Capsule
              </button>
              <button
                onClick={() => setIsCreating(false)}
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

      {/* Capsules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {capsules.map(capsule => {
          const mood = getMoodConfig(capsule.mood);
          const isLocked = !capsule.isOpened && new Date(capsule.unlockDate) > now;
          const isReady = !capsule.isOpened && new Date(capsule.unlockDate) <= now;
          
          return (
            <div
              key={capsule.id}
              onClick={() => isReady ? openCapsule(capsule) : setSelectedCapsule(capsule)}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${isReady ? '#2ecc71' : isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(52, 152, 219, 0.3)'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                if (isReady) e.currentTarget.style.boxShadow = '0 8px 32px rgba(46, 204, 113, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem',
                background: isLocked ? 'rgba(231, 76, 60, 0.1)' : isReady ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)',
                color: isLocked ? '#e74c3c' : isReady ? '#2ecc71' : '#3498db',
                borderRadius: '4px',
              }}>
                {isLocked ? <Lock size={12} /> : isReady ? <Unlock size={12} /> : <Eye size={12} />}
                {isLocked ? 'Locked' : isReady ? 'Ready' : 'Opened'}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{mood.emoji}</span>
              </div>

              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {capsule.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {capsule.isOpened ? capsule.content.substring(0, 100) + '...' : '🔒 This message is sealed until unlock date'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  {isLocked ? `Unlocks ${getDaysUntil(capsule.unlockDate)}` : capsule.isOpened ? `Opened ${capsule.openedAt}` : 'Opened Today'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Modal */}
      {selectedCapsule && (
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
          onClick={() => setSelectedCapsule(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{getMoodConfig(selectedCapsule.mood).emoji}</span>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                    {selectedCapsule.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Buried on {selectedCapsule.createdAt}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteCapsule(selectedCapsule.id)}
                style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                "{selectedCapsule.content}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                {selectedCapsule.isOpened 
                  ? `Opened on ${selectedCapsule.openedAt}` 
                  : `Unlocks on ${selectedCapsule.unlockDate}`}
              </div>
              <button
                onClick={() => setSelectedCapsule(null)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
