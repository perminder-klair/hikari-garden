import { useState, useEffect } from 'react';
import { Wrench, Star, ExternalLink, Plus, Trash2, Folder, Tag } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  rating: number;
  tags: string[];
  added: string;
}

const categories = ['Development', 'Design', 'Productivity', 'AI', 'Utilities', 'Entertainment'];

const initialTools: Tool[] = [
  {
    id: '1',
    name: 'Cursor',
    category: 'Development',
    description: 'AI-powered code editor with intelligent completions.',
    url: 'https://cursor.sh',
    rating: 5,
    tags: ['editor', 'ai', 'coding'],
    added: '2025-12-01',
  },
  {
    id: '2',
    name: 'Figma',
    category: 'Design',
    description: 'Collaborative interface design tool.',
    url: 'https://figma.com',
    rating: 5,
    tags: ['design', 'ui', 'collaboration'],
    added: '2025-06-15',
  },
  {
    id: '3',
    name: 'Obsidian',
    category: 'Productivity',
    description: 'Knowledge base that works on local Markdown files.',
    url: 'https://obsidian.md',
    rating: 4,
    tags: ['notes', 'knowledge', 'markdown'],
    added: '2025-08-20',
  },
  {
    id: '4',
    name: 'Claude',
    category: 'AI',
    description: 'Anthropic\'s AI assistant for complex tasks.',
    url: 'https://claude.ai',
    rating: 5,
    tags: ['ai', 'assistant', 'productivity'],
    added: '2026-01-10',
  },
  {
    id: '5',
    name: 'Raycast',
    category: 'Utilities',
    description: 'Blazingly fast, totally extendable launcher.',
    url: 'https://raycast.com',
    rating: 5,
    tags: ['launcher', 'macos', 'productivity'],
    added: '2025-09-05',
  },
];

export default function ToolShed() {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    category: 'Development',
    rating: 4,
    tags: [],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.tool-shed-section');
  }, [revealRef]);

  const filteredTools = filter === 'All' 
    ? tools 
    : tools.filter(t => t.category === filter);

  const addTool = () => {
    if (!newTool.name) return;
    const tool: Tool = {
      id: Date.now().toString(),
      name: newTool.name,
      category: newTool.category || 'Development',
      description: newTool.description || '',
      url: newTool.url,
      rating: newTool.rating || 4,
      tags: newTool.tags || [],
      added: new Date().toISOString().split('T')[0],
    };
    setTools([tool, ...tools]);
    setShowAdd(false);
    setNewTool({ category: 'Development', rating: 4, tags: [] });
  };

  const deleteTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const categoryColors: Record<string, string> = {
    Development: '#3498db',
    Design: '#9b59b6',
    Productivity: '#2ecc71',
    AI: '#e74c3c',
    Utilities: '#f39c12',
    Entertainment: '#e67e22',
  };

  return (
    <section className="tool-shed-section" id="tools" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Digital Arsenal
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Tool Shed
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Wrench size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{tools.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tools</div>
        </div>
        {categories.slice(0, 4).map(cat => (
          <div key={cat} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', color: categoryColors[cat], fontFamily: 'Cormorant Garamond, serif' }}>{tools.filter(t => t.category === cat).length}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{cat}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('All')}
          style={{
            padding: '0.5rem 1rem',
            background: filter === 'All' ? 'var(--accent-gold)' : 'transparent',
            border: `1px solid ${filter === 'All' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            color: filter === 'All' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === cat ? categoryColors[cat] : 'transparent',
              border: `1px solid ${filter === cat ? categoryColors[cat] : 'rgba(255,255,255,0.1)'}`,
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
          Add Tool
        </button>
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${categoryColors[tool.category]}20`,
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{tool.name}</h3>
                  {tool.url && (
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: categoryColors[tool.category] }}>{tool.category}</span>
              </div>
              <button
                onClick={() => deleteTool(tool.id)}
                style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.25rem' }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{tool.description}</p>

            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < tool.rating ? '#f39c12' : 'transparent'} color={i < tool.rating ? '#f39c12' : 'rgba(255,255,255,0.2)'} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tool.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                  #{tag}
                </span>
              ))}
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
              Add Tool
            </h3>

            <input
              type="text"
              placeholder="Tool name"
              value={newTool.name || ''}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
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
              value={newTool.category}
              onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
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
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input
              type="text"
              placeholder="Description"
              value={newTool.description || ''}
              onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
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
              placeholder="URL (optional)"
              value={newTool.url || ''}
              onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
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
                onClick={addTool}
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
                Add Tool
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
