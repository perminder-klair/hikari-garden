import { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Volume2, VolumeX, Music, Save, Trash2 } from 'lucide-react';
import styles from './WindChime.module.css';

interface ChimeNote {
  id: string;
  note: string;
  frequency: number;
  color: string;
  length: number;
}

interface SavedMelody {
  id: string;
  name: string;
  notes: string[];
  createdAt: Date;
}

const chimeNotes: ChimeNote[] = [
  { id: 'c4', note: 'C4', frequency: 261.63, color: '#FF6B6B', length: 120 },
  { id: 'd4', note: 'D4', frequency: 293.66, color: '#FDCB6E', length: 110 },
  { id: 'e4', note: 'E4', frequency: 329.63, color: '#FFEAA7', length: 100 },
  { id: 'g4', note: 'G4', frequency: 392.00, color: '#55EFC4', length: 85 },
  { id: 'a4', note: 'A4', frequency: 440.00, color: '#74B9FF', length: 75 },
  { id: 'c5', note: 'C5', frequency: 523.25, color: '#A29BFE', length: 60 },
];

export function WindChime() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [windStrength, setWindStrength] = useState(50);
  const [savedMelodies, setSavedMelodies] = useState<SavedMelody[]>([]);
  const [melodyName, setMelodyName] = useState('');
  const [currentMelody, setCurrentMelody] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const windIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved melodies
  useEffect(() => {
    const saved = localStorage.getItem('windchime-melodies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedMelodies(parsed.map((m: SavedMelody) => ({
          ...m,
          createdAt: new Date(m.createdAt)
        })));
      } catch {
        console.error('Failed to load melodies');
      }
    }
  }, []);

  // Save melodies
  useEffect(() => {
    localStorage.setItem('windchime-melodies', JSON.stringify(savedMelodies));
  }, [savedMelodies]);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((note: ChimeNote) => {
    const ctx = initAudio();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = note.frequency;
    oscillator.type = 'sine';

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2);

    oscillator.start(now);
    oscillator.stop(now + 2);

    // Visual feedback
    setActiveNotes(prev => new Set([...prev, note.id]));
    setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev);
        next.delete(note.id);
        return next;
      });
    }, 500);

    // Record if recording
    if (isRecording) {
      setCurrentMelody(prev => [...prev, note.id]);
    }
  }, [initAudio, isRecording]);

  const startWind = useCallback(() => {
    if (windIntervalRef.current) return;
    
    setIsPlaying(true);
    const interval = Math.max(500, 3000 - windStrength * 25);
    
    windIntervalRef.current = setInterval(() => {
      const numNotes = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...chimeNotes].sort(() => Math.random() - 0.5);
      
      shuffled.slice(0, numNotes).forEach((note, i) => {
        setTimeout(() => playNote(note), i * 150);
      });
    }, interval);
  }, [windStrength, playNote]);

  const stopWind = useCallback(() => {
    setIsPlaying(false);
    if (windIntervalRef.current) {
      clearInterval(windIntervalRef.current);
      windIntervalRef.current = null;
    }
  }, []);

  const toggleWind = () => {
    if (isPlaying) {
      stopWind();
    } else {
      startWind();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setCurrentMelody([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const saveMelody = () => {
    if (!melodyName.trim() || currentMelody.length === 0) return;

    const newMelody: SavedMelody = {
      id: Date.now().toString(),
      name: melodyName.trim(),
      notes: currentMelody,
      createdAt: new Date(),
    };

    setSavedMelodies(prev => [newMelody, ...prev]);
    setMelodyName('');
    setCurrentMelody([]);
    setIsRecording(false);
  };

  const playMelody = (melody: SavedMelody) => {
    const ctx = initAudio();
    if (!ctx) return;

    melody.notes.forEach((noteId, i) => {
      const note = chimeNotes.find(n => n.id === noteId);
      if (note) {
        setTimeout(() => playNote(note), i * 400);
      }
    });
  };

  const deleteMelody = (id: string) => {
    setSavedMelodies(prev => prev.filter(m => m.id !== id));
  };

  useEffect(() => {
    return () => {
      if (windIntervalRef.current) {
        clearInterval(windIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Wind className={styles.icon} />
          <h2 className={styles.title}>Wind Chime</h2>
        </div>
        <p className={styles.subtitle}>Create melodies with the breeze</p>
      </div>

      <div className={styles.content}>
        {/* Chime Visual */}
        <div className={styles.chimeContainer}>
          <div className={styles.chimeTop}>
            <div className={styles.chimeRing} />
          </div>
          
          <div className={styles.chimes}>
            {chimeNotes.map((note) => (
              <button
                key={note.id}
                className={`${styles.chime} ${activeNotes.has(note.id) ? styles.active : ''}`}
                style={{ 
                  '--chime-color': note.color,
                  '--chime-length': `${note.length}px`
                } as React.CSSProperties}
                onClick={() => playNote(note)}
                aria-label={`Play ${note.note}`}
              >
                <div className={styles.chimeString} />
                <div className={styles.chimeTube}>
                  <span className={styles.chimeNote}>{note.note}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Wind Sail */}
          <div className={`${styles.sail} ${isPlaying ? styles.swaying : ''}`}>
            <div className={styles.sailShape} />
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.windControl}>
            <label className={styles.label}>Wind Strength</label>
            <input
              type="range"
              min="10"
              max="100"
              value={windStrength}
              onChange={(e) => setWindStrength(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.windLabels}>
              <span>Gentle</span>
              <span>Strong</span>
            </div>
          </div>

          <button
            className={`${styles.windButton} ${isPlaying ? styles.active : ''}`}
            onClick={toggleWind}
          >
            {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isPlaying ? 'Stop Wind' : 'Start Wind'}
          </button>
        </div>

        {/* Recording Section */}
        <div className={styles.recordingSection}>
          <h3 className={styles.sectionTitle}>Melody Recorder</h3>
          
          <div className={styles.recorderControls}>
            {!isRecording ? (
              <button
                className={styles.recordButton}
                onClick={startRecording}
                disabled={isPlaying}
              >
                <div className={styles.recordDot} />
                Record Melody
              </button>
            ) : (
              <div className={styles.recordingActive}>
                <div className={styles.recordingIndicator}>
                  <div className={styles.recordingDot} />
                  Recording...
                </div>
                <span className={styles.noteCount}>{currentMelody.length} notes</span>
                <button className={styles.stopButton} onClick={stopRecording}>
                  Stop
                </button>
              </div>
            )}
          </div>

          {currentMelody.length > 0 && !isRecording && (
            <div className={styles.saveForm}>
              <input
                type="text"
                className={styles.nameInput}
                placeholder="Name your melody..."
                value={melodyName}
                onChange={(e) => setMelodyName(e.target.value)}
              />
              <button
                className={styles.saveButton}
                onClick={saveMelody}
                disabled={!melodyName.trim()}
              >
                <Save size={16} />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Saved Melodies */}
        <div className={styles.melodiesSection}>
          <h3 className={styles.sectionTitle}>Saved Melodies</h3>
          
          {savedMelodies.length === 0 ? (
            <div className={styles.emptyState}>
              <Music className={styles.emptyIcon} />
              <p>No melodies saved yet</p>
              <p className={styles.emptyHint}>Record and save your first melody!</p>
            </div>
          ) : (
            <div className={styles.melodyList}>
              {savedMelodies.map((melody) => (
                <div key={melody.id} className={styles.melodyCard}>
                  <div className={styles.melodyInfo}>
                    <span className={styles.melodyName}>{melody.name}</span>
                    <span className={styles.melodyMeta}>
                      {melody.notes.length} notes • {melody.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.melodyActions}>
                    <button
                      className={styles.playButton}
                      onClick={() => playMelody(melody)}
                      aria-label={`Play ${melody.name}`}
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteMelody(melody.id)}
                      aria-label={`Delete ${melody.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
