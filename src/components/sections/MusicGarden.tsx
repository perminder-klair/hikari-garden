import { useState, useEffect } from 'react';
import { Music, Disc, Headphones, Heart, Play, Pause, SkipForward, SkipBack, Volume2, ListMusic } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  liked: boolean;
  plays: number;
}

interface Playlist {
  id: string;
  name: string;
  tracks: number;
  cover: string;
}

const currentTrack: Track = {
  id: '1',
  title: 'Levels',
  artist: 'Sidhu Moose Wala',
  album: 'Moosetape',
  duration: '3:45',
  liked: true,
  plays: 127,
};

const recentTracks: Track[] = [
  { id: '2', title: '295', artist: 'Sidhu Moose Wala', album: 'Moosetape', duration: '4:12', liked: true, plays: 89 },
  { id: '3', title: 'Same Beef', artist: 'Bohemia', album: 'Single', duration: '3:28', liked: false, plays: 45 },
  { id: '4', title: 'Lifestyle', artist: 'Amrit Maan', album: 'All Bamb', duration: '3:15', liked: true, plays: 67 },
  { id: '5', title: 'Bambiha Bole', artist: 'Amrit Maan', album: 'Single', duration: '3:52', liked: false, plays: 34 },
];

const playlists: Playlist[] = [
  { id: '1', name: 'Punjabi Hip-Hop', tracks: 45, cover: '🎤' },
  { id: '2', name: 'Workout Mix', tracks: 32, cover: '💪' },
  { id: '3', name: 'Focus Flow', tracks: 28, cover: '🧘' },
  { id: '4', name: 'Late Night', tracks: 56, cover: '🌙' },
];

const topArtists = [
  { name: 'Sidhu Moose Wala', plays: 1247, emoji: '👑' },
  { name: 'Diljit Dosanjh', plays: 892, emoji: '🎵' },
  { name: 'Amrit Maan', plays: 654, emoji: '🔥' },
  { name: 'Bohemia', plays: 521, emoji: '🎤' },
];

export default function MusicGarden() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [liked, setLiked] = useState(currentTrack.liked);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.music-garden-section');
  }, [revealRef]);

  const totalListeningTime = 2847; // minutes
  const hours = Math.floor(totalListeningTime / 60);

  return (
    <section className="music-garden-section" id="music" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Sonic Sanctuary
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Music Garden
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Headphones size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
              {hours}h
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>This Month</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>
            156
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Liked Songs</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>
            12
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Playlists</span>
        </div>
      </div>

      {/* Now Playing */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(244, 208, 63, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(244, 208, 63, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              <Disc size={28} style={{ color: 'var(--accent-gold)', animation: isPlaying ? 'spin 3s linear infinite' : 'none' }} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
                {currentTrack.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {currentTrack.artist} • {currentTrack.album}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          >
            <Heart size={20} fill={liked ? '#e74c3c' : 'transparent'} color={liked ? '#e74c3c' : 'var(--text-muted)'} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '1rem' }}>
          <div style={{ width: '45%', height: '100%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1:42</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
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
              {isPlaying ? <Pause size={20} color='var(--bg-primary)' /> : <Play size={20} color='var(--bg-primary)' style={{ marginLeft: '2px' }} />}
            </button>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <SkipForward size={20} />
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentTrack.duration}</span>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <Volume2 size={14} color='var(--text-muted)' />
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
            <div style={{ width: `${volume}%`, height: '100%', background: 'var(--text-muted)', borderRadius: '2px' }} />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Tracks */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Music size={18} />
            Recently Played
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentTracks.map((track, i) => (
              <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '20px' }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{track.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{track.artist}</div>
                </div>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  <Heart size={14} fill={track.liked ? '#e74c3c' : 'transparent'} color={track.liked ? '#e74c3c' : 'var(--text-muted)'} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artists */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ListMusic size={18} />
            Top Artists
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topArtists.map((artist, i) => (
              <div key={artist.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{artist.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{artist.name}</div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.25rem' }}>
                    <div style={{ width: `${(artist.plays / 1247) * 100}%`, height: '100%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{artist.plays} plays</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Playlists */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Your Playlists
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{playlist.cover}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{playlist.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{playlist.tracks} tracks</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
