import { useState, useRef, useEffect } from 'react';
import { FileText, Search, Download, Trash2, Filter, AlertCircle, Info, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import styles from './LogViewer.module.css';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  details?: string;
}

const initialLogs: LogEntry[] = [
  { id: '1', timestamp: '2026-03-14 10:55:32', level: 'info', source: 'Garden', message: 'Digital Garden Evolution completed successfully', details: 'Added 4 new sections: EnvironmentVars, DatabaseSchema, CronManager, LogViewer' },
  { id: '2', timestamp: '2026-03-14 10:55:28', level: 'info', source: 'Docker', message: 'Container hikari-garden rebuilt and restarted', details: 'Image: hikari-garden:latest, Port: 3999' },
  { id: '3', timestamp: '2026-03-14 10:51:15', level: 'info', source: 'Fizzy', message: 'Task check completed - no assignments found', details: 'Board: Agents, Last check: 2026-03-14 10:51:00' },
  { id: '4', timestamp: '2026-03-14 10:49:03', level: 'info', source: 'Cron', message: 'Garden Evolution job executed', details: 'Duration: 2m 15s, Status: success' },
  { id: '5', timestamp: '2026-03-14 10:45:12', level: 'warn', source: 'API', message: 'Rate limit approaching for Groq API', details: 'Remaining: 15 requests, Reset: 60s' },
  { id: '6', timestamp: '2026-03-14 10:30:00', level: 'info', source: 'Backup', message: 'Database backup completed', details: 'Size: 45MB, Duration: 12s' },
  { id: '7', timestamp: '2026-03-14 10:15:45', level: 'error', source: 'Auth', message: 'Failed login attempt', details: 'IP: 192.168.1.100, User: unknown' },
  { id: '8', timestamp: '2026-03-14 10:00:00', level: 'info', source: 'Health', message: 'System health check passed', details: 'CPU: 12%, Memory: 45%, Disk: 67%' },
  { id: '9', timestamp: '2026-03-14 09:55:22', level: 'debug', source: 'Garden', message: 'Component render time: 45ms', details: 'Section: Terminal, Props: 3' },
  { id: '10', timestamp: '2026-03-14 09:51:00', level: 'info', source: 'Fizzy', message: 'Task check completed - no assignments found', details: 'Board: Agents' },
  { id: '11', timestamp: '2026-03-14 09:30:15', level: 'warn', source: 'Memory', message: 'Memory usage above 80%', details: 'Current: 82%, Threshold: 80%' },
  { id: '12', timestamp: '2026-03-14 09:00:00', level: 'info', source: 'Cron', message: 'Daily maintenance tasks completed', details: 'Tasks: 5, Duration: 3m 42s' },
];

const levelConfig = {
  info: { color: '#60a5fa', icon: Info, bg: 'rgba(96, 165, 250, 0.1)' },
  warn: { color: '#fbbf24', icon: AlertTriangle, bg: 'rgba(251, 191, 36, 0.1)' },
  error: { color: '#ef4444', icon: AlertCircle, bg: 'rgba(239, 68, 68, 0.1)' },
  debug: { color: '#9ca3af', icon: Terminal, bg: 'rgba(156, 163, 175, 0.1)' },
};

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filter === 'all' || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const stats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warn: logs.filter(l => l.level === 'warn').length,
    error: logs.filter(l => l.level === 'error').length,
  };

  const clearLogs = () => {
    setLogs([]);
    setSelectedLog(null);
  };

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  return (
    <section className={styles.logViewer} id="log-viewer">
      <div className={styles.header}>
        <div className={styles.icon}>
          <FileText size={28} />
        </div>
        <h2 className={styles.title}>Log Viewer</h2>
        <p className={styles.subtitle}>Application logs and events</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.stat}>
          <Info size={16} style={{ color: '#60a5fa' }} />
          <span className={styles.statValue} style={{ color: '#60a5fa' }}>{stats.info}</span>
          <span className={styles.statLabel}>Info</span>
        </div>
        <div className={styles.stat}>
          <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
          <span className={styles.statValue} style={{ color: '#fbbf24' }}>{stats.warn}</span>
          <span className={styles.statLabel}>Warn</span>
        </div>
        <div className={styles.stat}>
          <AlertCircle size={16} style={{ color: '#ef4444' }} />
          <span className={styles.statValue} style={{ color: '#ef4444' }}>{stats.error}</span>
          <span className={styles.statLabel}>Error</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {['all', 'info', 'warn', 'error', 'debug'].map(level => (
            <button
              key={level}
              className={`${styles.filterBtn} ${filter === level ? styles.active : ''}`}
              onClick={() => setFilter(level)}
            >
              {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={exportLogs} title="Export">
            <Download size={16} />
          </button>
          <button className={styles.actionBtn} onClick={clearLogs} title="Clear">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className={styles.logContainer}>
        {filteredLogs.map(log => {
          const LevelIcon = levelConfig[log.level].icon;
          return (
            <div
              key={log.id}
              className={`${styles.logEntry} ${selectedLog?.id === log.id ? styles.selected : ''}`}
              onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              style={{ background: levelConfig[log.level].bg }}
            >
              <div className={styles.logLevel} style={{ color: levelConfig[log.level].color }}>
                <LevelIcon size={16} />
              </div>
              <div className={styles.logTime}>{log.timestamp.split(' ')[1]}</div>
              <div className={styles.logSource}>{log.source}</div>
              <div className={styles.logMessage}>{log.message}</div>
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      {selectedLog && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h4>Log Details</h4>
            <button onClick={() => setSelectedLog(null)}>×</button>
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Timestamp:</span>
              <span>{selectedLog.timestamp}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Level:</span>
              <span style={{ color: levelConfig[selectedLog.level].color, textTransform: 'uppercase' }}>
                {selectedLog.level}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Source:</span>
              <span>{selectedLog.source}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Message:</span>
              <span>{selectedLog.message}</span>
            </div>
            {selectedLog.details && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Details:</span>
                <pre className={styles.detailPre}>{selectedLog.details}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
