import { useState } from 'react';
import { HardDrive, TrendingUp, TrendingDown, Activity, Zap, Trash2, RefreshCw } from 'lucide-react';
import styles from './CacheMonitor.module.css';

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: string;
  entries: number;
  evictions: number;
}

interface CacheEntry {
  id: string;
  key: string;
  size: string;
  ttl: string;
  lastAccessed: string;
  hits: number;
}

const cacheStats: CacheStats = {
  hits: 45231,
  misses: 3241,
  hitRate: 93.3,
  size: '256 MB',
  entries: 1247,
  evictions: 89,
};

const cacheEntries: CacheEntry[] = [
  { id: '1', key: 'user:profile:1234', size: '12 KB', ttl: '45m', lastAccessed: '2m ago', hits: 342 },
  { id: '2', key: 'api:projects:list', size: '45 KB', ttl: '15m', lastAccessed: '5s ago', hits: 892 },
  { id: '3', key: 'session:abc123', size: '2 KB', ttl: '2h', lastAccessed: '1m ago', hits: 1247 },
  { id: '4', key: 'config:app', size: '8 KB', ttl: '24h', lastAccessed: '15m ago', hits: 56 },
  { id: '5', key: 'cache:weather', size: '156 KB', ttl: '30m', lastAccessed: '8m ago', hits: 234 },
  { id: '6', key: 'api:tasks:recent', size: '67 KB', ttl: '10m', lastAccessed: '3m ago', hits: 567 },
];

export default function CacheMonitor() {
  const [filter, setFilter] = useState('all');
  const [isClearing, setIsClearing] = useState(false);

  const clearCache = () => {
    setIsClearing(true);
    setTimeout(() => setIsClearing(false), 2000);
  };

  const hitRateTrend = cacheStats.hitRate > 90 ? 'up' : 'down';

  return (
    <section className={styles.cacheMonitor} id="cache-monitor">
      <div className={styles.header}>
        <div className={styles.icon}>
          <HardDrive size={28} />
        </div>
        <h2 className={styles.title}>Cache Monitor</h2>
        <p className={styles.subtitle}>Performance analytics & management</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Hit Rate</span>
            {hitRateTrend === 'up' ? <TrendingUp size={16} color="#34d399" /> : <TrendingDown size={16} color="#ef4444" />}
          </div>
          <span className={styles.statValue} style={{ color: '#34d399' }}>{cacheStats.hitRate}%</span>
          <div className={styles.statBar}>
            <div 
              className={styles.statBarFill} 
              style={{ width: `${cacheStats.hitRate}%`, background: '#34d399' }}
            />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Cache Size</span>
            <HardDrive size={16} color="#60a5fa" />
          </div>
          <span className={styles.statValue}>{cacheStats.size}</span>
          <span className={styles.statSub}>{cacheStats.entries} entries</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Hits</span>
            <Zap size={16} color="#fbbf24" />
          </div>
          <span className={styles.statValue}>{cacheStats.hits.toLocaleString()}</span>
          <span className={styles.statSub}>{cacheStats.misses.toLocaleString()} misses</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Evictions</span>
            <Activity size={16} color="#a78bfa" />
          </div>
          <span className={styles.statValue}>{cacheStats.evictions}</span>
          <span className={styles.statSub}>Last hour</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {['all', 'hot', 'cold', 'expiring'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button 
          className={styles.clearBtn} 
          onClick={clearCache}
          disabled={isClearing}
        >
          {isClearing ? <RefreshCw size={16} className={styles.spin} /> : <Trash2 size={16} />}
          {isClearing ? 'Clearing...' : 'Clear Cache'}
        </button>
      </div>

      <div className={styles.entriesTable}>
        <div className={styles.tableHeader}>
          <span>Key</span>
          <span>Size</span>
          <span>TTL</span>
          <span>Last Access</span>
          <span>Hits</span>
        </div>
        <div className={styles.tableBody}>
          {cacheEntries.map(entry => (
            <div key={entry.id} className={styles.tableRow}>
              <code className={styles.key}>{entry.key}</code>
              <span>{entry.size}</span>
              <span className={styles.ttl}>{entry.ttl}</span>
              <span className={styles.accessed}>{entry.lastAccessed}</span>
              <span className={styles.hits}>{entry.hits}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
