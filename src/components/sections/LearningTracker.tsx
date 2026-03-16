import { useState, useEffect } from 'react';
import { BookOpen, Award, Clock, Target, CheckCircle2, Circle } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Course {
  id: string;
  name: string;
  platform: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  status: 'active' | 'completed' | 'paused';
  lastAccessed: string;
}

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

const courses: Course[] = [
  { id: '1', name: 'Advanced TypeScript Patterns', platform: 'Frontend Masters', progress: 65, totalLessons: 20, completedLessons: 13, category: 'Programming', status: 'active', lastAccessed: '2026-03-10' },
  { id: '2', name: 'System Design for Developers', platform: 'Educative', progress: 30, totalLessons: 40, completedLessons: 12, category: 'Architecture', status: 'active', lastAccessed: '2026-03-08' },
  { id: '3', name: 'Rust for JavaScript Developers', platform: 'Egghead', progress: 100, totalLessons: 15, completedLessons: 15, category: 'Programming', status: 'completed', lastAccessed: '2026-02-15' },
  { id: '4', name: 'AI Engineering Fundamentals', platform: 'DeepLearning.AI', progress: 45, totalLessons: 25, completedLessons: 11, category: 'AI/ML', status: 'active', lastAccessed: '2026-03-09' },
  { id: '5', name: 'Kubernetes Basics', platform: 'Linux Foundation', progress: 0, totalLessons: 30, completedLessons: 0, category: 'DevOps', status: 'paused', lastAccessed: '2026-01-20' },
];

const skills: Skill[] = [
  { name: 'TypeScript', level: 90, category: 'Languages' },
  { name: 'React/Next.js', level: 95, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'GraphQL', level: 80, category: 'APIs' },
  { name: 'Docker', level: 75, category: 'DevOps' },
  { name: 'AWS', level: 70, category: 'Cloud' },
  { name: 'Python', level: 65, category: 'Languages' },
  { name: 'AI Integration', level: 60, category: 'AI/ML' },
];

const statusColors = {
  active: '#f4d03f',
  completed: '#2ecc71',
  paused: '#95a5a6',
};

export default function LearningTracker() {
  const [activeTab, setActiveTab] = useState<'courses' | 'skills'>('courses');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.learning-section');
  }, [revealRef]);

  const activeCourses = courses.filter(c => c.status === 'active').length;
  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const totalHours = courses.reduce((acc, c) => acc + (c.completedLessons * 0.5), 0);

  return (
    <section className="learning-section" id="learning" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Knowledge Growth
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Learning Tracker
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <BookOpen size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{activeCourses}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Courses</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Award size={16} style={{ color: '#2ecc71' }} />
            <span style={{ fontSize: '2rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{completedCourses}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Clock size={16} style={{ color: 'var(--text-primary)' }} />
            <span style={{ fontSize: '2rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{Math.round(totalHours)}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hours Learned</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {(['courses', 'skills'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: activeTab === tab ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.85rem',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'courses' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {courses.map(course => (
            <div
              key={course.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1.5rem',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {course.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.platform}</span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  background: `${statusColors[course.status]}20`,
                  color: statusColors[course.status],
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}>
                  {course.status}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {course.completedLessons} / {course.totalLessons} lessons
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>{course.progress}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${course.progress}%`,
                    height: '100%',
                    background: course.status === 'completed' ? '#2ecc71' : 'var(--accent-gold)',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{course.category}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last: {course.lastAccessed}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {skills.map(skill => (
            <div
              key={skill.name}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{skill.category}</span>
                <Target size={16} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {skill.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${skill.level}%`,
                    height: '100%',
                    background: skill.level >= 80 ? '#2ecc71' : skill.level >= 60 ? 'var(--accent-gold)' : '#e67e22',
                    borderRadius: '3px',
                  }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
