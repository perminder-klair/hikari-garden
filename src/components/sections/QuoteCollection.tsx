import { useState, useEffect } from 'react';
import { Quote, Heart, Share2, Copy, Check } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  category: string;
  liked: boolean;
}

const quotes: QuoteItem[] = [
  { id: '1', text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work", liked: true },
  { id: '2', text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Design", liked: true },
  { id: '3', text: "Code is poetry.", author: "WordPress", category: "Code", liked: false },
  { id: '4', text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Code", liked: true },
  { id: '5', text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Wisdom", liked: true },
  { id: '6', text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Wisdom", liked: false },
  { id: '7', text: "The obstacle is the way.", author: "Marcus Aurelius", category: "Stoicism", liked: true },
  { id: '8', text: "Play long-term games with long-term people.", author: "Naval Ravikant", category: "Life", liked: true },
  { id: '9', text: "Your margin is my opportunity.", author: "Jeff Bezos", category: "Business", liked: false },
  { id: '10', text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: "Code", liked: true },
];

const categories = ['All', 'Code', 'Wisdom', 'Work', 'Life', 'Design', 'Stoicism', 'Business'];

export default function QuoteCollection() {
  const [quoteList, setQuoteList] = useState(quotes);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.quote-collection-section');
  }, [revealRef]);

  const filteredQuotes = selectedCategory === 'All' 
    ? quoteList 
    : quoteList.filter(q => q.category === selectedCategory);

  const toggleLike = (id: string) => {
    setQuoteList(prev => prev.map(q => 
      q.id === id ? { ...q, liked: !q.liked } : q
    ));
  };

  const copyQuote = (quote: QuoteItem) => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="quote-collection-section" id="quotes" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Collected Wisdom
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Quote Collection
        </h2>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === cat ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quote Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1.5rem',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Quote size={20} style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '1rem' }} />
            
            <p style={{ 
              fontFamily: 'Cormorant Garamond, serif', 
              fontSize: '1.1rem', 
              color: 'var(--text-primary)', 
              lineHeight: 1.6,
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              "{quote.text}"
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>
                  — {quote.author}
                </span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'var(--text-muted)', 
                  marginLeft: '0.5rem',
                  padding: '0.15rem 0.4rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '4px',
                }}>
                  {quote.category}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => copyQuote(quote)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedId === quote.id ? '#2ecc71' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'color 0.3s ease',
                  }}
                  title="Copy"
                >
                  {copiedId === quote.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => toggleLike(quote.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: quote.liked ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'color 0.3s ease',
                  }}
                  title="Like"
                >
                  <Heart size={16} fill={quote.liked ? 'var(--accent-gold)' : 'transparent'} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
