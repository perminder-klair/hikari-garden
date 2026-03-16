import { useState, useEffect, useRef } from 'react';
import { Bell, Wind, Volume2, VolumeX } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

const breathingPatterns = [
  { name: '4-7-8 Relax', inhale: 4, hold: 7, exhale: 8, description: 'Calm the nervous system' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, hold2: 4, description: 'Focus and clarity' },
  { name: 'Coherent', inhale: 5, exhale: 5, description: 'Balance and calm' },
  { name: 'Energizing', inhale: 4, exhale: 2, description: 'Quick energy boost' },
];

export default function MeditationSpace() {
  const [isActive, setIsActive] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale' | 'hold2'>('idle');
  const [countdown, setCountdown] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const { revealRef } = useGarden();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    revealRef.current?.('.meditation-section');
  }, [revealRef]);

  const pattern = breathingPatterns[selectedPattern];

  const playBell = () => {
    if (!soundEnabled) return;
    // Create a simple bell sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 528; // Love frequency
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  const runBreathingCycle = async () => {
    if (!isActive) return;
    
    // Inhale
    setPhase('inhale');
    setCountdown(pattern.inhale);
    playBell();
    
    await new Promise(resolve => setTimeout(resolve, pattern.inhale * 1000));
    if (!isActive) return;
    
    // Hold (if exists)
    if ('hold' in pattern && pattern.hold) {
      setPhase('hold');
      setCountdown(pattern.hold);
      await new Promise(resolve => setTimeout(resolve, pattern.hold * 1000));
      if (!isActive) return;
    }
    
    // Exhale
    setPhase('exhale');
    setCountdown(pattern.exhale);
    await new Promise(resolve => setTimeout(resolve, pattern.exhale * 1000));
    if (!isActive) return;
    
    // Hold2 (for box breathing)
    if ('hold2' in pattern && pattern.hold2) {
      setPhase('hold2');
      setCountdown(pattern.hold2);
      await new Promise(resolve => setTimeout(resolve, pattern.hold2 * 1000));
      if (!isActive) return;
    }
    
    // Repeat
    runBreathingCycle();
  };

  const toggleMeditation = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('idle');
      setCountdown(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    } else {
      setIsActive(true);
      setSessionTime(0);
      runBreathingCycle();
      sessionIntervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleStyle = () => {
    const baseScale = 1;
    let scale = baseScale;
    let opacity = 0.3;
    
    switch (phase) {
      case 'inhale':
        scale = 1.5;
        opacity = 0.6;
        break;
      case 'hold':
      case 'hold2':
        scale = 1.5;
        opacity = 0.8;
        break;
      case 'exhale':
        scale = baseScale;
        opacity = 0.3;
        break;
    }
    
    return {
      transform: `scale(${scale})`,
      opacity,
      transition: phase === 'idle' ? 'all 0.5s ease' : `all ${pattern.inhale}s ease`,
    };
  };

  return (
    <section className="meditation-section" id="meditation" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Stillness
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Meditation Space
        </h2>
      </div>

      {/* Breathing Visualizer */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '3rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        minHeight: '400px',
        justifyContent: 'center',
      }}>
        {/* Breathing Circle */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '2px solid var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          ...getCircleStyle(),
        }}>
          <div style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
            opacity: 0.2,
          }} />
          
          {/* Phase Text */}
          <div style={{
            position: 'absolute',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem',
              color: 'var(--accent-gold)',
              textTransform: 'capitalize',
              letterSpacing: '0.2em',
            }}>
              {phase === 'idle' ? 'Ready' : phase}
            </span>
            {countdown > 0 && (
              <div style={{
                fontSize: '2.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'Cormorant Garamond, serif',
                marginTop: '0.5rem',
              }}>
                {countdown}
              </div>
            )}
          </div>
        </div>

        {/* Session Timer */}
        {isActive && (
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}>
            {formatTime(sessionTime)}
          </div>
        )}

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: soundEnabled ? 'var(--accent-gold)' : 'var(--text-muted)',
          }}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Controls */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={toggleMeditation}
            style={{
              padding: '1rem 2rem',
              background: isActive ? 'transparent' : 'var(--accent-gold)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '4px',
              color: isActive ? 'var(--accent-gold)' : 'var(--bg-primary)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Bell size={18} />
            {isActive ? 'End Session' : 'Begin'}
          </button>
        </div>
      </div>

      {/* Pattern Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {breathingPatterns.map((p, idx) => (
          <button
            key={idx}
            onClick={() => !isActive && setSelectedPattern(idx)}
            disabled={isActive}
            style={{
              background: selectedPattern === idx ? 'rgba(244, 208, 63, 0.1)' : 'var(--bg-secondary)',
              border: `1px solid ${selectedPattern === idx ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'left',
              cursor: isActive ? 'not-allowed' : 'pointer',
              opacity: isActive ? 0.5 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Wind size={16} style={{ color: 'var(--accent-gold)' }} />
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {p.name}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {p.description}
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
              {p.inhale}-{p.hold || 0}-{p.exhale}-{p.hold2 || 0}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
