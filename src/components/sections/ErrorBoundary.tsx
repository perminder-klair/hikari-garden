import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Copy, RotateCcw } from 'lucide-react';
import styles from './ErrorBoundary.module.css';

interface ErrorItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  count: number;
  resolved: boolean;
}

const initialErrors: ErrorItem[] = [
  {
    id: '1',
    type: 'error',
    title: 'TypeError: Cannot read property',
    message: "Cannot read property 'map' of undefined at Component.render",
    timestamp: '2 min ago',
    count: 3,
    resolved: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Deprecation Warning',
    message: 'componentWillMount has been renamed and is not recommended',
    timestamp: '15 min ago',
    count: 1,
    resolved: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Performance Notice',
    message: 'Long task detected: 120ms on main thread',
    timestamp: '1 hour ago',
    count: 12,
    resolved: true,
  },
];

export default function ErrorBoundary() {
  const [errors, setErrors] = useState<ErrorItem[]>(initialErrors);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const activeErrors = errors.filter(e => !e.resolved).length;
  const criticalCount = errors.filter(e => e.type === 'error' && !e.resolved).length;

  const getStatusClass = () => {
    if (criticalCount > 0) return styles.statusCritical;
    if (activeErrors > 0) return styles.statusWarning;
    return styles.statusHealthy;
  };

  const getStatusText = () => {
    if (criticalCount > 0) return `${criticalCount} Critical`;
    if (activeErrors > 0) return `${activeErrors} Active`;
    return 'All Clear';
  };

  const filteredErrors = errors.filter(e => 
    filter === 'all' ? true : e.type === filter
  );

  const resolveError = (id: string) => {
    setErrors(prev => prev.map(e => 
      e.id === id ? { ...e, resolved: true } : e
    ));
  };

  const copyError = (message: string) => {
    navigator.clipboard.writeText(message);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'info': return <Info size={16} />;
      default: return <Info size={16} />;
    }
  };

  const totalCount = errors.reduce((sum, e) => sum + e.count, 0);

  return (
    <section className={styles.errorBoundary}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <AlertTriangle className={styles.icon} size={20} />
          Error Boundary
        </h2>
        <span className={`${styles.status} ${getStatusClass()}`}>
          <CheckCircle size={12} />
          {getStatusText()}
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{activeErrors}</div>
          <div className={styles.statLabel}>Active</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{errors.filter(e => e.resolved).length}</div>
          <div className={styles.statLabel}>Resolved</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalCount}</div>
          <div className={styles.statLabel}>Total Events</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{criticalCount}</div>
          <div className={styles.statLabel}>Critical</div>
        </div>
      </div>

      <div className={styles.errorList}>
        {filteredErrors.map((error) => (
          <div 
            key={error.id} 
            className={styles.errorItem}
            style={{ opacity: error.resolved ? 0.5 : 1 }}
          >
            <div className={`${styles.errorIcon} ${styles[error.type]}`}>
              {getIcon(error.type)}
            </div>
            <div className={styles.errorContent}>
              <div className={styles.errorTitle}>{error.title}</div>
              <div className={styles.errorMessage}>{error.message}</div>
              <div className={styles.errorMeta}>
                <span>{error.timestamp}</span>
                <span>•</span>
                <span>{error.count} occurrence{error.count > 1 ? 's' : ''}</span>
                {error.resolved && <span>• Resolved</span>}
              </div>
            </div>
            <div className={styles.errorActions}>
              <button 
                className={styles.actionBtn}
                onClick={() => copyError(error.message)}
                title="Copy stack trace"
              >
                <Copy size={14} />
              </button>
              {!error.resolved && (
                <button 
                  className={styles.actionBtn}
                  onClick={() => resolveError(error.id)}
                  title="Mark resolved"
                >
                  <CheckCircle size={14} />
                </button>
              )}
              {error.resolved && (
                <button 
                  className={styles.actionBtn}
                  onClick={() => setErrors(prev => prev.map(e => e.id === error.id ? { ...e, resolved: false } : e))}
                  title="Reopen"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button className={styles.actionBtn} title="Dismiss">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
