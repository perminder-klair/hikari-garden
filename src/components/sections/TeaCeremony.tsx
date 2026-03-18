import { useState, useEffect, useRef } from 'react';
import styles from './TeaCeremony.module.css';

interface Tea {
  id: string;
  name: string;
  type: 'green' | 'black' | 'oolong' | 'white' | 'herbal' | 'puerh';
  origin: string;
  temp: number;
  time: number;
  description: string;
  benefits: string[];
  color: string;
}

const teas: Tea[] = [
  {
    id: '1',
    name: 'Sencha',
    type: 'green',
    origin: 'Japan',
    temp: 70,
    time: 120,
    description: 'Steamed Japanese green tea with grassy, umami notes',
    benefits: ['Antioxidants', 'Calm energy', 'Focus'],
    color: '#7cb342',
  },
  {
    id: '2',
    name: 'Earl Grey',
    type: 'black',
    origin: 'China/UK',
    temp: 95,
    time: 180,
    description: 'Black tea scented with bergamot oil',
    benefits: ['Digestion', 'Mental clarity', 'Comfort'],
    color: '#5d4037',
  },
  {
    id: '3',
    name: 'Tie Guan Yin',
    type: 'oolong',
    origin: 'China',
    temp: 90,
    time: 180,
    description: 'Iron Goddess of Mercy - floral, creamy oolong',
    benefits: ['Metabolism', 'Relaxation', 'Complex flavor'],
    color: '#8d6e63',
  },
  {
    id: '4',
    name: 'Silver Needle',
    type: 'white',
    origin: 'China',
    temp: 80,
    time: 300,
    description: 'Delicate white tea made only from buds',
    benefits: ['Skin health', 'Gentle caffeine', 'Subtle sweetness'],
    color: '#e8e0d5',
  },
  {
    id: '5',
    name: 'Chamomile',
    type: 'herbal',
    origin: 'Egypt',
    temp: 95,
    time: 300,
    description: 'Dried chamomile flowers for relaxation',
    benefits: ['Sleep aid', 'Stress relief', 'Digestion'],
    color: '#f9d71c',
  },
  {
    id: '6',
    name: 'Matcha',
    type: 'green',
    origin: 'Japan',
    temp: 80,
    time: 0,
    description: 'Powdered green tea whisked into suspension',
    benefits: ['L-theanine', 'Sustained energy', 'Meditation'],
    color: '#4a7c59',
  },
];

interface Session {
  id: string;
  teaId: string;
  date: string;
  notes: string;
  rating: number;
}

