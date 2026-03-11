import { useState } from 'react';
import { MapPin, Calendar, Camera, Compass } from 'lucide-react';

interface TravelEntry {
  id: string;
  location: string;
  country: string;
  date: string;
  type: 'visited' | 'lived' | 'want';
  memories: string[];
  coordinates: { lat: number; lng: number };
}

const travelEntries: TravelEntry[] = [
  {
    id: '1',
    location: 'Birmingham',
    country: 'UK',
    date: '2020-present',
    type: 'lived',
    memories: ['Home base', 'PureGym sessions', 'Rainy walks'],
    coordinates: { lat: 52.4862, lng: -1.8904 },
  },
  {
    id: '2',
    location: 'Manchester',
    country: 'UK',
    date: '2023-2024',
    type: 'lived',
    memories: ['Fizzy office', 'Northern Quarter', 'Canal walks'],
    coordinates: { lat: 53.4808, lng: -2.2426 },
  },
  {
    id: '3',
    location: 'Tokyo',
    country: 'Japan',
    date: '2019',
    type: 'visited',
    memories: ['Shibuya crossing', 'Ramen shops', 'Temples at dawn'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    id: '4',
    location: 'Kyoto',
    country: 'Japan',
    date: '2019',
    type: 'visited',
    memories: ['Bamboo forest', 'Tea ceremony', 'Golden Pavilion'],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    id: '5',
    location: 'Amritsar',
    country: 'India',
    date: '2018',
    type: 'visited',
    memories: ['Golden Temple', 'Langar hall', 'Border ceremony'],
    coordinates: { lat: 31.6340, lng: 74.8723 },
  },
  {
    id: '6',
    location: 'Osaka',
    country: 'Japan',
    date: 'future',
    type: 'want',
    memories: ['Street food', 'Dotonbori', 'Castle grounds'],
    coordinates: { lat: 34.6937, lng: 135.5023 },
  },
];

const typeColors = {
  visited: '#f4d03f',
  lived: '#2ecc71',
  want: '#9b59b6',
};

const typeLabels = {
  visited: 'Visited',
  lived: 'Lived',
  want: 'Want to Visit',
};

export default function TravelLog() {
  const [selectedEntry, setSelectedEntry] = useState<TravelEntry | null>(null);
  const [filter, setFilter] = useState<'all' | 'visited' | 'lived' | 'want'>('all');

  const filteredEntries = travelEntries.filter(entry => 
    filter === 'all' || entry.type === filter
  );

  return (
    <section className="travel-section" id="travel" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Wanderlust Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Travel Log
        </h2>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {(['all', 'visited', 'lived', 'want'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem',
              background: filter === f ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {f === 'all' ? 'All Places' : typeLabels[f]}
          </button>
        ))}
      </div>

      {/* Map Visualization */}
      <div style={{ 
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Compass size={48} style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {filteredEntries.length} places on the journey
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
                {travelEntries.filter(e => e.type === 'visited').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Visited</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>
                {travelEntries.filter(e => e.type === 'lived').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lived</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>
                {travelEntries.filter(e => e.type === 'want').length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bucket List</div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = typeColors[entry.type];
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '4px', 
              height: '100%', 
              background: typeColors[entry.type] 
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                  {entry.location}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{entry.country}</span>
              </div>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.25rem 0.5rem',
                background: `${typeColors[entry.type]}20`,
                color: typeColors[entry.type],
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {typeLabels[entry.type]}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.date}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {entry.memories.slice(0, 2).map((memory, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Camera size={10} />
                  {memory}
                </span>
              ))}
              {entry.memories.length > 2 && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.25rem' }}>
                  +{entry.memories.length - 2} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
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
          onClick={() => setSelectedEntry(null)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${typeColors[selectedEntry.type]}40`,
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
                  {selectedEntry.location}
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedEntry.country}</span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MapPin size={16} style={{ color: typeColors[selectedEntry.type] }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {selectedEntry.coordinates.lat.toFixed(4)}, {selectedEntry.coordinates.lng.toFixed(4)}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Memories
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedEntry.memories.map((memory, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Camera size={14} style={{ color: 'var(--accent-gold)' }} />
                    {memory}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem',
                background: `${typeColors[selectedEntry.type]}20`,
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: typeColors[selectedEntry.type],
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {typeLabels[selectedEntry.type]}
              </span>
              <span style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}>
                {selectedEntry.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
