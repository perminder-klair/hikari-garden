import { useState, useEffect } from 'react';
import { FlaskConical, GitBranch, Star, Clock, ExternalLink, Github, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'ideation' | 'prototyping' | 'active' | 'paused' | 'completed' | 'archived';
  techStack: string[];
  startDate: string;
  lastUpdated: string;
  stars: number;
  repoUrl?: string;
  demoUrl?: string;
  learnings: string[];
  blockers?: string[];
}

const experiments: Experiment[] = [
  {
    id: '1',
    name: 'AI Agent Orchestrator',
    description: 'Multi-agent system for coordinating specialized AI agents with shared memory',
    status: 'active',
    techStack: ['TypeScript', 'Redis', 'Docker', 'OpenAI'],
    startDate: '2026-02-15',
    lastUpdated: '2026-03-10',
    stars: 12,
    repoUrl: 'https://github.com/parm/ai-orchestrator',
    learnings: ['Agent communication patterns', 'Memory management strategies', 'Error recovery in distributed systems'],
  },
  {
    id: '2',
    name: 'Local LLM Dashboard',
    description: 'Web UI for managing and interacting with local language models',
    status: 'prototyping',
    techStack: ['React', 'Python', 'FastAPI', 'Ollama'],
    startDate: '2026-03-01',
    lastUpdated: '2026-03-09',
    stars: 8,
    learnings: ['Model quantization trade-offs', 'Streaming responses', 'Prompt templating'],
    blockers: ['GPU memory optimization'],
  },
  {
    id: '3',
    name: 'Homelab Monitoring',
    description: 'Custom monitoring stack for the 4-machine homelab setup',
    status: 'completed',
    techStack: ['Grafana', 'Prometheus', 'Node Exporter', 'AlertManager'],
    startDate: '2025-12-01',
    lastUpdated: '2026-02-28',
    stars: 24,
    repoUrl: 'https://github.com/parm/homelab-monitor',
    learnings: ['Time-series data optimization', 'Alert fatigue management', 'Custom dashboards'],
  },
  {
    id: '4',
    name: 'Voice-to-Text Pipeline',
    description: 'Real-time transcription with speaker diarization for meetings',
    status: 'paused',
    techStack: ['Whisper', 'Python', 'WebRTC', 'PostgreSQL'],
    startDate: '2026-01-10',
    lastUpdated: '2026-02-15',
    stars: 5,
    learnings: ['Audio preprocessing', 'Speaker identification', 'Latency optimization'],
    blockers: ['Accuracy in noisy environments', 'Real-time latency requirements'],
  },
  {
    id: '5',
    name: 'Digital Garden CLI',
    description: 'Command-line tool for managing digital garden content',
    status: 'ideation',
    techStack: ['Rust', 'Markdown', 'Git'],
    startDate: '2026-03-11',
    lastUpdated: '2026-03-11',
    stars: 0,
    learnings: [],
  },
];

const statusConfig = {
  ideation: { color: '#9b59b6', label: 'Ideation', icon: '💡' },
  prototyping: { color: '#f39c12', label: 'Prototyping', icon: '🔧' },
  active: { color: '#2ecc71', label: 'Active', icon: '🚀' },
  paused: { color: '#95a5a6', label: 'Paused', icon: '⏸️' },
  completed: { color: '#3498db', label: 'Completed', icon: '✅' },
  archived: { color: '#7f8c8d', label: 'Archived', icon: '📦' },
};

export default function ProjectLab() {
  const [filter, setFilter] = useState<Experiment['status'] | 'all'>('all');
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.project-lab-section');
  }, [revealRef]);

  const filteredExperiments = filter === 'all' 
    ? experiments 
    : experiments.filter(e => e.status === filter);

  const stats = {
    total: experiments.length,
    active: experiments.filter(e => e.status === 'active').length,
    completed: experiments.filter(e => e.status === 'completed').length,
    totalStars: experiments.reduce((acc, e) => acc + e.stars, 0),
  };

  return (
    <section className="project-lab-section" id="lab" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Experimental Works
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Project Lab
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <FlaskConical size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Experiments</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.active}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.completed}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
            <Star size={16} style={{ color: '#f39c12' }} />
            <span style={{ fontSize: '2rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{stats.totalStars}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stars</span>
        </div>
      </div>

      {/* Status Filter */}
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
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilter(status as Experiment['status'])}
            style={{
              padding: '0.5rem 1rem',
              background: filter === status ? config.color : 'transparent',
              border: `1px solid ${filter === status ? config.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === status ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      {/* Experiments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredExperiments.map(exp => (
          <div
            key={exp.id}
            onClick={() => setSelectedExperiment(exp)}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${exp.status === 'active' ? statusConfig.active.color : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = exp.status === 'active' ? statusConfig.active.color : 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{statusConfig[exp.status].icon}</span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  {exp.name}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#f39c12' }}>
                <Star size={14} fill="#f39c12" />
                {exp.stars}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {exp.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {exp.techStack.map(tech => (
                <span key={tech} style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                }}>
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} />
                Updated {exp.lastUpdated}
              </span>
              {exp.blockers && exp.blockers.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#e74c3c' }}>
                  <AlertCircle size={12} />
                  {exp.blockers.length} blocker{exp.blockers.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedExperiment && (
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
          onClick={() => setSelectedExperiment(null)}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{statusConfig[selectedExperiment.status].icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                    {selectedExperiment.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: statusConfig[selectedExperiment.status].color }}>
                    {statusConfig[selectedExperiment.status].label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedExperiment(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedExperiment.description}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Tech Stack</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedExperiment.techStack.map(tech => (
                  <span key={tech} style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    background: 'rgba(244, 208, 63, 0.1)',
                    color: 'var(--accent-gold)',
                    borderRadius: '4px',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedExperiment.learnings.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Key Learnings</span>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {selectedExperiment.learnings.map((learning, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{learning}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedExperiment.blockers && selectedExperiment.blockers.length > 0 && (
              <div style={{ background: 'rgba(231, 76, 60, 0.05)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(231, 76, 60, 0.2)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#e74c3c', display: 'block', marginBottom: '0.5rem' }}>Blockers</span>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {selectedExperiment.blockers.map((blocker, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{blocker}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              {selectedExperiment.repoUrl && (
                <a
                  href={selectedExperiment.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Github size={16} />
                  View Code
                </a>
              )}
              {selectedExperiment.demoUrl && (
                <a
                  href={selectedExperiment.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--accent-gold)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--bg-primary)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