export default function TeaCeremony() {
  const [selectedTea, setSelectedTea] = useState<Tea | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionRating, setSessionRating] = useState(5);
  const [steamParticles, setSteamParticles] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles(prev => {
        const newParticles = [...prev, Date.now()];
        return newParticles.slice(-8);
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setShowAddSession(true);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setTimerActive(true);
    setShowAddSession(false);
  };

  const stopTimer = () => {
    setTimerActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSession = () => {
    if (!selectedTea) return;
    const newSession: Session = {
      id: Date.now().toString(),
      teaId: selectedTea.id,
      date: new Date().toISOString(),
      notes: sessionNotes,
      rating: sessionRating,
    };
    setSessions(prev => [newSession, ...prev]);
    setSessionNotes('');
    setSessionRating(5);
    setShowAddSession(false);
  };

  const getTeaEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      green: '🍃',
      black: '🍂',
      oolong: '🌿',
      white: '🌸',
      herbal: '🌼',
      puerh: '🪵',
    };
    return emojis[type] || '🍵';
  };

  const getTeaSessions = (teaId: string) => {
    return sessions.filter(s => s.teaId === teaId);
  };

  return (
    <section className={styles.teaCeremony}>
      <div className={styles.steamContainer}>
        {steamParticles.map((id, i) => (
          <div
            key={id}
            className={styles.steam}
            style={{
              left: `${20 + (i % 5) * 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>🍵 Tea Ceremony</h2>
        <p className={styles.subtitle}>Mindful tea brewing for moments of peace</p>
      </div>

      <div className={styles.content}>
        <div className={styles.teaMenu}>
          <h3>Select Your Tea</h3>
          <div className={styles.teaGrid}>
            {teas.map(tea => (
              <button
                key={tea.id}
                className={`${styles.teaCard} ${selectedTea?.id === tea.id ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedTea(tea);
                  stopTimer();
                  setShowAddSession(false);
                }}
                style={{ '--tea-color': tea.color } as React.CSSProperties}
              >
                <span className={styles.teaEmoji}>{getTeaEmoji(tea.type)}</span>
                <div className={styles.teaInfo}>
                  <span className={styles.teaName}>{tea.name}</span>
                  <span className={styles.teaType}>{tea.type} • {tea.origin}</span>
                </div>
                {getTeaSessions(tea.id).length > 0 && (
                  <span className={styles.sessionCount}>{getTeaSessions(tea.id).length} sessions</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedTea && (
          <div className={styles.brewingPanel}>
            <div className={styles.teaDetails}>
              <div className={styles.teaHeader}>
                <span className={styles.detailEmoji}>{getTeaEmoji(selectedTea.type)}</span>
                <div>
                  <h3>{selectedTea.name}</h3>
                  <p className={styles.origin}>{selectedTea.origin}</p>
                </div>
              </div>
              <p className={styles.description}>{selectedTea.description}</p>
              
              <div className={styles.brewingSpecs}>
                <div className={styles.spec}>
                  <span className={styles.specLabel}>Temperature</span>
                  <span className={styles.specValue}>{selectedTea.temp}°C</span>
                </div>
                <div className={styles.spec}>
                  <span className={styles.specLabel}>Time</span>
                  <span className={styles.specValue}>{Math.floor(selectedTea.time / 60)}:{(selectedTea.time % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <div className={styles.benefits}>
                {selectedTea.benefits.map((benefit, i) => (
                  <span key={i} className={styles.benefit}>✦ {benefit}</span>
                ))}
              </div>
            </div>

            <div className={styles.timerSection}>
              {!timerActive && timeLeft === 0 ? (
                <button
                  className={styles.startBtn}
                  onClick={() => startTimer(selectedTea.time)}
                >
                  <span className={styles.btnIcon}>⏱️</span>
                  Start Brewing Timer
                </button>
              ) : (
                <div className={styles.activeTimer}>
                  <div className={styles.timerDisplay}>
                    <span className={styles.timeValue}>{formatTime(timeLeft)}</span>
                    <span className={styles.timeLabel}>{timerActive ? 'Brewing...' : 'Complete!'}</span>
                  </div>
                  <div className={styles.timerProgress}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${((selectedTea.time - timeLeft) / selectedTea.time) * 100}%`,
                        backgroundColor: selectedTea.color,
                      }}
                    />
                  </div>
                  {timerActive && (
                    <button className={styles.stopBtn} onClick={stopTimer}>
                      Stop Timer
                    </button>
                  )}
                </div>
              )}
            </div>

            {showAddSession && (
              <div className={styles.sessionForm}>
                <h4>How was your tea? 🍵</h4>
                <div className={styles.rating}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`${styles.star} ${star <= sessionRating ? styles.filled : ''}`}
                      onClick={() => setSessionRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  className={styles.notesInput}
                  placeholder="Add your tasting notes..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={3}
                />
                <div className={styles.formActions}>
                  <button className={styles.saveBtn} onClick={saveSession}>
                    Save Session
                  </button>
                  <button
                    className={styles.skipBtn}
                    onClick={() => setShowAddSession(false)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {sessions.length > 0 && (
        <div className={styles.sessionHistory}>
          <h3>Recent Sessions ({sessions.length})</h3>
          <div className={styles.sessionList}>
            {sessions.slice(0, 5).map(session => {
              const tea = teas.find(t => t.id === session.teaId);
              return (
                <div key={session.id} className={styles.sessionItem}>
                  <span className={styles.sessionTea}>{getTeaEmoji(tea?.type || '')} {tea?.name}</span>
                  <span className={styles.sessionDate}>
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className={styles.sessionRating}>{'★'.repeat(session.rating)}</span>
                  {session.notes && <span className={styles.sessionNote}>"{session.notes}"</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
