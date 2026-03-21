import { useState, useEffect, useCallback } from 'react';
import styles from './DreamWeaver.module.css';

interface DreamEntry {
  id: string;
  text: string;
  date: string;
  lucid: boolean;
}

const dreamSymbols = [
  { symbol: '🌙', name: 'Moon', meaning: 'Intuition, subconscious, feminine energy. Reflects hidden emotions and the inner self.' },
  { symbol: '⭐', name: 'Stars', meaning: 'Guidance, hope, aspirations. Messages from the universe or your higher self.' },
  { symbol: '🌊', name: 'Water', meaning: 'Emotions, purification, the unconscious mind. Flowing water suggests adaptability.' },
  { symbol: '🏠', name: 'House', meaning: 'Your psyche, self, or current life situation. Different rooms represent different aspects of yourself.' },
  { symbol: '🦋', name: 'Butterfly', meaning: 'Transformation, growth, soul. Indicates personal evolution or a need for lightness.' },
  { symbol: '🐉', name: 'Dragon', meaning: 'Power, wisdom, untapped potential. May represent a challenge or great inner strength.' },
  { symbol: '🌸', name: 'Flowers', meaning: 'Renewal, beauty, the brief nature of life. Can indicate new beginnings or fragility.' },
  { symbol: '🔥', name: 'Fire', meaning: 'Passion, anger, transformation. Cleansing or destruction depending on context.' },
];

const lucidityTips = [
  { icon: '📝', title: 'Reality Checks', text: 'Throughout the day, question if you\'re dreaming. Look at your hands, try to push fingers through palms.' },
  { icon: '🌙', title: 'Dream Journal', text: 'Write down dreams immediately upon waking. Keep the journal by your bed. Patterns emerge over time.' },
  { icon: '⏰', title: 'Wake Back to Bed', text: 'Set an alarm 5-6 hours after sleep. Stay awake 20-30 mins, then return to sleep to enter REM directly.' },
  { icon: '🧘', title: 'Meditation', text: 'Regular meditation increases dream recall and may promote lucidity through enhanced awareness.' },
  { icon: '🔮', title: 'Set Intentions', text: 'Before sleep, affirm "I will realize I\'m dreaming." Visualization helps prime the subconscious.' },
  { icon: '🛏️', title: 'Sleep Position', text: 'Some find sleeping on their back or with head pointing north increases lucid dreaming frequency.' },
];

export default function DreamWeaver() {
  const [activeTab, setActiveTab] = useState<'journal' | 'lucidity' | 'dictionary'>('journal');
  const [dreamText, setDreamText] = useState('');
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [floatingSymbols, setFloatingSymbols] = useState<{ id: number; symbol: string; left: number; delay: number }[]>([]);

  useEffect(() => {
    const symbols = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      symbol: dreamSymbols[Math.floor(Math.random() * dreamSymbols.length)].symbol,
      left: Math.random() * 100,
      delay: Math.random() * 20,
    }));
    setFloatingSymbols(symbols);
  }, []);

  const handleRecordDream = useCallback(() => {
    if (!dreamText.trim()) return;
    
    const newDream: DreamEntry = {
      id: Date.now().toString(),
      text: dreamText.trim(),
      date: new Date().toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      lucid: dreamText.toLowerCase().includes('lucid') || Math.random() > 0.7,
    };

    setDreams(prev => [newDream, ...prev]);
    setDreamText('');
  }, [dreamText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleRecordDream();
    }
  }, [handleRecordDream]);

  return (
    <div className={styles.dreamWeaver}>
      <div className={styles.floatingSymbols}>
        {floatingSymbols.map(s => (
          <span
            key={s.id}
            className={styles.floatingSymbol}
            style={{ left: `${s.left}%`, animationDelay: `${s.delay}s` }}
          >
            {s.symbol}
          </span>
        ))}
      </div>

      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.icon}>✨</span>
          <div>
            <h2 className={styles.title}>DreamWeaver</h2>
            <p className={styles.subtitle}>Explore the landscape of your sleeping mind</p>
          </div>
        </div>

        <div className={styles.tabs}>
          {(['journal', 'lucidity', 'dictionary'] as const).map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'journal' ? '📖 Journal' : tab === 'lucidity' ? '🔮 Lucidity' : '📜 Dictionary'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'journal' && (
          <div className={styles.journal}>
            <div className={styles.journalPanel}>
              <h3 className={styles.panelTitle}>🌙 Record Your Dream</h3>
              <textarea
                className={styles.input}
                placeholder="Describe your dream in detail — sights, sounds, emotions..."
                value={dreamText}
                onChange={e => setDreamText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
              />
              <button className={styles.recordBtn} onClick={handleRecordDream}>
                ✨ Record Dream
              </button>
            </div>

            <div className={styles.journalPanel}>
              <h3 className={styles.panelTitle}>📚 Dream Archive</h3>
              {dreams.length === 0 ? (
                <p className={styles.empty}>No dreams recorded yet. Begin your journey tonight...</p>
              ) : (
                <div className={styles.dreamList}>
                  {dreams.map(dream => (
                    <div key={dream.id} className={styles.dreamEntry}>
                      <div className={styles.dreamDate}>
                        {dream.date} {dream.lucid && '🌟'}
                      </div>
                      <p className={styles.dreamText}>{dream.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lucidity' && (
          <div className={styles.lucidityTips}>
            {lucidityTips.map((tip, i) => (
              <div key={i} className={styles.tip}>
                <span className={styles.tipIcon}>{tip.icon}</span>
                <h4 className={styles.tipTitle}>{tip.title}</h4>
                <p className={styles.tipText}>{tip.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className={styles.dictionary}>
            {dreamSymbols.map((item, i) => (
              <div key={i} className={styles.symbol}>
                <div className={styles.symbolHeader}>
                  <span className={styles.symbolIcon}>{item.symbol}</span>
                  <span className={styles.symbolName}>{item.name}</span>
                </div>
                <p className={styles.symbolMeaning}>{item.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
