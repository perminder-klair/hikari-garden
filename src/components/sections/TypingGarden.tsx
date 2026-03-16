import { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard, RefreshCw, Trophy, Zap } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

const quotes = [
  "The best code is the code you don't write.",
  "Simplicity is the ultimate sophistication.",
  "First, solve the problem. Then, write the code.",
  "Make it work, make it right, make it fast.",
  "Code is like humor. When you have to explain it, it's bad.",
  "Any fool can write code that a computer can understand.",
  "Experience is the name everyone gives to their mistakes.",
  "Java is to JavaScript what car is to Carpet.",
  "Knowledge is power.",
  "Fix the cause, not the symptom.",
];

export default function TypingGarden() {
  const [currentQuote, setCurrentQuote] = useState('');
  const [input, setInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.typing-section');
    newQuote();
  }, [revealRef]);

  const newQuote = () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(quote);
    setInput('');
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
  };

  const calculateWpm = useCallback(() => {
    if (!startTime) return 0;
    const timeInMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = input.length / 5;
    return Math.round(wordsTyped / timeInMinutes);
  }, [startTime, input.length]);

  const calculateAccuracy = useCallback(() => {
    if (input.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === currentQuote[i]) correct++;
    }
    return Math.round((correct / input.length) * 100);
  }, [input, currentQuote]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setWpm(calculateWpm());
        setAccuracy(calculateAccuracy());
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isActive, calculateWpm, calculateAccuracy]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    setInput(value);
    if (value === currentQuote) {
      const finalWpm = calculateWpm();
      setWpm(finalWpm);
      setAccuracy(100);
      setStreak(s => s + 1);
      if (finalWpm > bestWpm) setBestWpm(finalWpm);
      setTimeout(newQuote, 1500);
    }
  };

  const getCharStyle = (index: number) => {
    if (index >= input.length) return { color: 'var(--text-muted)' };
    if (input[index] === currentQuote[index]) return { color: '#2ecc71' };
    return { color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)' };
  };

  return (
    <section className="typing-section" id="typing" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Practice
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Typing Garden
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Zap size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{wpm}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>WPM</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{accuracy}%</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accuracy</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Trophy size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{streak}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Streak</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{bestWpm}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Best</span>
        </div>
      </div>

      {/* Quote Display */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '1.5rem',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontSize: '1.25rem', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.6, textAlign: 'center' }}>
          {currentQuote.split('').map((char, i) => (
            <span key={i} style={getCharStyle(i)}>{char}</span>
          ))}
        </p>
      </div>

      {/* Input */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Start typing..."
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontFamily: 'Space Mono, monospace',
            outline: 'none',
          }}
        />
        <Keyboard size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={newQuote}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <RefreshCw size={16} />
          New Quote
        </button>
      </div>
    </section>
  );
}
