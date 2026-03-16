import { useState } from 'react';
import { GitCommit, GitBranch, GitMerge, Copy, Check, Filter, Calendar } from 'lucide-react';
import styles from './GitLog.module.css';

interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';
  files: number;
  additions: number;
  deletions: number;
}

const commits: Commit[] = [
  {
    id: '1',
    hash: 'a1b2c3d',
    message: 'feat: add Terminal component with interactive commands',
    author: 'Parm',
    date: '2026-03-14',
    branch: 'main',
    type: 'feat',
    files: 2,
    additions: 245,
    deletions: 12,
  },
  {
    id: '2',
    hash: 'e4f5g6h',
    message: 'feat: implement GitLog visualization',
    author: 'Parm',
    date: '2026-03-14',
    branch: 'main',
    type: 'feat',
    files: 2,
    additions: 189,
    deletions: 0,
  },
  {
    id: '3',
    hash: 'i7j8k9l',
    message: 'fix: resolve TypeScript errors in FocusSessions',
    author: 'Parm',
    date: '2026-03-13',
    branch: 'main',
    type: 'fix',
    files: 1,
    additions: 8,
    deletions: 5,
  },
  {
    id: '4',
    hash: 'm0n1o2p',
    message: 'feat: add SnippetVault for code snippets',
    author: 'Parm',
    date: '2026-03-13',
    branch: 'main',
    type: 'feat',
    files: 2,
    additions: 312,
    deletions: 0,
  },
  {
    id: '5',
    hash: 'q3r4s5t',
    message: 'feat: add APIPlayground for testing APIs',
    author: 'Parm',
    date: '2026-03-13',
    branch: 'main',
    type: 'feat',
    files: 2,
    additions: 278,
    deletions: 0,
  },
  {
    id: '6',
    hash: 'u6v7w8x',
    message: 'refactor: optimize component rendering',
    author: 'Parm',
    date: '2026-03-12',
    branch: 'main',
    type: 'refactor',
    files: 5,
    additions: 45,
    deletions: 67,
  },
  {
    id: '7',
    hash: 'y9z0a1b',
    message: 'docs: update README with new sections',
    author: 'Parm',
    date: '2026-03-12',
    branch: 'main',
    type: 'docs',
    files: 1,
    additions: 34,
    deletions: 8,
  },
  {
    id: '8',
    hash: 'c2d3e4f',
    message: 'feat: add DesignTokens management',
    author: 'Parm',
    date: '2026-03-12',
    branch: 'main',
    type: 'feat',
    files: 2,
    additions: 234,
    deletions: 0,
  },
  {
    id: '9',
    hash: 'g5h6i7j',
    message: 'style: improve mobile responsiveness',
    author: 'Parm',
    date: '2026-03-11',
    branch: 'main',
    type: 'style',
    files: 8,
    additions: 156,
    deletions: 89,
  },
  {
    id: '10',
    hash: 'k8l9m0n',
    message: 'chore: update dependencies',
    author: 'Parm',
    date: '2026-03-11',
    branch: 'main',
    type: 'chore',
    files: 2,
    additions: 12,
    deletions: 12,
  },
];

const typeConfig: Record<string, { color: string; label: string }> = {
  feat: { color: '#34d399', label: 'feature' },
  fix: { color: '#ef4444', label: 'fix' },
  docs: { color: '#60a5fa', label: 'docs' },
  style: { color: '#a78bfa', label: 'style' },
  refactor: { color: '#fbbf24', label: 'refactor' },
  test: { color: '#f472b6', label: 'test' },
  chore: { color: '#9ca3af', label: 'chore' },
};

export default function GitLog() {
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCommits = filter === 'all' 
    ? commits 
    : commits.filter(c => c.type === filter);

  const copyHash = async (hash: string, id: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const types = ['all', 'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];

  const totalStats = {
    commits: commits.length,
    additions: commits.reduce((acc, c) => acc + c.additions, 0),
    deletions: commits.reduce((acc, c) => acc + c.deletions, 0),
    files: commits.reduce((acc, c) => acc + c.files, 0),
  };

  return (
    <section className={styles.gitlog} id="git-log">
      <div className={styles.header}>
        <div className={styles.icon}>
          <GitCommit size={28} />
        </div>
        <h2 className={styles.title}>Git Log</h2>
        <p className={styles.subtitle}>Project commit history</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <GitCommit size={16} />
          <span className={styles.statValue}>{totalStats.commits}</span>
          <span className={styles.statLabel}>Commits</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.additions}>+{totalStats.additions}</span>
          <span className={styles.deletions}>-{totalStats.deletions}</span>
          <span className={styles.statLabel}>Lines changed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalStats.files}</span>
          <span className={styles.statLabel}>Files</span>
        </div>
      </div>

      <div className={styles.filters}>
        {types.map(type => (
          <button
            key={type}
            className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
            onClick={() => setFilter(type)}
            style={type !== 'all' ? { '--type-color': typeConfig[type]?.color } as React.CSSProperties : undefined}
          >
            {type === 'all' ? 'All' : typeConfig[type]?.label}
          </button>
        ))}
      </div>

      <div className={styles.timeline}>
        {filteredCommits.map((commit, index) => (
          <div key={commit.id} className={styles.commit}>
            <div className={styles.commitLine}>
              <div 
                className={styles.commitDot}
                style={{ background: typeConfig[commit.type]?.color }}
              />
              {index < filteredCommits.length - 1 && <div className={styles.commitConnector} />}
            </div>
            
            <div className={styles.commitContent}>
              <div className={styles.commitHeader}>
                <span className={styles.type} style={{ color: typeConfig[commit.type]?.color }}>
                  {commit.type}
                </span>
                <button 
                  className={styles.hash}
                  onClick={() => copyHash(commit.hash, commit.id)}
                >
                  {copiedId === commit.id ? <Check size={12} /> : <Copy size={12} />}
                  {commit.hash}
                </button>
                <span className={styles.branch}>
                  <GitBranch size={12} />
                  {commit.branch}
                </span>
              </div>
              
              <p className={styles.message}>{commit.message}</p>
              
              <div className={styles.commitFooter}>
                <span className={styles.author}>{commit.author}</span>
                <span className={styles.date}>
                  <Calendar size={12} />
                  {commit.date}
                </span>
                <span className={styles.changes}>
                  <span className={styles.add}>+{commit.additions}</span>
                  <span className={styles.del}>-{commit.deletions}</span>
                  <span className={styles.files}>{commit.files} files</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
