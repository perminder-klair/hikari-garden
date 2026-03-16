import { useState, useEffect } from 'react';
import { Heart, Plus, Shuffle, Copy, Check, Sparkles, Sun, Moon, Star } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Affirmation {
  id: string;
  text: string;
  category: string;
  favorite: boolean;
  createdAt: string;
}

const defaultAffirmations: Affirmation[] = [
  { id: '1', text: 'I am capable of achieving anything I set my mind to', category: 'confidence', favorite: true, createdAt: '2026-03-13' },
  { id: '2', text: 'Every day is a fresh start full of possibilities', category: 'mindset', favorite: false, createdAt: '2026-03-13' },
  { id: '3', text: 'I choose peace over worry', category: 'calm', favorite: true, createdAt: '2026-03-13' },
  { id: '4', text: 'My potential is limitless', category: 'growth', favorite: false, createdAt: '2026-03-13' },
  { id: '5', text: 'I am grateful for this moment', category: 'gratitude', favorite: false, createdAt: '2026-03-13' },
  { id: '6', text: 'Challenges are opportunities in disguise', category: 'resilience', favorite: true, createdAt: '2026-03-13' },
  { id: '7', text: 'I radiate positive energy', category: 'energy', favorite: false, createdAt: '2026-03-13' },
  { id: '8', text: 'I trust the journey, even when I cannot see the path', category: 'trust', favorite: false, createdAt: '2026-03-13' },
];

const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'confidence', label: 'Confidence', icon: Star },
  { id: 'mindset', label: 'Mindset', icon: Sun },
  { id: 'calm', label: 'Calm', icon: Moon },
  { id: 'growth', label: 'Growth', icon: Heart },
];

export default function AffirmationWall() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>(defaultAffirmations);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [newCategory, setNewCategory] = useState('confidence');
  const [copied, setCopied] = useState(false);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.affirmation-wall-section');
    shuffleAffirmation();
  }, [revealRef]);

  const shuffleAffirmation = () => {
    const filtered = selectedCategory === 'all' 
      ? affirmations 
      : affirmations.filter(a => a.category === selectedCategory);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentAffirmation(random || affirmations[0]);
  };

  const toggleFavorite = (id: string) => {
    setAffirmations(prev => prev.map(a => 
      a.id === id ? { ...a, favorite: !a.favorite } : a
    ));
  };

  const copyToClipboard = () => {
    if (currentAffirmation) {
      navigator.clipboard.writeText(currentAffirmation.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addAffirmation = () => {
    if (!newAffirmation.trim()) return;
    const affirmation: Affirmation = {
      id: Date.now().toString(),
      text: newAffirmation,
      category: newCategory,
      favorite: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAffirmations([...affirmations, affirmation]);
    setNewAffirmation('');
    setShowAdd(false);
  };

  const filteredAffirmations = selectedCategory === 'all' 
    ? affirmations 
    : affirmations.filter(a => a.category === selectedCategory);

  const favoriteCount = affirmations.filter(a => a.favorite).length;

  return (
    <section className="affirmation-wall-section" id="affirmations" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Daily Light
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Affirmation Wall
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{affirmations.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Affirmations</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{favoriteCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Favorites</div>
        </div>
      </div>

      {/* Main Affirmation Card */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        marginBottom: '2rem',
        border: '1px solid rgba(244, 208, 63, 0.2)',
        position: 'relative',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
        
        {currentAffirmation && (
          <>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              fontStyle: 'italic',
            }}>
              "{currentAffirmation.text}"
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => toggleFavorite(currentAffirmation.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: currentAffirmation.favorite ? '#e74c3c' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '8px',
                  color: currentAffirmation.favorite ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Heart size={18} fill={currentAffirmation.favorite ? 'white' : 'none'} />
                {currentAffirmation.favorite ? 'Favorited' : 'Favorite'}
              </button>
              
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={shuffleAffirmation}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Shuffle size={18} />
                New
              </button>
            </div>
          </>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const filtered = cat.id === 'all' 
                  ? affirmations 
                  : affirmations.filter(a => a.category === cat.id);
                setCurrentAffirmation(filtered[0] || null);
              }}
              style={{
                padding: '0.75rem 1.25rem',
                background: selectedCategory === cat.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '20px',
                color: selectedCategory === cat.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Affirmation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {filteredAffirmations.map(affirmation => (
          <div
            key={affirmation.id}
            onClick={() => setCurrentAffirmation(affirmation)}
            style={{
              padding: '1.5rem',
              background: currentAffirmation?.id === affirmation.id 
                ? 'rgba(244, 208, 63, 0.1)' 
                : 'var(--bg-secondary)',
              borderRadius: '8px',
              border: currentAffirmation?.id === affirmation.id 
                ? '1px solid rgba(244, 208, 63, 0.3)' 
                : '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              marginBottom: '1rem',
              fontStyle: 'italic',
            }}>
              "{affirmation.text.substring(0, 80)}{affirmation.text.length > 80 ? '...' : ''}"
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '0.25rem 0.5rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                textTransform: 'capitalize',
              }}>
                {affirmation.category}
              </span>
              
              {affirmation.favorite && <Heart size={14} fill="#e74c3c" color="#e74c3c" />}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px dashed rgba(244, 208, 63, 0.5)',
            borderRadius: '8px',
            color: 'var(--accent-gold)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={18} />
          Add Affirmation
        </button>
      </div>

      {/* Add Modal */}
      {showAdd && (
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
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Add Affirmation
            </h3>

            <textarea
              placeholder="Write your affirmation..."
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              <option value="confidence">Confidence</option>
              <option value="mindset">Mindset</option>
              <option value="calm">Calm</option>
              <option value="growth">Growth</option>
              <option value="gratitude">Gratitude</option>
              <option value="resilience">Resilience</option>
              <option value="energy">Energy</option>
              <option value="trust">Trust</option>
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addAffirmation}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
