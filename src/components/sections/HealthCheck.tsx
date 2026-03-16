import { useState, useEffect } from 'react';
import { Heart, Database, Server, Wifi, Shield, Clock, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import styles from './HealthCheck.module.css';

interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: string;
  lastChecked: string;
}

const initialChecks: HealthCheck[] = [
  { id: '1', name: 'API Gateway', status: 'healthy', responseTime: '45ms', lastChecked: 'Just now' },
  { id: '2', name: 'Database', status: 'healthy', responseTime: '12ms', lastChecked: 'Just now' },
  { id: '3', name: 'Cache Layer', status: 'healthy', responseTime: '3ms', lastChecked: 'Just now' },
  { id: '4', name: 'Auth Service', status: 'healthy', responseTime: '28ms', lastChecked: 'Just now' },
  { id: '5', name: 'File Storage', status: 'warning', responseTime: '234ms', lastChecked: 'Just now' },
  { id: '6', name: 'Search Index', status: 'healthy', responseTime: '67ms', lastChecked: 'Just now' },
];

const getIcon = (name: string) => {
  switch (name) {
    case 'API Gateway': return <Wifi size={20} />;
    case 'Database': return <Database size={20} />;
    case 'Cache Layer': return <Server size={20} />;
    case 'Auth Service': return <Shield size={20} />;
    case 'File Storage': return <Server size={20} />;
    case 'Search Index': return <Clock size={20} />;
    default: return <Heart size={20} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return <CheckCircle size={16} />;
    case 'warning': return <AlertTriangle size={16} />;
    case 'critical': return <AlertCircle size={16} />;
    default: return <CheckCircle size={16} />;
  }
};

export default function HealthCheck() {
  const [checks, setChecks] = useState<HealthCheck[]>(initialChecks);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setChecks(prev => prev.map(check => ({
        ...check,
        responseTime: `${Math.floor(Math.random() * 100 + 10)}ms`,
        lastChecked: 'Just now',
      })));
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const healthyCount = checks.filter(c => c.status === 'healthy').length;
  const uptime = 99.98;

  return (
    <section className={styles.healthCheck}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Heart className={styles.icon} size={20} />
          Health Check
        </h2>
        <div className={styles.status}>
          <span className={styles.statusIndicator} />
          {healthyCount}/{checks.length} Healthy
        </div>
      </div>

      <div className={styles.checksGrid}>
        {checks.map((check) => (
          <div key={check.id} className={styles.checkCard}>
            <div className={`${styles.checkIcon} ${styles[check.status]}`}>
              {getIcon(check.name)}
            </div>
            <div className={styles.checkInfo}>
              <div className={styles.checkName}>{check.name}</div>
              <div className={styles.checkStatus}>
                {getStatusIcon(check.status)}
                <span style={{ marginLeft: '0.25rem' }}>{check.status}</span>
              </div>
            </div>
            <div className={styles.checkResponse}>
              {check.responseTime}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.uptimeBar}>
        <div className={styles.uptimeHeader}>
          <span className={styles.uptimeLabel}>30-Day Uptime</span>
          <span className={styles.uptimeValue}>{uptime}%</span>
        </div>
        <div className={styles.uptimeTrack}>
          <div 
            className={styles.uptimeFill} 
            style={{ width: `${uptime}%` }}
          />
        </div>
      </div>
    </section>
  );
}
