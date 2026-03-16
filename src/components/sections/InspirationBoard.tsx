import { useState, useEffect } from 'react';
import { Image, Plus, ExternalLink, Heart, Grid, LayoutGrid, Trash2, Search } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  source?: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

const initialItems: InspirationItem[] = [
  {
    id: '1',
    title: 'Japanese Garden Design',
    imageUrl: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=400',
    source: 'Unsplash',
    tags: ['design', 'nature', 'japanese'],
    favorite: true,
    createdAt: '2026-03-13',
  },
  {
    id: '2',
    title: 'Minimalist Workspace',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400',
    source: 'Unsplash',
    tags: ['workspace', 'minimal', 'productivity'],
    favorite: false,
    createdAt: '2026-03-13',
  },
  {
    id: '3',
    title: 'Golden Hour Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400',
    source: 'Unsplash',
    tags: ['architecture', 'light', 'warm'],
    favorite: true,
    createdAt: '2026-03-13',
  },
  {
    id: '4',
    title: 'Forest Path',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    source: 'Unsplash',
    tags: ['nature', 'forest', 'path'],
    favorite: false,
    createdAt: '2026-03-13',
  },
  {
    id: '5',
    title: 'Abstract Light Patterns',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400',
    source: 'Unsplash',
    tags: ['abstract', 'light', 'art'],
    favorite: false,
    createdAt: '2026-03-13',
  },
  {
    id: '6',
    title: 'Cozy Reading Nook',
    imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
    source: 'Unsplash',
    tags: ['interior', 'cozy', 'books'],
    favorite: true,
    createdAt: '2026-03-13',
  },
];

const allTags = ['design', 'nature', 'japanese', 'workspace', 'minimal', 'productivity', 'architecture', 'light', 'warm', 'forest', 'path', 'abstract', 'art', 'interior', 'cozy', 'books'];

export default function InspirationBoard() {
  const [items, setItems] = useState<InspirationItem[]>(initialItems);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InspirationItem>>({ tags: [] });
  const [newTag, setNewTag] = useState('');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.inspiration-board-section');
  }, [revealRef]);

  const filteredItems = items.filter(item => {
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addTag = () => {
    if (!newTag.trim() || newItem.tags?.includes(newTag.trim())) return;
    setNewItem({ ...newItem, tags: [...(newItem.tags || []), newTag.trim()] });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setNewItem({ ...newItem, tags: newItem.tags?.filter(t => t !== tag) || [] });
  };

  const addItem = () => {
    if (!newItem.title || !newItem.imageUrl) return;
    const item: InspirationItem = {
      id: Date.now().toString(),
      title: newItem.title,
      imageUrl: newItem.imageUrl,
      source: newItem.source,
      tags: newItem.tags || [],
      favorite: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItems([item, ...items]);
    setShowAdd(false);
    setNewItem({ tags: [] });
  };

  const favoriteCount = items.filter(i => i.favorite).length;

  return (
    <section className="inspiration-board-section" id="inspiration" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Visual Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Inspiration Board
        </h2>
      </div>

      {/* Stats & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{items.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Items</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{favoriteCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Favorites</div>
          </div>
        </div>

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
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search inspiration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
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

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' 
          ? 'repeat(auto-fill, minmax(250px, 1fr))' 
          : 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
              breakInside: 'avoid',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{
                  width: '100%',
                  height: viewMode === 'masonry' ? 'auto' : '200px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                display: 'flex',
                gap: '0.5rem',
              }}>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    borderRadius: '4px',
                    color: item.favorite ? '#e74c3c' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <Heart size={16} fill={item.favorite ? '#e74c3c' : 'none'} />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>
                {item.title}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.15rem 0.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {item.source && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={12} />
                  {item.source}
                </div>
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
              Add Inspiration
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={newItem.title || ''}
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

            <input
              type="text"
              placeholder="Image URL"
              value={newItem.imageUrl || ''}
              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
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

            <input
              type="text"
              placeholder="Source (optional)"
              value={newItem.source || ''}
              onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
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

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  onClick={addTag}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--accent-gold)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--bg-primary)',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {newItem.tags?.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(244, 208, 63, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--accent-gold)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

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
