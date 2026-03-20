import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Wind, Waves, CloudRain, Bird, Music } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface SoundChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  emoji: string;
  volume: number;
  isPlaying: boolean;
  color: string;
}

const initialSounds: SoundChannel[] = [
  { id: 'rain', name: 'Gentle Rain', icon: <CloudRain size={18} />, emoji: '🌧️', volume: 0, isPlaying: false, color: '#60a5fa' },
  { id: 'waves', name: 'Ocean Waves', icon: <Waves size={18} />, emoji: '🌊', volume: 0, isPlaying: false, color: '#34d399' },
  { id: 'wind', name: 'Forest Wind', icon: <Wind size={18} />, emoji: '🍃', volume: 0, isPlaying: false, color: '#a78bfa' },
  { id: 'birds', name: 'Morning Birds', icon: <Bird size={18} />, emoji: '🐦', volume: 0, isPlaying: false, color: '#fbbf24' },
  { id: 'lofi', name: 'Lo-Fi Beats', icon: <Music size={18} />, emoji: '🎵', volume: 0, isPlaying: false, color: '#f472b6' },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function SoundScape() {
  const [sounds, setSounds] = useState<SoundChannel[]>(initialSounds);
  const [masterVolume, setMasterVolume] = useState(50);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [activeMix, setActiveMix] = useState<string | null>(null);
  const [waveformBars] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      height: seededRandom(i) * 40 + 10,
      animationDuration: 0.5 + seededRandom(i + 100) * 0.5,
    }))
  );
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.soundscape-section');
  }, [revealRef]);

  const toggleSound = (id: string) => {
    setSounds(sounds.map(s => 
      s.id === id ? { ...s, isPlaying: !s.isPlaying, volume: s.isPlaying ? 0 : 30 } : s
    ));
  };

  const adjustVolume = (id: string, volume: number) => {
    setSounds(sounds.map(s => 
      s.id === id ? { ...s, volume, isPlaying: volume > 0 } : s
    ));
  };

  const activeSounds = sounds.filter(s => s.isPlaying).length;
  const totalVolume = sounds.reduce((acc, s) => acc + s.volume, 0);

  const presets = [
    { name: 'Deep Focus', mix: { rain: 40, lofi: 25 } },
    { name: 'Nature Walk', mix: { wind: 35, birds: 30 } },
    { name: 'Ocean Meditation', mix: { waves: 45 } },
    { name: 'Rainy Day', mix: { rain: 50, lofi: 20 } },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setActiveMix(preset.name);
    setSounds(sounds.map(s => ({
      ...s,
      volume: preset.mix[s.id as keyof typeof preset.mix] || 0,
      isPlaying: s.id in preset.mix,
    })));
  };

  const stopAll = () => {
    setSounds(sounds.map(s => ({ ...s, volume: 0, isPlaying: false })));
    setActiveMix(null);
  };

  return (
    <section className="soundscape-section" id="soundscape" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Auditory Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          SoundScape
        </h2>
      </div>

      {/* Master Controls */}
      <div style={{ 
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '8px', 
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setIsMasterMuted(!isMasterMuted)}
            style={{
              background: 'transparent',
              border: 'none',
              color: isMasterMuted ? 'var(--text-muted)' : 'var(--accent-gold)',
              cursor: 'pointer',
            }}
          >
            {isMasterMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Master Volume</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeSounds} active channels</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '300px' }}>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent-gold)' }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '40px' }}>{masterVolume}%</span>
        </div>

        <button
          onClick={stopAll}
          style={{
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Stop All
        </button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            style={{
              padding: '0.5rem 1rem',
              background: activeMix === preset.name ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${activeMix === preset.name ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: activeMix === preset.name ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Sound Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {sounds.map(sound => (
          <div
            key={sound.id}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${sound.isPlaying ? sound.color : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{sound.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sound.name}</div>
                  <div style={{ fontSize: '0.7rem', color: sound.isPlaying ? sound.color : 'var(--text-muted)' }}>
                    {sound.isPlaying ? 'Playing' : 'Paused'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleSound(sound.id)}
                style={{
                  background: sound.isPlaying ? sound.color : 'transparent',
                  border: `1px solid ${sound.color}`,
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: sound.isPlaying ? 'var(--bg-primary)' : sound.color,
                  cursor: 'pointer',
                }}
              >
                {sound.isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <VolumeX size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="range"
                min="0"
                max="100"
                value={sound.volume}
                onChange={(e) => adjustVolume(sound.id, Number(e.target.value))}
                style={{ flex: 1, accentColor: sound.color }}
              />
              <Volume2 size={14} style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Visual indicator */}
            <div style={{ 
              marginTop: '1rem', 
              height: '3px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${sound.volume}%`,
                height: '100%',
                background: sound.color,
                borderRadius: '2px',
                transition: 'width 0.3s ease',
                opacity: sound.isPlaying ? 1 : 0.3,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Visual Waveform */}
      <div style={{
        marginTop: '2rem',
        height: '60px',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        padding: '0 1rem',
        overflow: 'hidden',
      }}>
        {waveformBars.map((bar) => {
          const isActive = sounds.some(s => s.isPlaying);
          const height = isActive ? bar.height : 4;
          return (
            <div
              key={bar.id}
              style={{
                width: '4px',
                height: `${height}px`,
                background: isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                animation: isActive ? `pulse ${bar.animationDuration}s ease-in-out infinite alternate` : 'none',
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
