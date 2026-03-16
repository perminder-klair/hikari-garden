import { useState, useEffect, useRef } from 'react';
import { Mic, Play, Pause, Square, Trash2, Clock, Calendar, Volume2, Download } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface VoiceMemo {
  id: string;
  title: string;
  duration: number;
  createdAt: string;
  transcript?: string;
  tags: string[];
}

const initialMemos: VoiceMemo[] = [
  {
    id: '1',
    title: 'Garden Ideas - Cycle 11',
    duration: 45,
    createdAt: '2026-03-13T10:30:00',
    transcript: 'Add a voice memo feature, maybe a photo gallery section, and some kind of mood analytics...',
    tags: ['ideas', 'garden'],
  },
  {
    id: '2',
    title: 'Quick Thought - Fizzy Integration',
    duration: 23,
    createdAt: '2026-03-13T09:15:00',
    transcript: 'Need to improve the Fizzy task check to handle more complex card operations...',
    tags: ['work', 'fizzy'],
  },
  {
    id: '3',
    title: 'Book Notes - Atomic Habits',
    duration: 120,
    createdAt: '2026-03-12T20:00:00',
    tags: ['reading', 'notes'],
  },
];

export default function VoiceMemos() {
  const [memos, setMemos] = useState<VoiceMemo[]>(initialMemos);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedMemo, setSelectedMemo] = useState<VoiceMemo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { revealRef } = useGarden();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    revealRef.current?.('.voice-memos-section');
  }, [revealRef]);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const newMemo: VoiceMemo = {
      id: Date.now().toString(),
      title: `Recording ${memos.length + 1}`,
      duration: recordingTime,
      createdAt: new Date().toISOString(),
      tags: [],
    };
    setMemos([newMemo, ...memos]);
    setRecordingTime(0);
  };

  const deleteMemo = (id: string) => {
    setMemos(memos.filter(m => m.id !== id));
    if (selectedMemo?.id === id) {
      setSelectedMemo(null);
    }
  };

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.transcript?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalDuration = memos.reduce((acc, m) => acc + m.duration, 0);

  return (
    <section className="voice-memos-section" id="voice-memos" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Audio Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Voice Memos
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{memos.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Recordings</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{formatTime(totalDuration)}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Time</div>
        </div>
      </div>

      {/* Recording Interface */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem',
        border: isRecording ? '1px solid #e74c3c' : '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: isRecording ? '#e74c3c' : 'var(--accent-gold)',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          animation: isRecording ? 'pulse 1.5s infinite' : 'none',
        }} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <Square size={40} color="white" /> : <Mic size={40} color="var(--bg-primary)" />}
        </div>

        <div style={{ fontSize: '2rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>
          {formatTime(recordingTime)}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRecording ? 'Recording...' : 'Tap to record'}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search memos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Memo List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredMemos.map(memo => (
          <div
            key={memo.id}
            onClick={() => setSelectedMemo(memo)}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '1.25rem',
              border: selectedMemo?.id === memo.id ? '1px solid rgba(244, 208, 63, 0.3)' : '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(memo.id); }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: playingId === memo.id ? '#e74c3c' : 'rgba(255,255,255,0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {playingId === memo.id ? <Pause size={20} color="white" /> : <Play size={20} color="var(--text-primary)" />}
            </button>

            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.25rem' }}>{memo.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {formatTime(memo.duration)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  {formatDate(memo.createdAt)}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); deleteMemo(memo.id); }}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: '#e74c3c',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Selected Memo Detail */}
      {selectedMemo && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid rgba(244, 208, 63, 0.2)',
        }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'Cormorant Garamond, serif' }}>
            {selectedMemo.title}
          </h3>
          {selectedMemo.transcript && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Transcript
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{selectedMemo.transcript}"
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedMemo.tags.map(tag => (
              <span key={tag} style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}
