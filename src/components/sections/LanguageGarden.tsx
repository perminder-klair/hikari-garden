import { useState, useEffect } from 'react';
import { Languages, BookOpen, Mic, Trophy, Target, Flame, TrendingUp, Award } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Language {
  code: string;
  name: string;
  flag: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'fluent';
  xp: number;
  streak: number;
  lastPracticed: string;
  skills: { name: string; progress: number }[];
}

const languages: Language[] = [
  {
    code: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    level: 'beginner',
    xp: 2450,
    streak: 12,
    lastPracticed: '2026-03-11',
    skills: [
      { name: 'Hiragana', progress: 100 },
      { name: 'Katakana', progress: 85 },
      { name: 'Basic Kanji', progress: 45 },
      { name: 'Grammar', progress: 30 },
    ],
  },
  {
    code: 'pa',
    name: 'Punjabi',
    flag: '🇮🇳',
    level: 'intermediate',
    xp: 5200,
    streak: 45,
    lastPracticed: '2026-03-12',
    skills: [
      { name: 'Speaking', progress: 75 },
      { name: 'Reading', progress: 60 },
      { name: 'Writing', progress: 40 },
      { name: 'Vocabulary', progress: 70 },
    ],
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    level: 'beginner',
    xp: 890,
    streak: 3,
    lastPracticed: '2026-03-10',
    skills: [
      { name: 'Basics', progress: 60 },
      { name: 'Phrases', progress: 35 },
      { name: 'Grammar', progress: 20 },
      { name: 'Vocabulary', progress: 40 },
    ],
  },
];

const dailyGoal = { target: 30, current: 25 };

const achievements = [
  { name: '7 Day Streak', icon: '🔥', earned: true },
  { name: '1000 XP', icon: '💎', earned: true },
  { name: 'First Conversation', icon: '🗣️', earned: false },
  { name: 'Grammar Master', icon: '📚', earned: false },
];

export default function LanguageGarden() {
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [isPracticing, setIsPracticing] = useState(false);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.language-garden-section');
  }, [revealRef]);

  const levelColors = {
    beginner: '#95a5a6',
    intermediate: '#f39c12',
    advanced: '#3498db',
    fluent: '#2ecc71',
  };

  const totalXP = languages.reduce((acc, l) => acc + l.xp, 0);
  const maxStreak = Math.max(...languages.map(l => l.streak));

  return (
    <section className="language-garden-section" id="languages" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Linguistic Growth
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Language Garden
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Languages size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{languages.length}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Languages</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{totalXP.toLocaleString()}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total XP</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
            <Flame size={16} style={{ color: '#e74c3c' }} />
            <span style={{ fontSize: '2rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{maxStreak}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best Streak</span>
        </div>
      </div>

      {/* Daily Goal */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} />
            Daily Goal
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>{dailyGoal.current}/{dailyGoal.target} min</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${(dailyGoal.current / dailyGoal.target) * 100}%`,
            height: '100%',
            background: 'var(--accent-gold)',
            borderRadius: '4px',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Language Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang)}
            style={{
              padding: '1rem 1.5rem',
              background: selectedLang.code === lang.code ? 'var(--accent-gold)' : 'var(--bg-secondary)',
              border: `1px solid ${selectedLang.code === lang.code ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              color: selectedLang.code === lang.code ? 'var(--bg-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{lang.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'capitalize' }}>{lang.level}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Language Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Progress Card */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: `1px solid ${levelColors[selectedLang.level]}30` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
              {selectedLang.name} Progress
            </h3>
            <span style={{
              padding: '0.25rem 0.75rem',
              background: `${levelColors[selectedLang.level]}20`,
              color: levelColors[selectedLang.level],
              borderRadius: '4px',
              fontSize: '0.75rem',
              textTransform: 'capitalize',
            }}>
              {selectedLang.level}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>{selectedLang.flag}</div>
            <div>
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
                {selectedLang.xp.toLocaleString()} XP
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#e74c3c' }}>
                <Flame size={14} />
                {selectedLang.streak} day streak
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsPracticing(true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--accent-gold)',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--bg-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <BookOpen size={16} />
            Practice Now
          </button>
        </div>

        {/* Skills */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} />
            Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedLang.skills.map(skill => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{skill.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{skill.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${skill.progress}%`,
                    height: '100%',
                    background: 'var(--accent-gold)',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} />
          Achievements
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {achievements.map(ach => (
            <div
              key={ach.name}
              style={{
                padding: '1rem',
                background: ach.earned ? 'rgba(244, 208, 63, 0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${ach.earned ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                textAlign: 'center',
                opacity: ach.earned ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{ach.icon}</div>
              <div style={{ fontSize: '0.8rem', color: ach.earned ? 'var(--text-primary)' : 'var(--text-muted)' }}>{ach.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Modal */}
      {isPracticing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setIsPracticing(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{selectedLang.flag}</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
              Practice {selectedLang.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Choose a practice mode to continue your learning journey.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{
                padding: '0.75rem',
                background: 'var(--accent-gold)',
                border: 'none',
                borderRadius: '4px',
                color: 'var(--bg-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <BookOpen size={16} />
                Vocabulary
              </button>
              <button style={{
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <Mic size={16} />
                Speaking
              </button>
              <button style={{
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <Trophy size={16} />
                Quiz
              </button>
            </div>
            <button
              onClick={() => setIsPracticing(false)}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
