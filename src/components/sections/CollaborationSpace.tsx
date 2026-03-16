import { Users, Activity, GitBranch, MessageSquare } from 'lucide-react';
import styles from './CollaborationSpace.module.css';

const projects = [
  {
    id: 1,
    name: 'Hikari Garden',
    description: 'Personal digital garden with 80+ sections and growing',
    status: 'active',
    collaborators: ['PK', 'AI'],
  },
  {
    id: 2,
    name: 'Thoth Platform',
    description: 'AI content creation and social media management',
    status: 'active',
    collaborators: ['PK', 'TM', 'KZ'],
  },
  {
    id: 3,
    name: 'Mignomic',
    description: 'Immigration platform with AI assistance',
    status: 'paused',
    collaborators: ['PK'],
  },
  {
    id: 4,
    name: 'Agent Network',
    description: 'Multi-agent AI system for task automation',
    status: 'active',
    collaborators: ['PK', 'KS', 'KZ', 'MZ', 'TT'],
  },
];

const activities = [
  { user: 'PK', action: 'pushed 3 commits to', target: 'Hikari Garden', time: '2 hours ago' },
  { user: 'AI', action: 'deployed new version of', target: 'Thoth Platform', time: '4 hours ago' },
  { user: 'KZ', action: 'completed code review for', target: 'Agent Network', time: '6 hours ago' },
  { user: 'PK', action: 'created new issue in', target: 'Mignomic', time: '1 day ago' },
];

export default function CollaborationSpace() {
  return (
    <section className={styles.collaborationSpace}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Users className={styles.icon} size={20} />
          Collaboration Space
        </h2>
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <span className={`${styles.projectStatus} ${project.status === 'active' ? styles.statusActive : styles.statusPaused}`}>
                {project.status}
              </span>
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.collaborators}>
              {project.collaborators.slice(0, 3).map((initial, idx) => (
                <div key={idx} className={styles.avatar}>{initial}</div>
              ))}
              {project.collaborators.length > 3 && (
                <div className={`${styles.avatar} ${styles.avatarMore}`}>+{project.collaborators.length - 3}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.activityFeed}>
        <div className={styles.activityTitle}>
          <Activity size={14} />
          Recent Activity
        </div>
        {activities.map((activity, index) => (
          <div key={index} className={styles.activityItem}>
            <div className={styles.activityAvatar}>{activity.user}</div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>
                <strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong>
              </div>
              <div className={styles.activityTime}>{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
