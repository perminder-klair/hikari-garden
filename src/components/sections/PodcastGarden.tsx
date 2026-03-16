import { useState, useEffect } from 'react';
import { Headphones, Play, Pause, Clock, Heart, Plus, SkipForward, Volume2 } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Podcast {
  id: string;
  title: string;
  host: string;
  category: string;
  duration: number; // minutes
  progress: number; // percentage
  isPlaying: boolean;
  isLiked: boolean;
  cover?: string;
  description?: string;
  date: string;
}

const samplePodcasts: Podcast[] = [
  {
    id: '1',
    title: 'The Future of AI',
    host: 'Lex Fridman',
    category: 'Technology',
    duration: 180,
    progress: 45,
    isPlaying: false,
    isLiked: true,
    description: 'A deep dive into artificial intelligence and its implications.',
    date: '2026-03-10',
  },
  {
    id: '2',
    title: 'Building in Public',
    host: 'Indie Hackers',
    category: 'Entrepreneurship',
    duration: 45,
    progress: 100,
    isPlaying: false,
    isLiked: true,
    description: 'Stories from founders building businesses in public.',
    date: '2026-03-08',
  },
  {
    id: '3',
    title: 'The Psychology of Money',
    host: 'Naval',
    category: 'Finance',
    duration: 60,
    progress: 20,
    isPlaying: true,
    isLiked: false,
    description: 'Understanding wealth, happiness, and financial freedom.',
    date: '2026-03-11',
  },
  {
    id: '4',
    title: 'React Server Components',
    host: 'Syntax FM',
    category: 'Development',
    duration: 90,
    progress: 0,
    isPlaying: false,
    isLiked: false,
    description: 'Everything you need to know about RSC.',
    date: '2026-03-09',
  },
];

const categories = ['All', 'Technology', 'Entrepreneurship', 'Finance', 'Development', 'Health', 'Productivity'];

export default function PodcastGarden() {
  const [podcasts, setPodcasts] = useState<Podcast[]>(samplePodcasts);
  const [filter, setFilter] = useState('All');
  const [volume, setVolume] = useState(75);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.podcast-garden-section');
  }, [revealRef]);

  const filteredPodcasts = filter === 'All' 
    ? podcasts 
    : podcasts.filter(p => p.category === filter);

  const stats = {
    total: podcasts.length,
    liked: podcasts.filter(p => p.isLiked).length,
    totalHours: Math.floor(podcasts.reduce((acc, p) => acc + p.duration, 0) / 60),
    completed: podcasts.filter(p => p.progress === 100).length,
  };

  const currentlyPlaying = podcasts.find(p => p.isPlaying);

  const togglePlay = (id: string) => {
    setPodcasts(podcasts.map(p => ({
      ...p,
      isPlaying: p.id === id ? !p.isPlaying : false,
    })));
  };

  const toggleLike = (id: string) => {
    setPodcasts(podcasts.map(p => 
      p.id === id ? { ...p, isLiked: !p.isLiked } : p
    ));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <section className="podcast-garden-section" id="podcasts" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Audio Learning
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Podcast Garden
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Headphones size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Episodes</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Heart size={20} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{stats.liked}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Favorites</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Clock size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{stats.totalHours}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Time</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <SkipForward size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.completed}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</div>
        </div>
      </div>

      {/* Now Playing */}
      {currentlyPlaying && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(244, 208, 63, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Now Playing</span>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontSize: '1.2rem' }}>{currentlyPlaying.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentlyPlaying.host}</p>
            </div>
            <button
              onClick={() => togglePlay(currentlyPlaying.id)}
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--accent-gold)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {currentlyPlaying.isPlaying ? <Pause size={20} color='var(--bg-primary)' /> : <Play size={20} color='var(--bg-primary)' style={{ marginLeft: '2px' }} />}
            </button>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${currentlyPlaying.progress}%`, height: '100%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{formatDuration(Math.floor(currentlyPlaying.duration * (currentlyPlaying.progress / 100)))}</span>
            <span>{formatDuration(currentlyPlaying.duration)}</span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === cat ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Episodes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredPodcasts.map(podcast => (
          <div
            key={podcast.id}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${podcast.isPlaying ? 'rgba(244, 208, 63, 0.3)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <button
              onClick={() => togglePlay(podcast.id)}
              style={{
                width: '40px',
                height: '40px',
                background: podcast.isPlaying ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {podcast.isPlaying ? <Pause size={16} color='var(--bg-primary)' /> : <Play size={16} color='var(--text-primary)' style={{ marginLeft: '2px' }} />}
            </button>

            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{podcast.title}</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {podcast.host} • {podcast.category} • {formatDuration(podcast.duration)}
              </p>
              {podcast.progress > 0 && podcast.progress < 100 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${podcast.progress}%`, height: '100%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => toggleLike(podcast.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
            >
              <Heart size={18} fill={podcast.isLiked ? '#e74c3c' : 'transparent'} color={podcast.isLiked ? '#e74c3c' : 'var(--text-muted)'} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
