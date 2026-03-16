import { useState, useEffect } from 'react';
import { Image, Grid, LayoutGrid, Heart, Download, ZoomIn, X, Camera, Calendar, MapPin } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  location?: string;
  tags: string[];
  favorite: boolean;
  aspectRatio: number;
}

const initialPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: 'Mountain Sunrise',
    date: '2026-03-10',
    location: 'Lake District',
    tags: ['nature', 'landscape', 'sunrise'],
    favorite: true,
    aspectRatio: 1.5,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519681393780-d120267933ba?w=600',
    title: 'Starry Night',
    date: '2026-03-08',
    tags: ['night', 'stars', 'sky'],
    favorite: false,
    aspectRatio: 1.5,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    title: 'Morning Fog',
    date: '2026-03-05',
    location: 'Scottish Highlands',
    tags: ['nature', 'fog', 'morning'],
    favorite: true,
    aspectRatio: 1.33,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
    title: 'Forest Path',
    date: '2026-03-01',
    tags: ['forest', 'nature', 'path'],
    favorite: false,
    aspectRatio: 1.5,
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    title: 'Urban Architecture',
    date: '2026-02-28',
    location: 'Manchester',
    tags: ['architecture', 'urban', 'city'],
    favorite: false,
    aspectRatio: 0.75,
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    title: 'Coastal View',
    date: '2026-02-25',
    location: 'Cornwall',
    tags: ['ocean', 'coast', 'nature'],
    favorite: true,
    aspectRatio: 1.5,
  },
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.photo-gallery-section');
  }, [revealRef]);

  const allTags = Array.from(new Set(photos.flatMap(p => p.tags)));
  const favoriteCount = photos.filter(p => p.favorite).length;

  const filteredPhotos = selectedTag 
    ? photos.filter(p => p.tags.includes(selectedTag))
    : photos;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  };

  return (
    <section className="photo-gallery-section" id="gallery" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Visual Memories
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Photo Gallery
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{photos.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Photos</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{favoriteCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Favorites</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{allTags.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tags</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.5rem',
              background: viewMode === 'grid' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '4px',
              color: viewMode === 'grid' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('masonry')}
            style={{
              padding: '0.5rem',
              background: viewMode === 'masonry' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '4px',
              color: viewMode === 'masonry' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <LayoutGrid size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedTag(null)}
            style={{
              padding: '0.5rem 1rem',
              background: !selectedTag ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              color: !selectedTag ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedTag === tag ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '20px',
                color: selectedTag === tag ? 'var(--bg-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textTransform: 'capitalize',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' 
          ? 'repeat(auto-fill, minmax(250px, 1fr))' 
          : 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        gridAutoRows: viewMode === 'masonry' ? '10px' : 'auto',
      }}>
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              gridRow: viewMode === 'masonry' ? `span ${Math.ceil(photo.aspectRatio * 20)}` : 'auto',
            }}
          >
            <img
              src={photo.url}
              alt={photo.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
              opacity: 0,
              transition: 'opacity 0.3s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1rem',
            }}
              className="photo-overlay"
            >
              <div style={{ color: 'white', fontWeight: 500, marginBottom: '0.25rem' }}>{photo.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                <Calendar size={12} />
                {new Date(photo.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {photo.location && (
                  <>
                    <span>•</span>
                    <MapPin size={12} />
                    {photo.location}
                  </>
                )}
              </div>
            </div>

            <button
              onClick={(e) => toggleFavorite(photo.id, e)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                color: photo.favorite ? '#e74c3c' : 'white',
                cursor: 'pointer',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
              className="favorite-btn"
            >
              <Heart size={16} fill={photo.favorite ? '#e74c3c' : 'none'} />
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <X size={24} />
          </button>

          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <div style={{ marginTop: '1rem', textAlign: 'center', color: 'white' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{selectedPhoto.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                <span><Calendar size={14} /> {new Date(selectedPhoto.date).toLocaleDateString('en-GB')}</span>
                {selectedPhoto.location && <span><MapPin size={14} /> {selectedPhoto.location}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                {selectedPhoto.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .photo-gallery-section [class*="photo-overlay"]:hover,
        .photo-gallery-section [class*="favorite-btn"]:hover {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
