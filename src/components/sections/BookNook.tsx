import { useState, useEffect } from 'react';
import { BookOpen, Star, Clock, Bookmark, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: 'reading' | 'toread' | 'completed' | 'dnf';
  progress: number;
  rating?: number;
  genre: string[];
  startedAt?: string;
  completedAt?: string;
  notes: string;
  quotes: string[];
}

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: '📘',
    status: 'reading',
    progress: 65,
    genre: ['Self-Improvement', 'Psychology'],
    startedAt: '2026-02-15',
    notes: 'Great insights on habit stacking and environment design',
    quotes: ['You do not rise to the level of your goals. You fall to the level of your systems.'],
  },
  {
    id: '2',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    cover: '💻',
    status: 'completed',
    progress: 100,
    rating: 5,
    genre: ['Technology', 'Career'],
    startedAt: '2025-11-01',
    completedAt: '2026-01-20',
    notes: 'Essential reading for any developer',
    quotes: ['DRY - Do not Repeat Yourself', 'Care about your craft'],
  },
  {
    id: '3',
    title: 'Deep Work',
    author: 'Cal Newport',
    cover: '🧠',
    status: 'toread',
    progress: 0,
    genre: ['Productivity', 'Self-Improvement'],
    notes: 'Recommended by several colleagues',
    quotes: [],
  },
  {
    id: '4',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    cover: '🏗️',
    status: 'reading',
    progress: 30,
    genre: ['Technology', 'Architecture'],
    startedAt: '2026-03-01',
    notes: 'SOLID principles in practice',
    quotes: [],
  },
  {
    id: '5',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    cover: '🏛️',
    status: 'completed',
    progress: 100,
    rating: 5,
    genre: ['Philosophy', 'Stoicism'],
    startedAt: '2025-09-01',
    completedAt: '2025-12-01',
    notes: 'Timeless wisdom on resilience and virtue',
    quotes: ['The happiness of your life depends upon the quality of your thoughts.'],
  },
];

const statusConfig = {
  reading: { label: 'Reading', color: '#3498db', icon: BookOpen },
  toread: { label: 'To Read', color: '#95a5a6', icon: Bookmark },
  completed: { label: 'Completed', color: '#2ecc71', icon: CheckCircle2 },
  dnf: { label: 'DNF', color: '#e74c3c', icon: Circle },
};

export default function BookNook() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [filter, setFilter] = useState<Book['status'] | 'all'>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.book-nook-section');
  }, [revealRef]);

  const filteredBooks = filter === 'all' ? books : books.filter(b => b.status === filter);

  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    avgRating: books.filter(b => b.rating).reduce((acc, b) => acc + (b.rating || 0), 0) / books.filter(b => b.rating).length || 0,
  };

  const genres = Array.from(new Set(books.flatMap(b => b.genre)));

  return (
    <section className="book-nook-section" id="books" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Literary Sanctuary
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Book Nook
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <BookOpen size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Books</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.reading}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reading</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.completed}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
            <Star size={16} style={{ color: '#f39c12' }} />
            <span style={{ fontSize: '2rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{stats.avgRating.toFixed(1)}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Rating</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.5rem 1rem',
            background: filter === 'all' ? 'var(--accent-gold)' : 'transparent',
            border: `1px solid ${filter === 'all' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            color: filter === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilter(status as Book['status'])}
            style={{
              padding: '0.5rem 1rem',
              background: filter === status ? config.color : 'transparent',
              border: `1px solid ${filter === status ? config.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === status ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {filteredBooks.map(book => {
          const config = statusConfig[book.status];
          const Icon = config.icon;
          
          return (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${book.status === 'reading' ? config.color : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${config.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{book.cover}</div>
              
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                {book.title}
              </h3>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>
                {book.author}
              </p>

              {book.status === 'reading' && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${book.progress}%`, height: '100%', background: config.color, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: config.color, display: 'block', textAlign: 'center', marginTop: '0.5rem' }}>
                    {book.progress}%
                  </span>
                </div>
              )}

              {book.rating && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < book.rating! ? '#f39c12' : 'transparent'}
                      color={i < book.rating! ? '#f39c12' : 'rgba(255,255,255,0.2)'}
                    />
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '1rem', justifyContent: 'center' }}>
                {book.genre.slice(0, 2).map(g => (
                  <span key={g} style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBook && (
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
          onClick={() => setSelectedBook(null)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{selectedBook.cover}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {selectedBook.title}
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>{selectedBook.author}</p>
            </div>

            {selectedBook.quotes.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  "{selectedBook.quotes[0]}"
                </p>
              </div>
            )}

            {selectedBook.notes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Notes</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedBook.notes}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setSelectedBook(null)}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
