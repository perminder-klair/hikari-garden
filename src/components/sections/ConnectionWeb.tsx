import { useState, useEffect } from 'react';
import { Users, Link2, MessageCircle, Calendar, ArrowUpRight, Plus, X } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Connection {
  id: string;
  name: string;
  role: string;
  lastContact: string;
  strength: number; // 1-5
  tags: string[];
  notes: string;
  nextAction?: string;
}

const initialConnections: Connection[] = [
  { id: '1', name: 'Alex Chen', role: 'Tech Lead @ Startup', lastContact: '2026-03-08', strength: 4, tags: ['work', 'mentor'], notes: 'Great for architecture advice', nextAction: 'Share new article on microservices' },
  { id: '2', name: 'Sarah Miller', role: 'Product Designer', lastContact: '2026-03-05', strength: 3, tags: ['design', 'collab'], notes: 'Working on UI system together', nextAction: 'Schedule design review' },
  { id: '3', name: 'James Park', role: 'Open Source Maintainer', lastContact: '2026-02-28', strength: 5, tags: ['oss', 'friend'], notes: 'Met at ReactConf', nextAction: 'Coffee catch-up' },
  { id: '4', name: 'Emma Wilson', role: 'Engineering Manager', lastContact: '2026-03-10', strength: 4, tags: ['work', 'career'], notes: 'Potential referral for new role', nextAction: 'Send portfolio update' },
  { id: '5', name: 'David Kim', role: 'Indie Hacker', lastContact: '2026-03-01', strength: 3, tags: ['side-project', 'friend'], notes: 'Building similar tools', nextAction: 'Beta test his new app' },
];

const strengthLabels = ['Dormant', 'Weak', 'Casual', 'Strong', 'Vital'];
const strengthColors = ['#95a5a6', '#e74c3c', '#f39c12', '#3498db', '#2ecc71'];

export default function ConnectionWeb() {
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [filter, setFilter] = useState<string>('all');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.connection-web-section');
  }, [revealRef]);

  const filteredConnections = filter === 'all' 
    ? connections 
    : connections.filter(c => c.tags.includes(filter));

  const allTags = Array.from(new Set(connections.flatMap(c => c.tags)));
  
  const stats = {
    total: connections.length,
    vital: connections.filter(c => c.strength === 5).length,
    needAttention: connections.filter(c => {
      const daysSince = Math.floor((Date.now() - new Date(c.lastContact).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 30;
    }).length,
    avgStrength: (connections.reduce((acc, c) => acc + c.strength, 0) / connections.length).toFixed(1),
  };

  const getDaysSince = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
  };

  return (
    <section className="connection-web-section" id="connections" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Social Ecosystem
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Connection Web
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Users size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Connections</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.vital}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vital</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{stats.needAttention}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Need Attention</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.avgStrength}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Strength</span>
        </div>
      </div>

      {/* Filter Tags */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.5rem 1rem',
            background: filter === 'all' ? 'var(--accent-gold)' : 'transparent',
            border: `1px solid ${filter === 'all' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            color: filter === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === tag ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter === tag ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === tag ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Connections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredConnections.map(connection => (
          <div
            key={connection.id}
            onClick={() => setSelectedConnection(connection)}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${connection.strength >= 4 ? strengthColors[connection.strength - 1] : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${strengthColors[connection.strength - 1]}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {connection.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{connection.role}</span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `${strengthColors[connection.strength - 1]}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                color: strengthColors[connection.strength - 1],
                fontWeight: 'bold',
              }}>
                {connection.strength}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {connection.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.65rem',
                  padding: '0.2rem 0.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                  textTransform: 'capitalize',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={12} />
                {getDaysSince(connection.lastContact)}
              </span>
              {connection.nextAction && (
                <span style={{ color: 'var(--accent-gold)' }}>{connection.nextAction}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedConnection && (
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
          onClick={() => setSelectedConnection(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {selectedConnection.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedConnection.role}</span>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Connection Strength</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '8px',
                      background: i < selectedConnection.strength ? strengthColors[selectedConnection.strength - 1] : 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: strengthColors[selectedConnection.strength - 1], marginTop: '0.5rem', display: 'block' }}>
                {strengthLabels[selectedConnection.strength - 1]}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Notes</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedConnection.notes}</p>
            </div>

            {selectedConnection.nextAction && (
              <div style={{ background: 'rgba(244, 208, 63, 0.05)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(244, 208, 63, 0.2)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', display: 'block', marginBottom: '0.25rem' }}>Next Action</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedConnection.nextAction}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--accent-gold)',
                border: 'none',
                borderRadius: '4px',
                color: 'var(--bg-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <MessageCircle size={16} />
                Message
              </button>
              <button style={{
                flex: 1,
                padding: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <Calendar size={16} />
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
