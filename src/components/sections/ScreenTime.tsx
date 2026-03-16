import { useState, useMemo } from 'react';
import { Monitor, Smartphone, Clock, Eye, Moon, Sun, AlertCircle } from 'lucide-react';
import styles from './ScreenTime.module.css';

interface AppUsage {
  app: string;
  category: 'productive' | 'entertainment' | 'social' | 'communication';
  duration: number; // minutes
  icon: string;
}

interface DailyUsage {
  date: string;
  totalMinutes: number;
  unlocks: number;
  apps: AppUsage[];
}

const sampleData: DailyUsage[] = [
  {
    date: '2026-03-10',
    totalMinutes: 420,
    unlocks: 85,
    apps: [
      { app: 'VS Code', category: 'productive', duration: 180, icon: '💻' },
      { app: 'Chrome', category: 'productive', duration: 90, icon: '🌐' },
      { app: 'Discord', category: 'communication', duration: 60, icon: '💬' },
      { app: 'YouTube', category: 'entertainment', duration: 90, icon: '▶️' },
    ],
  },
  {
    date: '2026-03-11',
    totalMinutes: 380,
    unlocks: 72,
    apps: [
      { app: 'VS Code', category: 'productive', duration: 200, icon: '💻' },
      { app: 'Chrome', category: 'productive', duration: 80, icon: '🌐' },
      { app: 'Discord', category: 'communication', duration: 50, icon: '💬' },
      { app: 'Spotify', category: 'entertainment', duration: 50, icon: '🎵' },
    ],
  },
  {
    date: '2026-03-12',
    totalMinutes: 450,
    unlocks: 95,
    apps: [
      { app: 'VS Code', category: 'productive', duration: 160, icon: '💻' },
      { app: 'Chrome', category: 'productive', duration: 100, icon: '🌐' },
      { app: 'Twitter', category: 'social', duration: 90, icon: '🐦' },
      { app: 'YouTube', category: 'entertainment', duration: 100, icon: '▶️' },
    ],
  },
  {
    date: '2026-03-13',
    totalMinutes: 320,
    unlocks: 60,
    apps: [
      { app: 'VS Code', category: 'productive', duration: 220, icon: '💻' },
      { app: 'Chrome', category: 'productive', duration: 60, icon: '🌐' },
      { app: 'Discord', category: 'communication', duration: 40, icon: '💬' },
    ],
  },
  {
    date: '2026-03-14',
    totalMinutes: 360,
    unlocks: 68,
    apps: [
      { app: 'VS Code', category: 'productive', duration: 190, icon: '💻' },
      { app: 'Chrome', category: 'productive', duration: 70, icon: '🌐' },
      { app: 'Discord', category: 'communication', duration: 50, icon: '💬' },
      { app: 'Netflix', category: 'entertainment', duration: 50, icon: '🎬' },
    ],
  },
  {
    date: '2026-03-15',
    totalMinutes: 300,
    unlocks: 55,
    apps: [
      { app: 'VS Code', category: 'productive', duration: 210, icon: '💻' },
      { app: 'Chrome', category: 'productive', duration: 50, icon: '🌐' },
      { app: 'Discord', category: 'communication', duration: 40, icon: '💬' },
    ],
  },
];

const categoryColors = {
  productive: '#58d68d',
  entertainment: '#f4d03f',
  social: '#85c1e9',
  communication: '#bb8fce',
};

export default function ScreenTime() {
  const [selectedDay, setSelectedDay] = useState<DailyUsage>(sampleData[sampleData.length - 1]);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const stats = useMemo(() => {
    const avgDaily = sampleData.reduce((acc, d) => acc + d.totalMinutes, 0) / sampleData.length;
    const avgUnlocks = Math.round(sampleData.reduce((acc, d) => acc + d.unlocks, 0) / sampleData.length);
    const productiveTime = selectedDay.apps
      .filter(a => a.category === 'productive')
      .reduce((acc, a) => acc + a.duration, 0);
    const productivePercent = Math.round((productiveTime / selectedDay.totalMinutes) * 100);
    return { avgDaily: Math.round(avgDaily), avgUnlocks, productivePercent };
  }, [selectedDay]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Monitor className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Screen Time</h2>
        <p className={styles.sectionSubtitle}>Digital wellness dashboard</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatDuration(stats.avgDaily)}</span>
          <span className={styles.statLabel}>Daily Average</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.avgUnlocks}</span>
          <span className={styles.statLabel}>Avg Unlocks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.productivePercent}%</span>
          <span className={styles.statLabel}>Productive</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Usage Breakdown</h3>
            <select 
              value={selectedDay.date}
              onChange={(e) => setSelectedDay(sampleData.find(d => d.date === e.target.value) || sampleData[0])}
              className={styles.select}
            >
              {sampleData.map(day => (
                <option key={day.date} value={day.date}>{day.date}</option>
              ))}
            </select>
          </div>

          <div className={styles.totalTime}>
            <Clock size={24} />
            <span className={styles.totalValue}>{formatDuration(selectedDay.totalMinutes)}</span>
            <span className={styles.totalLabel}>total screen time</span>
          </div>

          <div className={styles.appList}>
            {selectedDay.apps.sort((a, b) => b.duration - a.duration).map((app) => (
              <div key={app.app} className={styles.appItem}>
                <div className={styles.appIcon} style={{ background: categoryColors[app.category] }}>
                  {app.icon}
                </div>
                <div className={styles.appInfo}>
                  <div className={styles.appHeader}>
                    <span className={styles.appName}>{app.app}</span>
                    <span className={styles.appDuration}>{formatDuration(app.duration)}</span>
                  </div>
                  <div className={styles.appBar}>
                    <div 
                      className={styles.appBarFill}
                      style={{ 
                        width: `${(app.duration / selectedDay.totalMinutes) * 100}%`,
                        background: categoryColors[app.category]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Wellness Insights</h3>
          
          <div className={styles.insights}>
            <div className={styles.insight}>
              <Eye size={20} />
              <div>
                <span className={styles.insightLabel}>Screen Breaks</span>
                <span className={styles.insightValue}>Take a 20-second break every 20 minutes</span>
              </div>
            </div>
            <div className={styles.insight}>
              <Moon size={20} />
              <div>
                <span className={styles.insightLabel}>Wind Down</span>
                <span className={styles.insightValue}>Reduce screen time 1 hour before bed</span>
              </div>
            </div>
            <div className={styles.insight}>
              <Sun size={20} />
              <div>
                <span className={styles.insightLabel}>Morning Routine</span>
                <span className={styles.insightValue}>Wait 30 minutes before first screen use</span>
              </div>
            </div>
          </div>

          <div className={styles.limits}>
            <h4 className={styles.limitsTitle}>Daily Limits</h4>
            <div className={styles.limitItem}>
              <span>Social Media</span>
              <span className={styles.limitValue}>30 min / 60 min</span>
            </div>
            <div className={styles.limitItem}>
              <span>Entertainment</span>
              <span className={styles.limitValue}>90 min / 120 min</span>
            </div>
            <div className={styles.limitItem}>
              <span>Total Screen Time</span>
              <span className={styles.limitValue}>{formatDuration(selectedDay.totalMinutes)} / 8h</span>
            </div>
          </div>

          {showLimitAlert && (
            <div className={styles.alert}>
              <AlertCircle size={16} />
              <span>You're approaching your daily limit</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
