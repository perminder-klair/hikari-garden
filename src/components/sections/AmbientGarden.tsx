import { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Volume2, Cloud, Wind, Waves, TreeDeciduous, Bird, CloudRain, Flame, Coffee, VolumeX } from 'lucide-react';
import styles from './AmbientGarden.module.css';

interface Sound {
  id: string;
  name: string;
  icon: React.ReactNode;
  audioUrl?: string;
  frequency?: number;
  volume: number;
  isPlaying: boolean;
}

interface Preset {
  id: string;
  name: string;
  sounds: { id: string; volume: number }[];
  icon: string;
}

// Generate ambient sounds using Web Audio API oscillators
const createAmbientSound = (
  audioContext: AudioContext,
  type: OscillatorType,
  baseFreq: number,
  gainValue: number
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, audioContext.currentTime);
  filter.Q.setValueAtTime(1, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  
  // LFO for subtle modulation
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.2, audioContext.currentTime);
  lfoGain.gain.setValueAtTime(20, audioContext.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  lfo.start();
  
  return { oscillator, gainNode, filter, lfo, lfoGain };
};

export default function AmbientGarden() {
  const [sounds, setSounds] = useState<Sound[]>([
    { id: 'rain', name: 'Rain', icon: <CloudRain size={20} />, volume: 0, isPlaying: false },
    { id: 'forest', name: 'Forest', icon: <TreeDeciduous size={20} />, volume: 0, isPlaying: false },
    { id: 'wind', name: 'Wind', icon: <Wind size={20} />, volume: 0, isPlaying: false },
    { id: 'waves', name: 'Ocean', icon: <Waves size={20} />, volume: 0, isPlaying: false },
    { id: 'birds', name: 'Birds', icon: <Bird size={20} />, volume: 0, isPlaying: false },
    { id: 'fire', name: 'Fireplace', icon: <Flame size={20} />, volume: 0, isPlaying: false },
    { id: 'thunder', name: 'Thunder', icon: <Cloud size={20} />, volume: 0, isPlaying: false },
    { id: 'cafe', name: 'Café', icon: <Coffee size={20} />, volume: 0, isPlaying: false },
  ]);
  
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [isGloballyPlaying, setIsGloballyPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<Map<string, { oscillator: OscillatorNode; gainNode: GainNode; filter: BiquadFilterNode; lfo: OscillatorNode; lfoGain: GainNode }>>(new Map());
  const noiseNodesRef = useRef<Map<string, { source: AudioBufferSourceNode; gainNode: GainNode; filter: BiquadFilterNode }>>(new Map());
  
  const presets: Preset[] = [
    { id: 'rainy-day', name: 'Rainy Day', sounds: [{ id: 'rain', volume: 0.8 }, { id: 'thunder', volume: 0.3 }], icon: '🌧️' },
    { id: 'forest-morning', name: 'Forest Morning', sounds: [{ id: 'forest', volume: 0.7 }, { id: 'birds', volume: 0.4 }, { id: 'wind', volume: 0.2 }], icon: '🌲' },
    { id: 'beach', name: 'Beach Vibes', sounds: [{ id: 'waves', volume: 0.8 }, { id: 'wind', volume: 0.3 }, { id: 'birds', volume: 0.2 }], icon: '🏖️' },
    { id: 'cozy', name: 'Cozy Night', sounds: [{ id: 'fire', volume: 0.6 }, { id: 'rain', volume: 0.3 }], icon: '🔥' },
    { id: 'focus', name: 'Deep Focus', sounds: [{ id: 'cafe', volume: 0.4 }, { id: 'rain', volume: 0.2 }], icon: '☕' },
    { id: 'storm', name: 'Thunderstorm', sounds: [{ id: 'rain', volume: 0.9 }, { id: 'thunder', volume: 0.6 }, { id: 'wind', volume: 0.5 }], icon: '⛈️' },
  ];

  // Initialize audio context
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
    };
    
    // Try to resume on user interaction
    const handleInteraction = () => {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };
    
    document.addEventListener('click', handleInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  // Create noise buffer for rain/wind/ocean sounds
  const createNoiseBuffer = useCallback((audioContext: AudioContext, type: 'rain' | 'wind' | 'waves' | 'cafe') => {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'rain') {
        // Pink-ish noise for rain
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (type === 'wind') {
        // Low frequency modulated noise
        output[i] = white * Math.sin(i / 5000) * 0.5;
      } else if (type === 'waves') {
        // Rhythmic low frequency
        output[i] = white * (0.5 + 0.5 * Math.sin(i / 10000));
      } else {
        // White noise with filter for cafe murmur
        output[i] = white * 0.3;
      }
    }
    
    return noiseBuffer;
  }, []);

  const startSound = useCallback((soundId: string) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const sound = sounds.find(s => s.id === soundId);
    if (!sound || sound.volume === 0) return;
    
    // Stop existing
    stopSound(soundId);
    
    if (['rain', 'wind', 'waves', 'cafe'].includes(soundId)) {
      // Create noise-based sound
      const noiseBuffer = createNoiseBuffer(ctx, soundId as 'rain' | 'wind' | 'waves' | 'cafe');
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      if (soundId === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
        filter.Q.setValueAtTime(0.5, ctx.currentTime);
      } else if (soundId === 'wind') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);
      } else if (soundId === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500, ctx.currentTime);
        filter.Q.setValueAtTime(0.3, ctx.currentTime);
      }
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(sound.volume * masterVolume, ctx.currentTime + 0.5);
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();
      
      noiseNodesRef.current.set(soundId, { source, gainNode, filter });
    } else {
      // Create oscillator-based sound
      let type: OscillatorType = 'sine';
      let freq = 100;
      
      switch (soundId) {
        case 'forest':
          type = 'sine';
          freq = 200;
          break;
        case 'birds':
          type = 'triangle';
          freq = 2000;
          break;
        case 'fire':
          type = 'sawtooth';
          freq = 80;
          break;
        case 'thunder':
          type = 'sine';
          freq = 50;
          break;
      }
      
      const nodes = createAmbientSound(ctx, type, freq, sound.volume * masterVolume);
      nodes.gainNode.gain.linearRampToValueAtTime(sound.volume * masterVolume, ctx.currentTime + 0.5);
      audioNodesRef.current.set(soundId, nodes);
    }
  }, [sounds, masterVolume, createNoiseBuffer]);

  const stopSound = useCallback((soundId: string) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    // Stop noise-based sound
    const noiseNode = noiseNodesRef.current.get(soundId);
    if (noiseNode) {
      noiseNode.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      setTimeout(() => {
        try { noiseNode.source.stop(); } catch {}
      }, 300);
      noiseNodesRef.current.delete(soundId);
    }
    
    // Stop oscillator-based sound
    const nodes = audioNodesRef.current.get(soundId);
    if (nodes) {
      nodes.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      setTimeout(() => {
        try { nodes.oscillator.stop(); nodes.lfo.stop(); } catch {}
      }, 300);
      audioNodesRef.current.delete(soundId);
    }
  }, []);

  const updateVolume = useCallback((soundId: string, volume: number) => {
    setSounds(prev => prev.map(s => 
      s.id === soundId ? { ...s, volume, isPlaying: volume > 0 } : s
    ));
    
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    const noiseNode = noiseNodesRef.current.get(soundId);
    if (noiseNode) {
      noiseNode.gainNode.gain.linearRampToValueAtTime(volume * masterVolume, ctx.currentTime + 0.1);
    }
    
    const nodes = audioNodesRef.current.get(soundId);
    if (nodes) {
      nodes.gainNode.gain.linearRampToValueAtTime(volume * masterVolume, ctx.currentTime + 0.1);
    }
  }, [masterVolume]);

  const toggleGlobalPlay = useCallback(() => {
    if (isGloballyPlaying) {
      sounds.forEach(s => {
        if (s.volume > 0) stopSound(s.id);
      });
      setIsGloballyPlaying(false);
    } else {
      sounds.forEach(s => {
        if (s.volume > 0) startSound(s.id);
      });
      setIsGloballyPlaying(true);
    }
  }, [isGloballyPlaying, sounds, startSound, stopSound]);

  const applyPreset = useCallback((preset: Preset) => {
    // Stop all sounds first
    sounds.forEach(s => stopSound(s.id));
    
    // Apply preset volumes
    const updatedSounds = sounds.map(s => {
      const presetSound = preset.sounds.find(ps => ps.id === s.id);
      return {
        ...s,
        volume: presetSound?.volume || 0,
        isPlaying: !!presetSound,
      };
    });
    setSounds(updatedSounds);
    
    // Start sounds with volume > 0
    preset.sounds.forEach(ps => {
      setTimeout(() => startSound(ps.id), 100);
    });
    
    setIsGloballyPlaying(true);
  }, [sounds, startSound, stopSound]);

  const toggleSound = useCallback((soundId: string) => {
    const sound = sounds.find(s => s.id === soundId);
    if (!sound) return;
    
    if (sound.isPlaying) {
      stopSound(soundId);
      setSounds(prev => prev.map(s => 
        s.id === soundId ? { ...s, isPlaying: false } : s
      ));
    } else if (sound.volume > 0) {
      startSound(soundId);
      setSounds(prev => prev.map(s => 
        s.id === soundId ? { ...s, isPlaying: true } : s
      ));
    }
  }, [sounds, startSound, stopSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioNodesRef.current.forEach((nodes, id) => {
        try { nodes.oscillator.stop(); nodes.lfo.stop(); } catch {}
      });
      noiseNodesRef.current.forEach((node, id) => {
        try { node.source.stop(); } catch {}
      });
    };
  }, []);

  const activeSounds = sounds.filter(s => s.isPlaying).length;

  return (
    <section className={styles.ambientGarden}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Music className={styles.icon} size={28} />
          Ambient Garden
        </h2>
        <p className={styles.subtitle}>
          Mix ambient sounds to create your perfect atmosphere
        </p>
      </header>

      <div className={styles.masterControl}>
        <div className={styles.masterVolume}>
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className={styles.masterSlider}
          />
          <span>{Math.round(masterVolume * 100)}%</span>
        </div>
        
        <button 
          className={`${styles.playAllButton} ${isGloballyPlaying ? styles.playing : ''}`}
          onClick={toggleGlobalPlay}
        >
          {isGloballyPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
          {isGloballyPlaying ? 'Pause All' : 'Play All'}
        </button>
      </div>

      <div className={styles.presets}>
        <h3>Presets</h3>
        <div className={styles.presetGrid}>
          {presets.map(preset => (
            <button
              key={preset.id}
              className={styles.presetButton}
              onClick={() => applyPreset(preset)}
            >
              <span className={styles.presetIcon}>{preset.icon}</span>
              <span className={styles.presetName}>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.soundGrid}>
        {sounds.map(sound => (
          <div 
            key={sound.id} 
            className={`${styles.soundCard} ${sound.isPlaying ? styles.active : ''}`}
          >
            <button 
              className={styles.soundToggle}
              onClick={() => toggleSound(sound.id)}
            >
              <span className={styles.soundIcon}>{sound.icon}</span>
              <span className={styles.soundName}>{sound.name}</span>
              {sound.isPlaying && <span className={styles.playingIndicator} />}
            </button>
            
            <div className={styles.volumeControl}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sound.volume}
                onChange={(e) => updateVolume(sound.id, Number(e.target.value))}
                className={styles.volumeSlider}
                style={{ '--fill-percent': `${sound.volume * 100}%` } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.status}>
        <span>{activeSounds} sound{activeSounds !== 1 ? 's' : ''} active</span>
        <span className={styles.statusDivider}>|</span>
        <span>Click sounds to toggle, adjust volume for each</span>
      </div>
    </section>
  );
}
