import { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Clock, Star, Plus, Check, Play, Pause } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Game {
  id: string;
  title: string;
  platform: string;
  status: 'playing' | 'completed' | 'backlog' | 'dropped';
  rating?: number;
  hoursPlayed: number;
  totalHours?: number;
  genre: string[];
  cover?: string;
  startedAt?: string;
  completedAt?: string;
}

const platforms = ['Steam Deck', 'Xbox', 'PC', 'Switch', 'PS5'];
const genres = ['RPG', 'Action', 'Strategy', 'Indie', 'Racing', 'Sports', 'Adventure'];

const initialGames: Game[] = [
  { id: '1', title: 'Elden Ring', platform: 'Steam Deck', status: 'playing', hoursPlayed: 45, totalHours: 80, genre: ['RPG', 'Action'], startedAt: '2026-02-15' },
  { id: '2', title: 'Hades', platform: 'Steam Deck', status: 'completed', rating: 5, hoursPlayed: 35, genre: ['Action', 'Indie'], completedAt: '2026-01-20' },
  { id: '3', title: 'Forza Horizon 5', platform: 'Xbox', status: 'playing', hoursPlayed: 25, genre: ['Racing'], startedAt: '2026-03-01' },
  { id: '4', title: 'Baldur\'s Gate 3', platform: 'PC', status: 'backlog', hoursPlayed: 0, totalHours: 100, genre: ['RPG', 'Strategy'] },
  { id: '5', title: 'Hollow Knight', platform: 'Steam Deck', status: 'completed', rating: 5, hoursPlayed: 28, genre: ['Indie', 'Action'], completedAt: '2025-12-10' },
];

export default function GamingShelf() {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [filter, setFilter] = useState<Game['status'] | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newGame, setNewGame] = useState<Partial<Game>>({ genre: [] });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.gaming-shelf-section');
  }, [revealRef]);

  const filteredGames = filter === 'all' ? games : games.filter(g => g.status === filter);

  const stats = {
    total: games.length,
    playing: games.filter(g => g.status === 'playing').length,
    completed: games.filter(g => g.status === 'completed').length,
    backlog: games.filter(g => g.status === 'backlog').length,
    totalHours: games.reduce((acc, g) => acc + g.hoursPlayed, 0),
  };

  const addGame = () => {
    if (!newGame.title) return;
    const game: Game = {
      id: Date.now().toString(),
      title: newGame.title,
      platform: newGame.platform || 'Steam Deck',
      status: newGame.status || 'backlog',
      hoursPlayed: 0,
      totalHours: newGame.totalHours,
      genre: newGame.genre || [],
      startedAt: newGame.status === 'playing' ? new Date().toISOString().split('T')[0] : undefined,
    };
    setGames([game, ...games]);
    setShowAdd(false);
    setNewGame({ genre: [] });
  };

  const updateStatus = (id: string, status: Game['status']) => {
    setGames(games.map(g => {
      if (g.id !== id) return g;
      const updates: Partial<Game> = { status };
      if (status === 'playing' && !g.startedAt) updates.startedAt = new Date().toISOString().split('T')[0];
      if (status === 'completed') updates.completedAt = new Date().toISOString().split('T')[0];
      return { ...g, ...updates };
    }));
  };

  const statusColors = {
    playing: '#3498db',
    completed: '#2ecc71',
    backlog: '#9b59b6',
    dropped: '#7f8c8d',
  };

  return (
    <section className="gaming-shelf-section" id="gaming" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Digital Entertainment
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Gaming Shelf
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Gamepad2 size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Games</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Play size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.playing}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Playing</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Trophy size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.completed}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Clock size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{stats.totalHours}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hours Played</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['all', 'playing', 'completed', 'backlog'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === s ? (s === 'all' ? 'var(--accent-gold)' : statusColors[s]) : 'transparent',
              border: `1px solid ${filter === s ? (s === 'all' ? 'var(--accent-gold)' : statusColors[s]) : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === s ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add Game
        </button>
      </div>

      {/* Games Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredGames.map(game => (
          <div
            key={game.id}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${statusColors[game.status]}30`,
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{game.title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{game.platform}</span>
              </div>
              <span style={{
                padding: '0.25rem 0.5rem',
                background: `${statusColors[game.status]}20`,
                color: statusColors[game.status],
                borderRadius: '4px',
                fontSize: '0.7rem',
                textTransform: 'capitalize',
              }}>
                {game.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
              {game.genre.map(g => (
                <span key={g} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                  {g}
                </span>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Progress</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {game.hoursPlayed}{game.totalHours ? `/${game.totalHours}` : ''}h
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: game.totalHours ? `${(game.hoursPlayed / game.totalHours) * 100}%` : '0%',
                  height: '100%',
                  background: statusColors[game.status],
                  borderRadius: '3px',
                }} />
              </div>
            </div>

            {game.rating && (
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < game.rating! ? '#f39c12' : 'transparent'} color={i < game.rating! ? '#f39c12' : 'rgba(255,255,255,0.2)'} />
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {game.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(game.id, game.status === 'playing' ? 'completed' : 'playing')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: game.status === 'playing' ? '#2ecc71' : '#3498db',
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
                  {game.status === 'playing' ? <Check size={12} /> : <Play size={12} />}
                  {game.status === 'playing' ? 'Complete' : 'Start'}
                </button>
              )}
            </div>
          </div>
        ))}
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
              Add Game
            </h3>

            <input
              type="text"
              placeholder="Game title"
              value={newGame.title || ''}
              onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
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
              value={newGame.platform}
              onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
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
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select
              value={newGame.status}
              onChange={(e) => setNewGame({ ...newGame, status: e.target.value as Game['status'] })}
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
              <option value="backlog">Backlog</option>
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
            </select>

            <input
              type="number"
              placeholder="Est. hours to complete"
              value={newGame.totalHours || ''}
              onChange={(e) => setNewGame({ ...newGame, totalHours: parseInt(e.target.value) })}
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addGame}
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
