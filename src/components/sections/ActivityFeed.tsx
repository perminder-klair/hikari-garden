import { useState } from 'react';
import { Activity, Plus, Edit3, Trash2, CheckCircle, Star, Clock } from 'lucide-react';
import styles from './ActivityFeed.module.css';

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'complete' | 'favorite';
  text: string;
  section: string;
  timestamp: string;
}

const activities: ActivityItem[] = [
  { id: '1', type: 'create', text: 'Created new note "Project ideas for Q2"', section: 'Quick Notes', timestamp: '2 min ago' },
  { id: '2', type: 'complete', text: 'Completed focus session (25 min)', section: 'Pomodoro Garden', timestamp: '15 min ago' },
  { id: '3', type: 'update', text: 'Updated habit streak to 7 days', section: 'Habit Tracker', timestamp: '1 hour ago' },
  { id: '4', type: 'favorite', text: 'Added bookmark to favorites', section: 'Bookmark Forest', timestamp: '2 hours ago' },
  { id: '5', type: 'create', text: 'Planted new seed in garden', section: 'Seeds Timeline', timestamp: '3 hours ago' },
  { id: '6', type: 'update', text: 'Modified theme settings', section: 'Theme Customizer', timestamp: '4 hours ago' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'create': return <Plus size={16} />;
    case 'update': return <Edit3 size={16} />;
    case 'delete': return <Trash2 size={16} />;
    case 'complete': return <CheckCircle size={16} />;
    case 'favorite': return <Star size={16} />;
    default: return <Activity size={16} />;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'create': return { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' };
    case 'update': return { bg: 'rgba(52, 152, 219, 0.1)', color: '#3498db' };
    case 'delete': return { bg: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' };
    case 'complete': return { bg: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' };
    case 'favorite': return { bg: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f' };
    default: return { bg: 'rgba(149, 165, 166, 0.1)', color: '#95a5a6' };
  }
};

export default function ActivityFeed() {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredActivities = filter 
    ? activities.filter(a => a.type === filter)
    : activities;

  return (
    <section className={styles.activityFeed}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Activity className={styles.icon} size={20} />
          Activity Feed
        </h2>
        <button className={styles.filterBtn} onClick={() => setFilter(null)}>
          <Clock size={14} style={{ marginRight: '0.25rem' }} />
          All Time
        </button>
      </div>

      <div className={styles.activityList}>
        {filteredActivities.map((activity) => {
          const iconStyle = getIconColor(activity.type);
          return (
            <div key={activity.id} className={styles.activityItem}>
              <div 
                className={styles.activityIcon}
                style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
              >
                {getIcon(activity.type)}
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityText}>{activity.text}</div>
                <div className={styles.activityMeta}>{activity.section}</div>
              </div>
              <div className={styles.activityTime}>{activity.timestamp}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
