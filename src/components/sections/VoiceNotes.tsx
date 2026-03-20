import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Clock, Volume2 } from 'lucide-react';
import styles from './VoiceNotes.module.css';

interface VoiceNote {
  id: string;
  timestamp: string;
  duration: number;
  transcript: string;
  audioUrl: string | null;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [notes, setNotes] = useState<VoiceNote[]>([
    {
      id: '1',
      timestamp: '2026-03-15T10:30:00',
      duration: 45,
      transcript: 'Remember to review the project requirements before the meeting tomorrow.',
      audioUrl: null
    },
    {
      id: '2',
      timestamp: '2026-03-14T16:20:00',
      duration: 32,
      transcript: 'Idea for the new feature: add voice commands for quick navigation.',
      audioUrl: null
    }
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [newTranscript, setNewTranscript] = useState('');
  const [waveformBars] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      height: seededRandom(i) * 60 + 20,
    }))
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      setIsRecording(true);
      setRecordingTime(0);
      
      // Simulate recording (in real implementation, would capture actual audio)
      mediaRecorder.start();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    
    // Create new note
    const newNote: VoiceNote = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      transcript: newTranscript || 'Voice note recorded',
      audioUrl: null
    };
    
    setNotes([newNote, ...notes]);
    setRecordingTime(0);
    setNewTranscript('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 3000); // Simulate playback
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Mic className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Voice Notes</h2>
        <p className={styles.sectionSubtitle}>Capture thoughts with your voice</p>
      </div>

      <div className={styles.container}>
        <div className={styles.recorder}>
          <div className={styles.recorderVisual}>
            {isRecording ? (
              <div className={styles.waveform}>
                {waveformBars.map((bar) => (
                  <div
                    key={bar.id}
                    className={styles.waveBar}
                    style={{
                      height: `${bar.height}%`,
                      animationDelay: `${bar.id * 0.05}s`
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.idleVisual}>
                <Mic size={48} />
              </div>
            )}
          </div>

          <div className={styles.timer}>
            <Clock size={20} />
            <span className={isRecording ? styles.recordingTime : ''}>
              {formatTime(recordingTime)}
            </span>
          </div>

          <button
            className={styles.recordButton}
            data-recording={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <Square size={24} /> : <Mic size={24} />}
            <span>{isRecording ? 'Stop' : 'Record'}</span>
          </button>

          {isRecording && (
            <input
              type="text"
              value={newTranscript}
              onChange={(e) => setNewTranscript(e.target.value)}
              placeholder="Type transcript while recording..."
              className={styles.transcriptInput}
            />
          )}
        </div>

        <div className={styles.notesList}>
          <h3 className={styles.listTitle}>Recent Notes ({notes.length})</h3>
          
          {notes.length === 0 ? (
            <p className={styles.emptyState}>No voice notes yet. Start recording!</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <span className={styles.noteDate}>{formatDate(note.timestamp)}</span>
                  <span className={styles.noteDuration}>
                    <Clock size={12} /> {formatTime(note.duration)}
                  </span>
                </div>
                
                <p className={styles.noteTranscript}>{note.transcript}</p>
                
                <div className={styles.noteActions}>
                  <button 
                    className={styles.playButton}
                    onClick={() => togglePlay(note.id)}
                  >
                    {playingId === note.id ? <Pause size={16} /> : <Play size={16} />}
                    <span>{playingId === note.id ? 'Playing...' : 'Play'}</span>
                  </button>
                  
                  <button 
                    className={styles.deleteButton}
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {playingId === note.id && (
                  <div className={styles.playbackBar}>
                    <Volume2 size={14} />
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
