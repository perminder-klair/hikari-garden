import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import styles from './AnalyticsDashboard.module.css';

const stats = [
  { value: '12.5K', label: 'Total Views', change: '+12%', positive: true },
  { value: '3.2K', label: 'Unique Visitors', change: '+8%', positive: true },
  { value: '4m 32s', label: 'Avg Session', change: '-3%', positive: false },
  { value: '68%', label: 'Bounce Rate', change: '-5%', positive: true },
];

const weeklyData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 78 },
  { day: 'Wed', value: 52 },
  { day: 'Thu', value: 91 },
  { day: 'Fri', value: 84 },
  { day: 'Sat', value: 45 },
  { day: 'Sun', value: 62 },
];

const trafficSources = [
  { name: 'Direct', color: '#f4d03f', percentage: 60 },
  { name: 'Social', color: '#3498db', percentage: 20 },
  { name: 'Referral', color: '#e74c3c', percentage: 10 },
  { name: 'Search', color: '#9b59b6', percentage: 10 },
];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7d');

  return (
    <section className={styles.analyticsDashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BarChart3 className={styles.icon} size={20} />
          Analytics Dashboard
        </h2>
        <div className={styles.periodSelector}>
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.active : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
              {stat.positive ? '+' : ''}{stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Weekly Traffic</div>
          <div className={styles.barChart}>
            {weeklyData.map((data, index) => (
              <div key={index} className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{ height: `${data.value}%` }}
                />
                <span className={styles.barLabel}>{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Traffic Sources</div>
          <div
            className={styles.donutChart}
            style={{
              background: `conic-gradient(
                ${trafficSources.map((s, i) => {
                  const prev = trafficSources.slice(0, i).reduce((a, b) => a + b.percentage, 0);
                  return `${s.color} ${prev * 3.6}deg ${(prev + s.percentage) * 3.6}deg`;
                }).join(', ')}
              )`
            }}
          >
            <div className={styles.donutHole} />
          </div>
          <div className={styles.legend}>
            {trafficSources.map((source, index) => (
              <div key={index} className={styles.legendItem}>
                <span
                  className={styles.legendColor}
                  style={{ backgroundColor: source.color }}
                />
                <span>{source.name} ({source.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
