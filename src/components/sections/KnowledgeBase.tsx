import { useState, useEffect } from 'react';
import { Brain, Search, Plus, Trash2, Tag, ExternalLink, BookOpen, Lightbulb, FileText, Link2 } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created: string;
  updated: string;
  source?: string;
}

const categories = [
  { name: 'Concept', icon: '💡', color: '#f39c12' },
  { name: 'Tutorial', icon: '📚', color: '#3498db' },
  { name: 'Snippet', icon: '💻', color: '#2ecc71' },
  { name: 'Reference', icon: '📖', color: '#9b59b6' },
  { name: 'Idea', icon: '✨', color: '#e74c3c' },
];

const initialItems: KnowledgeItem[] = [
  {
    id: '1',
    title: 'React useEffect Dependencies',
    content: 'Always include all dependencies in the dependency array. Use eslint-plugin-react-hooks to catch missing dependencies.',
    category: 'Concept',
    tags: ['react', 'hooks', 'best-practices'],
    created: '2026-03-10',
    updated: '2026-03-10',
    source: 'https://react.dev',
  },
  {
    id: '2',
    title: 'Docker Multi-stage Builds',
    content: 'Use multi-stage builds to reduce final image size. Build in one stage, copy only necessary artifacts to final stage.',
    category: 'Tutorial',
    tags: ['docker', 'devops', 'optimization'],
    created: '2026-03-08',
    updated: '2026-03-08',
  },
  {
    id: '3',
    title: 'TypeScript Utility Types',
    content: 'Pick, Omit, Partial, Required, Record, ReturnType - master these for cleaner code.',
    category: 'Reference',
    tags: ['typescript', 'types'],
    created: '2026-03-05',
    updated: '2026-03-12',
  },
  {
    id: '4',
    title: 'AI Agent Architecture',
    content: 'Consider: context window management, tool calling, memory systems, and error recovery.',
    category: 'Idea',
    tags: ['ai', 'architecture', 'design'],
    created: '2026-03-01',
    updated: '2026-03-01',
  },
];

export default function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<KnowledgeItem>>({
    category: 'Concept',
    tags: [],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.knowledge-base-section');
  }, [revealRef]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allTags = [...new Set(items.flatMap(i => i.tags))];

  const addItem = () => {
    if (!newItem.title || !newItem.content) return;
    const item: KnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      category: newItem.category || 'Concept',
      tags: newItem.tags || [],
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      source: newItem.source,
    };
    setItems([item, ...items]);
    setShowAdd(false);
    setNewItem({ category: 'Concept', tags: [] });
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const categoryCount = (cat: string) => items.filter(i => i.category === cat).length;

  return (
    <section className="knowledge-base-section" id="knowledge" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Second Brain
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Knowledge Base
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Brain size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{items.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Notes</div>
        </div>
        {categories.slice(0, 4).map(cat => (
          <div key={cat.name} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem' }}>{cat.icon}</div>
            <div style={{ fontSize: '1rem', color: cat.color, fontFamily: 'Cormorant Garamond, serif' }}>{categoryCount(cat.name)}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--bg-secondary)',
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

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('All')}
          style={{
            padding: '0.5rem 1rem',
            background: selectedCategory === 'All' ? 'var(--accent-gold)' : 'transparent',
            border: `1px solid ${selectedCategory === 'All' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            color: selectedCategory === 'All' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === cat.name ? cat.color : 'transparent',
              border: `1px solid ${selectedCategory === cat.name ? cat.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: selectedCategory === cat.name ? 'white' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredItems.map(item => {
          const cat = categories.find(c => c.name === item.category);
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${cat?.color}20`,
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{cat?.icon}</span>
                  <span style={{ fontSize: '0.75rem', color: cat?.color, padding: '0.2rem 0.5rem', background: `${cat?.color}20`, borderRadius: '4px' }}>{item.category}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                  style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.title}</h3>
              
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {item.source && (
                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-gold)' }}
                >
                  <ExternalLink size={12} />
                  Source
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* View Modal */}
      {selectedItem && (
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
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{categories.find(c => c.name === selectedItem.category)?.icon}</span>
                  <span style={{ fontSize: '0.8rem', color: categories.find(c => c.name === selectedItem.category)?.color, padding: '0.2rem 0.5rem', background: `${categories.find(c => c.name === selectedItem.category)?.color}20`, borderRadius: '4px' }}>{selectedItem.category}</span>
                </div>
                <h2 style={{ margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'var(--text-primary)' }}>{selectedItem.title}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                ×
              </button>
            </div>

            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
              {selectedItem.content}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {selectedItem.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderRadius: '4px' }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Created: {selectedItem.created} | Updated: {selectedItem.updated}
              </div>
              
              {selectedItem.source && (
                <a
                  href={selectedItem.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--accent-gold)' }}
                >
                  <ExternalLink size={14} />
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Add Knowledge
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

            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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
              {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>

            <textarea
              placeholder="Content..."
              value={newItem.content || ''}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                minHeight: '120px',
                resize: 'vertical',
              }}
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newItem.tags?.join(', ') || ''}
              onChange={(e) => setNewItem({ ...newItem, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
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
              placeholder="Source URL (optional)"
              value={newItem.source || ''}
              onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
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
