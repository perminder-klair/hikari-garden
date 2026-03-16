import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Target } from 'lucide-react';
import styles from './DataVisualizer.module.css';

const chartData = {
  weekly: [45, 62, 38, 75, 55, 80, 65],
  monthly: [320, 450, 380, 520, 480, 600],
  yearly: [4200, 5800, 4900, 6500, 7200, 8100],
};

const labels = {
  weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  yearly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
};

const stats = [
  { icon: <TrendingUp size={16} />, value: '+23%', label: 'Growth' },
  { icon: <Users size={16} />, value: '1.2K', label: 'Visitors' },
  { icon: <Clock size={16} />, value: '4.5h', label: 'Avg Time' },
  { icon: <Target size={16} />, value: '87%', label: 'Goals Met' },
];

type TimeRange = 'weekly' | 'monthly' | 'yearly';

export default function DataVisualizer() {
  const [activeTab, setActiveTab] = useState<TimeRange>('weekly');
  const data = chartData[activeTab];
  const maxValue = Math.max(...data);

  return (
    <section className={styles.dataVisualizer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BarChart3 className={styles.icon} size={20} />
          Data Visualizer
        </h2>
      </div>

      <div className={styles.chartTabs}>
        {(['weekly', 'monthly', 'yearly'] as TimeRange[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.chartContainer}>
        {data.map((value, index) => (
          <div
            key={index}
            className={styles.bar}
            style={{ height: `${(value / maxValue) * 100}%` }}
          >
            <span className={styles.barValue}>{value}</span>
            <span className={styles.barLabel}>{labels[activeTab][index]}</span>
          </div>
        ))}
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue} style={{ color: 'var(--accent-gold)' }}>
              {stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
