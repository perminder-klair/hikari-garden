import { useState, useEffect } from 'react';
import { GitBranch, Star, Lock, Unlock, Trophy, Target, Zap } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  unlocked: boolean;
  prerequisites: string[];
  description: string;
  milestones: { level: number; name: string; completed: boolean }[];
}

const initialSkills: Skill[] = [
  {
    id: 'react',
    name: 'React Mastery',
    category: 'Frontend',
    level: 4,
    maxLevel: 5,
    xp: 85,
    xpToNext: 100,
    unlocked: true,
    prerequisites: [],
    description: 'Advanced React patterns, hooks, and performance optimization',
    milestones: [
      { level: 1, name: 'Component Basics', completed: true },
      { level: 2, name: 'Hooks Deep Dive', completed: true },
      { level: 3, name: 'Custom Hooks', completed: true },
      { level: 4, name: 'Performance', completed: true },
      { level: 5, name: 'Architecture', completed: false },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Languages',
    level: 3,
    maxLevel: 5,
    xp: 60,
    xpToNext: 100,
    unlocked: true,
    prerequisites: [],
    description: 'Type systems, generics, and advanced patterns',
    milestones: [
      { level: 1, name: 'Basic Types', completed: true },
      { level: 2, name: 'Interfaces', completed: true },
      { level: 3, name: 'Generics', completed: true },
      { level: 4, name: 'Conditional Types', completed: false },
      { level: 5, name: 'Type Guards', completed: false },
    ],
  },
  {
    id: 'ai',
    name: 'AI Integration',
    category: 'Emerging',
    level: 2,
    maxLevel: 5,
    xp: 45,
    xpToNext: 100,
    unlocked: true,
    prerequisites: [],
    description: 'LLM APIs, prompt engineering, and agent systems',
    milestones: [
      { level: 1, name: 'API Basics', completed: true },
      { level: 2, name: 'Prompt Engineering', completed: true },
      { level: 3, name: 'RAG Systems', completed: false },
      { level: 4, name: 'Fine-tuning', completed: false },
      { level: 5, name: 'Agent Orchestration', completed: false },
    ],
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Systems',
    level: 1,
    maxLevel: 5,
    xp: 20,
    xpToNext: 100,
    unlocked: true,
    prerequisites: [],
    description: 'Memory safety, ownership, and systems programming',
    milestones: [
      { level: 1, name: 'Ownership', completed: true },
      { level: 2, name: 'Borrowing', completed: false },
      { level: 3, name: 'Lifetimes', completed: false },
      { level: 4, name: 'Traits', completed: false },
      { level: 5, name: 'Async', completed: false },
    ],
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'DevOps',
    level: 0,
    maxLevel: 5,
    xp: 0,
    xpToNext: 100,
    unlocked: false,
    prerequisites: ['docker'],
    description: 'Container orchestration and cluster management',
    milestones: [
      { level: 1, name: 'Pods', completed: false },
      { level: 2, name: 'Services', completed: false },
      { level: 3, name: 'Deployments', completed: false },
      { level: 4, name: 'Helm', completed: false },
      { level: 5, name: 'Operators', completed: false },
    ],
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    level: 3,
    maxLevel: 5,
    xp: 70,
    xpToNext: 100,
    unlocked: true,
    prerequisites: [],
    description: 'Containerization and image optimization',
    milestones: [
      { level: 1, name: 'Dockerfile', completed: true },
      { level: 2, name: 'Compose', completed: true },
      { level: 3, name: 'Multi-stage', completed: true },
      { level: 4, name: 'Networking', completed: false },
      { level: 5, name: 'Security', completed: false },
    ],
  },
];

const categories = ['All', 'Frontend', 'Languages', 'DevOps', 'Systems', 'Emerging'];

export default function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.skill-tree-section');
  }, [revealRef]);

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const totalXP = skills.reduce((acc, s) => acc + s.xp + (s.level - 1) * 100, 0);
  const unlockedCount = skills.filter(s => s.unlocked).length;
  const masteredCount = skills.filter(s => s.level === s.maxLevel).length;

  const addXP = (skillId: string, amount: number) => {
    setSkills(skills.map(s => {
      if (s.id !== skillId) return s;
      let newXP = s.xp + amount;
      let newLevel = s.level;
      while (newXP >= s.xpToNext && newLevel < s.maxLevel) {
        newXP -= s.xpToNext;
        newLevel++;
      }
      return { ...s, xp: newXP, level: newLevel };
    }));
  };

  return (
    <section className="skill-tree-section" id="skills" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Progression System
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Skill Tree
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Zap size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
              {totalXP}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total XP</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>
            {unlockedCount}/{skills.length}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Unlocked</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>
            {masteredCount}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mastered</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === cat ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredSkills.map(skill => (
          <div
            key={skill.id}
            onClick={() => skill.unlocked && setSelectedSkill(skill)}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${skill.unlocked ? (skill.level === skill.maxLevel ? '#f39c12' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: skill.unlocked ? 'pointer' : 'not-allowed',
              opacity: skill.unlocked ? 1 : 0.6,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (skill.unlocked) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(244, 208, 63, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {skill.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skill.category}</span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: skill.unlocked ? (skill.level === skill.maxLevel ? '#f39c1220' : 'rgba(52, 152, 219, 0.2)') : 'rgba(149, 165, 166, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: skill.unlocked ? (skill.level === skill.maxLevel ? '#f39c12' : '#3498db') : '#95a5a6',
              }}>
                {skill.unlocked ? (skill.level === skill.maxLevel ? <Trophy size={16} /> : <Unlock size={16} />) : <Lock size={16} />}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Level {skill.level}/{skill.maxLevel}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {skill.xp}/{skill.xpToNext} XP
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(skill.xp / skill.xpToNext) * 100}%`,
                  height: '100%',
                  background: skill.level === skill.maxLevel ? '#f39c12' : '#3498db',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {skill.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {skill.milestones.filter(m => m.completed).map(m => (
                <span key={m.name} style={{
                  fontSize: '0.65rem',
                  padding: '0.2rem 0.4rem',
                  background: 'rgba(46, 204, 113, 0.2)',
                  color: '#2ecc71',
                  borderRadius: '4px',
                }}>
                  ✓ {m.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSkill && (
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
          onClick={() => setSelectedSkill(null)}
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
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {selectedSkill.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedSkill.category}</span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Milestones</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedSkill.milestones.map(m => (
                  <div key={m.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: m.completed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255,255,255,0.03)',
                    borderRadius: '4px',
                  }}>
                    <span style={{ color: m.completed ? '#2ecc71' : 'var(--text-muted)' }}>
                      {m.completed ? '✓' : '○'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: m.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => addXP(selectedSkill.id, 10)}
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
                +10 XP
              </button>
              <button
                onClick={() => setSelectedSkill(null)}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
