import { GitBranch, GitCommit, GitPullRequest, Circle, CheckCircle2 } from 'lucide-react';
import styles from './VersionControl.module.css';

const stats = [
  { value: '1,247', label: 'Commits' },
  { value: '18', label: 'Branches' },
  { value: '42', label: 'PRs Merged' },
  { value: '0', label: 'Conflicts' },
];

const branches = [
  { name: 'main', status: 'main', commits: 523, ahead: 0 },
  { name: 'develop', status: 'dev', commits: 312, ahead: 3 },
  { name: 'feature/ai-agents', status: 'feature', commits: 89, ahead: 12 },
  { name: 'feature/mobile-ui', status: 'feature', commits: 156, ahead: 8 },
  { name: 'hotfix/auth-bug', status: 'feature', commits: 23, ahead: 1 },
];

export default function VersionControl() {
  return (
    <section className={styles.versionControl}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <GitBranch className={styles.icon} size={20} />
          Version Control
        </h2>
      </div>

      <div className={styles.statsRow}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.branchesList}>
        <div className={styles.branchesTitle}>
          <GitCommit size={14} />
          Active Branches
        </div>
        {branches.map((branch, index) => (
          <div key={index} className={styles.branchItem}>
            <div className={styles.branchInfo}>
              <GitBranch className={styles.branchIcon} size={16} />
              <span className={styles.branchName}>{branch.name}</span>
            </div>
            <div className={styles.branchMeta}>
              <span className={`${styles.branchStatus} ${
                branch.status === 'main' ? styles.statusMain :
                branch.status === 'dev' ? styles.statusDev : styles.statusFeature
              }`}>
                {branch.status}
              </span>
              <span className={styles.commitCount}>{branch.commits} commits</span>
              {branch.ahead > 0 && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  +{branch.ahead}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
