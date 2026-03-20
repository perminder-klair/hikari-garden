import { useState, useEffect } from 'react';
import { Scale, CheckCircle2, XCircle, ArrowRight, Filter, Circle } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Decision {
  id: string;
  title: string;
  context: string;
  options: string[];
  chosenOption: number;
  reasoning: string;
  date: string;
  status: 'pending' | 'made' | 'reversed';
  outcome?: string;
  category: string;
}

const initialDecisions: Decision[] = [
  {
    id: '1',
    title: 'Switch to Neovim',
    context: 'VS Code was getting slow with large TypeScript projects',
    options: ['Stay with VS Code', 'Switch to Neovim', 'Try Zed'],
    chosenOption: 1,
    reasoning: 'Wanted more control and speed. The learning curve is worth the long-term efficiency gains.',
    date: '2026-01-15',
    status: 'made',
    outcome: 'Productivity increased after 2 weeks of adjustment. Custom config is now essential.',
    category: 'Tools',
  },
  {
    id: '2',
    title: 'Homelab Investment',
    context: 'Growing need for self-hosted services and learning infrastructure',
    options: ['Cloud only', 'Single server', 'Multi-machine setup'],
    chosenOption: 2,
    reasoning: 'Wanted hands-on experience with networking, Docker, and distributed systems.',
    date: '2025-11-20',
    status: 'made',
    outcome: '4-machine setup running smoothly. Learned more than any course could teach.',
    category: 'Infrastructure',
  },
  {
    id: '3',
    title: 'AI Agent Architecture',
    context: 'Building out the agent network for the garden',
    options: ['Monolithic', 'Microservices', 'Hybrid'],
    chosenOption: 2,
    reasoning: 'Need flexibility for different agent types while maintaining simplicity where possible.',
    date: '2026-03-01',
    status: 'pending',
    category: 'Architecture',
  },
];

const categories = ['All', 'Tools', 'Infrastructure', 'Architecture', 'Career', 'Life'];
const statusColors = {
  pending: '#f4d03f',
  made: '#2ecc71',
  reversed: '#e74c3c',
};

export default function DecisionLog() {
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [filter, setFilter] = useState('All');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.decision-section');
  }, [revealRef]);

  const filteredDecisions = filter === 'All' 
    ? decisions 
    : decisions.filter(d => d.category === filter);

  const stats = {
    total: decisions.length,
    made: decisions.filter(d => d.status === 'made').length,
    pending: decisions.filter(d => d.status === 'pending').length,
    reversed: decisions.filter(d => d.status === 'reversed').length,
  };

  return (
    <section className="decision-section" id="decisions" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Decision Journal
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Decision Log
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Scale size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Decisions</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.made}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Made</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#f4d03f', fontFamily: 'Cormorant Garamond, serif' }}>{stats.pending}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pending</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{stats.reversed}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reversed</span>
        </div>
      </div>

      {/* Filter */}
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
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Decisions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredDecisions.map((decision) => (
          <div
            key={decision.id}
            onClick={() => setSelectedDecision(decision)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.2)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                {decision.title}
              </h3>
              <span style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem',
                background: `${statusColors[decision.status]}20`,
                color: statusColors[decision.status],
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}>
                {decision.status}
              </span>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {decision.context}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{decision.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{decision.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDecision && (
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
          onClick={() => setSelectedDecision(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                {selectedDecision.title}
              </h3>
              <button
                onClick={() => setSelectedDecision(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Context</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedDecision.context}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Options Considered</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedDecision.options.map((option, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem 1rem',
                      background: idx === selectedDecision.chosenOption ? 'rgba(244, 208, 63, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${idx === selectedDecision.chosenOption ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {idx === selectedDecision.chosenOption ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--accent-gold)' }} />
                    ) : (
                      <Circle size={16} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <span style={{ fontSize: '0.9rem', color: idx === selectedDecision.chosenOption ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Reasoning</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>{selectedDecision.reasoning}</p>
            </div>

            {selectedDecision.outcome && (
              <div style={{ background: 'rgba(46, 204, 113, 0.05)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: '#2ecc71', display: 'block', marginBottom: '0.5rem' }}>Outcome</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{selectedDecision.outcome}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
