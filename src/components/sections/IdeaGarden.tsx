import { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Brain, Zap, Tag, Clock, Trash2, Archive } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Idea {
  id: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  status: 'seed' | 'sprouting' | 'growing' | 'blooming' | 'archived';
  connections: number;
}

const initialIdeas: Idea[] = [
  {
    id: '1',
    content: 'AI-powered habit tracker that learns your patterns and suggests optimal times for activities',
    category: 'App Ideas',
    tags: ['AI', 'Productivity', 'Health'],
    createdAt: '2026-03-10',
    status: 'growing',
    connections: 3,
  },
  {
    id: '2',
    content: 'Digital garden but for code snippets - a living documentation system',
    category: 'Dev Tools',
    tags: ['Documentation', 'Knowledge Management'],
    createdAt: '2026-03-08',
    status: 'blooming',
    connections: 5,
  },
  {
    id: '3',
    content: 'Browser extension that summarizes articles and adds them to your reading list',
    category: 'Browser Extensions',
    tags: ['AI', 'Reading', 'Productivity'],
    createdAt: '2026-03-05',
    status: 'sprouting',
    connections: 2,
  },
  {
    id: '4',
    content: 'Meditation app with binaural beats generated based on your current stress level',
    category: 'Wellness',
    tags: ['Meditation', 'Audio', 'Health'],
    createdAt: '2026-03-01',
    status: 'seed',
    connections: 1,
  },
  {
    id: '5',
    content: 'Personal API that aggregates all your data from different services',
    category: 'Dev Tools',
    tags: ['API', 'Data', 'Integration'],
    createdAt: '2026-02-28',
    status: 'growing',
    connections: 4,
  },
];

const categories = ['All', 'App Ideas', 'Dev Tools', 'Browser Extensions', 'Wellness', 'Writing'];

const statusConfig = {
  seed: { label: 'Seed', color: '#95a5a6', icon: Lightbulb },
  sprouting: { label: 'Sprouting', color: '#f39c12', icon: Sparkles },
  growing: { label: 'Growing', color: '#3498db', icon: Brain },
  blooming: { label: 'Blooming', color: '#2ecc71', icon: Zap },
  archived: { label: 'Archived', color: '#7f8c8d', icon: Archive },
};

export default function IdeaGarden() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newIdea, setNewIdea] = useState({ content: '', category: 'App Ideas', tags: '' });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.idea-garden-section');
  }, [revealRef]);

  const filteredIdeas = filter === 'All' ? ideas : ideas.filter(i => i.category === filter);

  const stats = {
    total: ideas.length,
    active: ideas.filter(i => i.status !== 'archived').length,
    blooming: ideas.filter(i => i.status === 'blooming').length,
    connections: ideas.reduce((acc, i) => acc + i.connections, 0),
  };

  const addIdea = () => {
    if (!newIdea.content) return;
    const idea: Idea = {
      id: Date.now().toString(),
      content: newIdea.content,
      category: newIdea.category,
      tags: newIdea.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'seed',
      connections: 0,
    };
    setIdeas([idea, ...ideas]);
    setIsAdding(false);
    setNewIdea({ content: '', category: 'App Ideas', tags: '' });
  };

  const updateStatus = (id: string, status: Idea['status']) => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, status } : i));
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  return (
    <section className="idea-garden-section" id="ideas" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Creative Cultivation
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Idea Garden
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Lightbulb size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Ideas</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.active}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.blooming}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Blooming</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{stats.connections}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Connections</span>
        </div>
      </div>

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

      {/* Add Idea Button */}
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
          }}
        >
          Plant New Idea
        </button>
      </div>

      {/* Ideas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredIdeas.map(idea => {
          const config = statusConfig[idea.status];
          const Icon = config.icon;
          
          return (
            <div
              key={idea.id}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${idea.status === 'blooming' ? '#2ecc7130' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${config.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  background: `${config.color}20`,
                  borderRadius: '4px',
                  color: config.color,
                  fontSize: '0.75rem',
                }}>
                  <Icon size={12} />
                  {config.label}
                </div>
                <button
                  onClick={() => deleteIdea(idea.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {idea.content}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                {idea.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', background: 'rgba(244, 208, 63, 0.1)', color: 'var(--accent-gold)', borderRadius: '4px' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                
                <select
                  value={idea.status}
                  onChange={(e) => updateStatus(idea.id, e.target.value as Idea['status'])}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Idea Modal */}
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
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Plant New Idea
            </h3>

            <textarea
              placeholder="What's your idea?"
              value={newIdea.content}
              onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                resize: 'vertical',
              }}
            />

            <select
              value={newIdea.category}
              onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newIdea.tags}
              onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addIdea}
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
                Plant Idea
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
