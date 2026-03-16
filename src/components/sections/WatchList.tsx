import { useState, useEffect } from 'react';
import { Film, Tv, Star, Clock, Check, Plus, Play, Calendar } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface WatchItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  genre: string[];
  status: 'want' | 'watching' | 'completed' | 'dropped';
  rating?: number;
  platform: string;
  episodes?: { current: number; total: number };
  duration?: string;
  addedAt: string;
  poster?: string;
}

const initialItems: WatchItem[] = [
  {
    id: '1',
    title: 'Severance',
    type: 'series',
    genre: ['Sci-Fi', 'Thriller'],
    status: 'watching',
    platform: 'Apple TV+',
    episodes: { current: 4, total: 10 },
    addedAt: '2026-03-01',
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    type: 'movie',
    genre: ['Sci-Fi', 'Adventure'],
    status: 'completed',
    rating: 5,
    platform: 'Cinema',
    duration: '2h 46m',
    addedAt: '2026-02-28',
  },
  {
    id: '3',
    title: 'The Bear',
    type: 'series',
    genre: ['Drama'],
    status: 'want',
    platform: 'Disney+',
    episodes: { current: 0, total: 18 },
    addedAt: '2026-03-10',
  },
  {
    id: '4',
    title: 'Poor Things',
    type: 'movie',
    genre: ['Comedy', 'Drama'],
    status: 'completed',
    rating: 4,
    platform: 'Cinema',
    duration: '2h 21m',
    addedAt: '2026-02-15',
  },
  {
    id: '5',
    title: 'Shōgun',
    type: 'series',
    genre: ['Drama', 'History'],
    status: 'watching',
    platform: 'Disney+',
    episodes: { current: 3, total: 10 },
    addedAt: '2026-03-05',
  },
];

const genres = ['All', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy', 'Adventure', 'History', 'Horror'];
const platforms = ['Netflix', 'Disney+', 'Apple TV+', 'Prime Video', 'Cinema', 'Other'];

export default function WatchList() {
  const [items, setItems] = useState<WatchItem[]>(initialItems);
  const [filter, setFilter] = useState({ genre: 'All', status: 'all' });
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'movie' as 'movie' | 'series',
    genre: '',
    platform: 'Netflix',
    episodes: '',
    duration: '',
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.watch-list-section');
  }, [revealRef]);

  const filteredItems = items.filter(item => {
    const genreMatch = filter.genre === 'All' || item.genre.includes(filter.genre);
    const statusMatch = filter.status === 'all' || item.status === filter.status;
    return genreMatch && statusMatch;
  });

  const stats = {
    total: items.length,
    watching: items.filter(i => i.status === 'watching').length,
    completed: items.filter(i => i.status === 'completed').length,
    want: items.filter(i => i.status === 'want').length,
  };

  const addItem = () => {
    if (!newItem.title) return;
    const item: WatchItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      genre: newItem.genre.split(',').map(g => g.trim()).filter(Boolean),
      status: 'want',
      platform: newItem.platform,
      episodes: newItem.type === 'series' ? { current: 0, total: parseInt(newItem.episodes) || 0 } : undefined,
      duration: newItem.type === 'movie' ? newItem.duration : undefined,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setItems([item, ...items]);
    setIsAdding(false);
    setNewItem({ title: '', type: 'movie', genre: '', platform: 'Netflix', episodes: '', duration: '' });
  };

  const updateStatus = (id: string, status: WatchItem['status']) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const updateProgress = (id: string, current: number) => {
    setItems(items.map(i => 
      i.id === id && i.episodes 
        ? { ...i, episodes: { ...i.episodes, current } }
        : i
    ));
  };

  return (
    <section className="watch-list-section" id="watchlist" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Entertainment Tracker
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Watch List
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.watching}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Watching</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.completed}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{stats.want}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Want to Watch</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setFilter({ ...filter, genre })}
            style={{
              padding: '0.5rem 1rem',
              background: filter.genre === genre ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter.genre === genre ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter.genre === genre ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add Title
        </button>
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${item.status === 'watching' ? '#3498db30' : item.status === 'completed' ? '#2ecc7130' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                  {item.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {item.type === 'movie' ? <Film size={14} color="var(--text-muted)" /> : <Tv size={14} color="var(--text-muted)" />}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.platform}</span>
                </div>
              </div>
              <span style={{
                padding: '0.25rem 0.5rem',
                background: item.status === 'watching' ? '#3498db20' : item.status === 'completed' ? '#2ecc7120' : '#9b59b620',
                color: item.status === 'watching' ? '#3498db' : item.status === 'completed' ? '#2ecc71' : '#9b59b6',
                borderRadius: '4px',
                fontSize: '0.7rem',
                textTransform: 'capitalize',
              }}>
                {item.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
              {item.genre.map(g => (
                <span key={g} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                  {g}
                </span>
              ))}
            </div>

            {item.episodes && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Progress</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.episodes.current}/{item.episodes.total}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(item.episodes.current / item.episodes.total) * 100}%`,
                    height: '100%',
                    background: '#3498db',
                    borderRadius: '3px',
                  }} />
                </div>
              </div>
            )}

            {item.duration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Clock size={14} />
                {item.duration}
              </div>
            )}

            {item.rating && (
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < item.rating! ? '#f39c12' : 'transparent'} color={i < item.rating! ? '#f39c12' : 'rgba(255,255,255,0.2)'} />
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {item.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(item.id, item.status === 'want' ? 'watching' : 'completed')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: item.status === 'watching' ? '#2ecc71' : '#3498db',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--bg-primary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {item.status === 'want' ? <Play size={12} /> : <Check size={12} />}
                  {item.status === 'want' ? 'Start' : 'Complete'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
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
          onClick={() => setIsAdding(false)}
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
              Add to Watch List
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {(['movie', 'series'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setNewItem({ ...newItem, type })}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: newItem.type === type ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: newItem.type === type ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Genres (comma separated)"
              value={newItem.genre}
              onChange={(e) => setNewItem({ ...newItem, genre: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            />

            <select
              value={newItem.platform}
              onChange={(e) => setNewItem({ ...newItem, platform: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {platforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {newItem.type === 'series' ? (
              <input
                type="number"
                placeholder="Total episodes"
                value={newItem.episodes}
                onChange={(e) => setNewItem({ ...newItem, episodes: e.target.value })}
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
              />
            ) : (
              <input
                type="text"
                placeholder="Duration (e.g., 2h 30m)"
                value={newItem.duration}
                onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
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
              />
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addItem}
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
                onClick={() => setIsAdding(false)}
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
