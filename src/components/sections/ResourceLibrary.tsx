import { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, Folder, Search, Filter, Star, Trash2, Plus } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link' | 'other';
  size?: string;
  url: string;
  category: string;
  tags: string[];
  favorite: boolean;
  addedAt: string;
  downloaded?: boolean;
}

const initialResources: Resource[] = [
  {
    id: '1',
    title: 'React Best Practices Guide',
    type: 'pdf',
    size: '2.4 MB',
    url: '#',
    category: 'Development',
    tags: ['react', 'guide', 'reference'],
    favorite: true,
    addedAt: '2026-03-12',
    downloaded: true,
  },
  {
    id: '2',
    title: 'Design System Components',
    type: 'link',
    url: 'https://example.com/design-system',
    category: 'Design',
    tags: ['design', 'components', 'ui'],
    favorite: false,
    addedAt: '2026-03-11',
  },
  {
    id: '3',
    title: 'Project Architecture Diagram',
    type: 'image',
    size: '1.8 MB',
    url: '#',
    category: 'Documentation',
    tags: ['architecture', 'diagram'],
    favorite: true,
    addedAt: '2026-03-10',
    downloaded: true,
  },
  {
    id: '4',
    title: 'API Documentation',
    type: 'link',
    url: 'https://api.docs.example.com',
    category: 'Development',
    tags: ['api', 'docs', 'reference'],
    favorite: false,
    addedAt: '2026-03-09',
  },
  {
    id: '5',
    title: 'Meeting Notes - March',
    type: 'doc',
    size: '156 KB',
    url: '#',
    category: 'Notes',
    tags: ['meeting', 'notes'],
    favorite: false,
    addedAt: '2026-03-08',
    downloaded: true,
  },
];

const categories = ['All', 'Development', 'Design', 'Documentation', 'Notes', 'Personal'];

const typeIcons: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  image: '🖼️',
  video: '🎬',
  link: '🔗',
  other: '📎',
};

const typeColors: Record<string, string> = {
  pdf: '#e74c3c',
  doc: '#3498db',
  image: '#2ecc71',
  video: '#9b59b6',
  link: '#f39c12',
  other: '#95a5a6',
};

export default function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.resource-library-section');
  }, [revealRef]);

  const filteredResources = resources.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, favorite: !r.favorite } : r
    ));
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const favoriteCount = resources.filter(r => r.favorite).length;
  const downloadedCount = resources.filter(r => r.downloaded).length;

  return (
    <section className="resource-library-section" id="resources" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Digital Archive
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Resource Library
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{resources.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Resources</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{favoriteCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Favorites</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{downloadedCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Downloaded</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search resources..."
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
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.5rem',
              background: viewMode === 'list' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '4px',
              color: viewMode === 'list' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Grid/List */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: viewMode === 'grid' ? '1.25rem' : '1rem',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: viewMode === 'grid' ? 'column' : 'row',
              alignItems: viewMode === 'grid' ? 'flex-start' : 'center',
              gap: viewMode === 'grid' ? '0.75rem' : '1rem',
            }}
          >
            <div style={{
              width: viewMode === 'grid' ? '48px' : '40px',
              height: viewMode === 'grid' ? '48px' : '40px',
              borderRadius: '8px',
              background: `${typeColors[resource.type]}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: viewMode === 'grid' ? '1.5rem' : '1.25rem',
            }}>
              {typeIcons[resource.type]}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                color: 'var(--text-primary)', 
                fontWeight: 500, 
                marginBottom: '0.25rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {resource.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ 
                  padding: '0.1rem 0.4rem', 
                  background: `${typeColors[resource.type]}20`, 
                  borderRadius: '4px',
                  color: typeColors[resource.type],
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                }}>
                  {resource.type}
                </span>
                {resource.size && <span>{resource.size}</span>}
                <span>• {resource.addedAt}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {resource.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '0.15rem 0.4rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: viewMode === 'grid' ? 0 : 'auto' }}>
              <button
                onClick={() => toggleFavorite(resource.id)}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: resource.favorite ? '#f39c12' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <Star size={16} fill={resource.favorite ? '#f39c12' : 'none'} />
              </button>
              <button
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {resource.type === 'link' ? <ExternalLink size={16} /> : <Download size={16} />}
              </button>
              <button
                onClick={() => deleteResource(resource.id)}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#e74c3c',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
