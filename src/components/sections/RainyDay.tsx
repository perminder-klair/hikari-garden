import { useState, useEffect, useRef, useCallback } from 'react';
import { CloudRain, Wind, Droplets, Music, Volume2, Play, Pause, Heart } from 'lucide-react';
import styles from './RainyDay.module.css';

interface RainSession {
  id: string;
  date: string;
  duration: number;
  intensity: 'light' | 'moderate' | 'heavy' | 'storm';
  mood: string;
  notes: string;
}

const rainIntensities = [
  { key: 'light', label: 'Gentle Drizzle', icon: Droplets, drops: 20, speed: 3 },
  { key: 'moderate', label: 'Steady Rain', icon: CloudRain, drops: 50, speed: 2 },
  { key: 'heavy', label: 'Downpour', icon: CloudRain, drops: 100, speed: 1 },
  { key: 'storm', label: 'Thunderstorm', icon: Wind, drops: 150, speed: 0.5 },
];

const rainyDayMoods = [
  'Cozy & Content',
  'Melancholic',
  'Peaceful',
  'Reflective',
  'Energized',
  'Sleepy',
  'Creative',
  'Nostalgic',
];

export default function RainyDay() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'heavy' | 'storm'>('moderate');
  const [volume, setVolume] = useState(50);
  const [currentMood, setCurrentMood] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [sessions, setSessions] = useState<RainSession[]>(() => {
    const saved = localStorage.getItem('rainyDay_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentIntensity = rainIntensities.find(r => r.key === intensity)!;

  // Rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Drop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }

    const drops: Drop[] = [];
    const dropCount = currentIntensity.drops;

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 2 + currentIntensity.speed,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rain drops
      ctx.strokeStyle = `rgba(174, 194, 224, ${volume / 100})`;
      ctx.lineWidth = 1;

      drops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.globalAlpha = drop.opacity * (volume / 100);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, volume, currentIntensity]);

  // Session timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSessionTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveSession = () => {
    const newSession: RainSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: sessionTime,
      intensity,
      mood: currentMood,
      notes: sessionNotes,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem('rainyDay_sessions', JSON.stringify(updated));
    setSessionTime(0);
    setSessionNotes('');
    setShowSaveDialog(false);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying && sessionTime > 60) {
      setShowSaveDialog(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const totalRainTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const favoriteIntensity = sessions.length > 0
    ? sessions.reduce((acc, s) => {
        acc[s.intensity] = (acc[s.intensity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  const topIntensity = Object.entries(favoriteIntensity).sort((a, b) => b[1] - a[1])[0]?.[0] || 'moderate';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CloudRain className={styles.icon} />
        <h2>Rainy Day</h2>
        <p>Find peace in the rhythm of rain</p>
      </div>

      <div className={styles.mainContent}>
        {/* Rain Visualizer */}
        <div className={styles.visualizer}>
          <canvas ref={canvasRef} className={styles.rainCanvas} />
          <div className={styles.overlay}>
            <button
              className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <div className={styles.sessionTime}>{formatTime(sessionTime)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.intensitySelector}>
            <label>Intensity</label>
            <div className={styles.intensityButtons}>
              {rainIntensities.map((rain) => (
                <button
                  key={rain.key}
                  className={`${styles.intensityBtn} ${intensity === rain.key ? styles.active : ''}`}
                  onClick={() => setIntensity(rain.key as any)}
                >
                  <rain.icon size={18} />
                  <span>{rain.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.volumeControl}>
            <Volume2 size={18} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles.volumeSlider}
            />
            <span>{volume}%</span>
          </div>

          <div className={styles.moodSelector}>
            <label>How does the rain make you feel?</label>
            <div className={styles.moodGrid}>
              {rainyDayMoods.map((mood) => (
                <button
                  key={mood}
                  className={`${styles.moodBtn} ${currentMood === mood ? styles.active : ''}`}
                  onClick={() => setCurrentMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <Music size={18} />
          <span>{sessions.length} sessions</span>
        </div>
        <div className={styles.stat}>
          <CloudRain size={18} />
          <span>{formatTime(totalRainTime)} total</span>
        </div>
        <div className={styles.stat}>
          <Heart size={18} />
          <span>Favorite: {rainIntensities.find(r => r.key === topIntensity)?.label}</span>
        </div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className={styles.sessionsList}>
          <h3>Recent Rain Sessions</h3>
          <div className={styles.sessionCards}>
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className={styles.sessionCard}>
                <div className={styles.sessionHeader}>
                  <span className={styles.sessionDate}>
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className={`${styles.sessionIntensity} ${styles[session.intensity]}`}>
                    {rainIntensities.find(r => r.key === session.intensity)?.label}
                  </span>
                </div>
                <div className={styles.sessionDetails}>
                  <span className={styles.sessionDuration}>{formatTime(session.duration)}</span>
                  {session.mood && <span className={styles.sessionMood}>{session.mood}</span>}
                </div>
                {session.notes && (
                  <p className={styles.sessionNotes}>{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className={styles.dialogOverlay} onClick={() => setShowSaveDialog(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>Save Rain Session?</h3>
            <p>You've been listening for {formatTime(sessionTime)}</p>
            <textarea
              placeholder="How was your rainy day experience? (optional)"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className={styles.notesInput}
              rows={3}
            />
            <div className={styles.dialogButtons}>
              <button className={styles.discardBtn} onClick={() => {
                setSessionTime(0);
                setSessionNotes('');
                setShowSaveDialog(false);
                setIsPlaying(false);
              }}>
                Discard
              </button>
              <button className={styles.saveBtn} onClick={handleSaveSession}>
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
