import { useState } from 'react';
import { FileText, Tag, Calendar, ChevronDown, ChevronUp, Rocket, Bug, Sparkles, GitCommit } from 'lucide-react';
import styles from './ReleaseNotes.module.css';

interface ReleaseNote {
  id: string;
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: {
    type: 'feature' | 'fix' | 'improvement';
    description: string;
  }[];
  expanded: boolean;
}

const initialNotes: ReleaseNote[] = [
  {
    id: '1',
    version: 'v2.4.0',
    date: '2026-03-14',
    title: 'Developer Tools Update',
    summary: 'New developer-focused sections for code management and API testing',
    changes: [
      { type: 'feature', description: 'Snippet Vault - Store and organize reusable code snippets' },
      { type: 'feature', description: 'API Playground - Test and explore APIs directly in the garden' },
      { type: 'feature', description: 'Design Tokens - Manage design system tokens and export to CSS' },
      { type: 'feature', description: 'Release Notes - Track personal project releases' },
      { type: 'improvement', description: 'Enhanced keyboard navigation throughout the garden' },
    ],
    expanded: true,
  },
  {
    id: '2',
    version: 'v2.3.0',
    date: '2026-03-13',
    title: 'Archive & Organization',
    summary: 'New sections for organizing digital life and preserving memories',
    changes: [
      { type: 'feature', description: 'Archive Vault - Personal archive for old projects and memories' },
      { type: 'feature', description: 'Link Rotator - Curated link rotation for saved discoveries' },
      { type: 'feature', description: 'Color Palette - Personal color palette collection' },
      { type: 'feature', description: 'Keyboard Shortcuts - Reference guide for all garden shortcuts' },
    ],
    expanded: false,
  },
  {
    id: '3',
    version: 'v2.2.0',
    date: '2026-03-13',
    title: 'Goals & Vision',
    summary: 'Vision and challenge tracking for long-term planning',
    changes: [
      { type: 'feature', description: 'Vision Board - Long-term goals visualization' },
      { type: 'feature', description: 'Challenge Tracker - Monthly/weekly challenges' },
      { type: 'feature', description: 'Hobby Tracker - Track hobbies and time spent' },
      { type: 'feature', description: 'Social Garden - Social media/content planning' },
    ],
    expanded: false,
  },
  {
    id: '4',
    version: 'v2.1.0',
    date: '2026-03-13',
    title: 'Knowledge & Focus',
    summary: 'Knowledge management and enhanced focus tools',
    changes: [
      { type: 'feature', description: 'Changelog - Version history tracking' },
      { type: 'feature', description: 'Affirmation Wall - Daily positive affirmations' },
      { type: 'feature', description: 'Inspiration Board - Visual mood board' },
      { type: 'feature', description: 'Quick Notes - Rapid capture system' },
    ],
    expanded: false,
  },
  {
    id: '5',
    version: 'v2.0.0',
    date: '2026-03-12',
    title: 'The Big Expansion',
    summary: 'Major expansion with 40+ new sections covering all aspects of digital life',
    changes: [
      { type: 'feature', description: 'Finance Garden - Personal finance tracking' },
      { type: 'feature', description: 'Travel Log - Journey documentation' },
      { type: 'feature', description: 'Health Vault - Wellness data tracking' },
      { type: 'feature', description: 'Idea Garden - Creative ideation space' },
      { type: 'feature', description: 'And 36 more sections...' },
    ],
    expanded: false,
  },
];

const typeIcons = {
  feature: Sparkles,
  fix: Bug,
  improvement: GitCommit,
};

const typeColors = {
  feature: '#34d399',
  fix: '#ef4444',
  improvement: '#60a5fa',
};

export default function ReleaseNotes() {
  const [notes, setNotes] = useState<ReleaseNote[]>(initialNotes);
  const [filter, setFilter] = useState<string>('all');

  const toggleExpand = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, expanded: !n.expanded } : n));
  };

  const filteredNotes = filter === 'all' 
    ? notes 
    : notes.filter(n => n.changes.some(c => c.type === filter));

  return (
    <section className={styles.notes} id="release-notes">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Rocket size={28} />
        </div>
        <h2 className={styles.title}>Release Notes</h2>
        <p className={styles.subtitle}>Personal project releases and updates</p>
      </div>

      <div className={styles.filters}>
        {['all', 'feature', 'improvement', 'fix'].map((type) => {
          const Icon = type === 'all' ? Tag : typeIcons[type as keyof typeof typeIcons];
          return (
            <button
              key={type}
              className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
              onClick={() => setFilter(type)}
            >
              <Icon size={14} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          );
        })}
      </div>

      <div className={styles.timeline}>
        {filteredNotes.map((note) => (
          <div key={note.id} className={styles.note}>
            <div className={styles.noteHeader} onClick={() => toggleExpand(note.id)}>
              <div className={styles.versionInfo}>
                <span className={styles.version}>{note.version}</span>
                <span className={styles.date}>
                  <Calendar size={12} />
                  {note.date}
                </span>
              </div>
              <div className={styles.noteTitle}>
                <h3>{note.title}</h3>
                <p>{note.summary}</p>
              </div>
              <button className={styles.expandBtn}>
                {note.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {note.expanded && (
              <div className={styles.noteContent}>
                <ul className={styles.changes}>
                  {note.changes.map((change, index) => {
                    const Icon = typeIcons[change.type];
                    return (
                      <li key={index} className={styles.change}>
                        <span className={styles.changeType} style={{ color: typeColors[change.type] }}>
                          <Icon size={12} />
                          {change.type}
                        </span>
                        <span className={styles.changeDesc}>{change.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{notes.length}</span>
          <span className={styles.statLabel}>Releases</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {notes.reduce((acc, n) => acc + n.changes.filter(c => c.type === 'feature').length, 0)}
          </span>
          <span className={styles.statLabel}>Features</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {notes.reduce((acc, n) => acc + n.changes.length, 0)}
          </span>
          <span className={styles.statLabel}>Changes</span>
        </div>
      </div>
    </section>
  );
}
