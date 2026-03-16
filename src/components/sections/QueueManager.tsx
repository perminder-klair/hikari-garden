import { useState } from 'react';
import { ListTodo, Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import styles from './QueueManager.module.css';

interface QueueJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  duration: string;
  attempts: number;
}

const initialJobs: QueueJob[] = [
  { id: '1', name: 'Process Image Uploads', status: 'running', priority: 'medium', progress: 67, duration: '2m 34s', attempts: 1 },
  { id: '2', name: 'Send Email Notifications', status: 'pending', priority: 'high', progress: 0, duration: '-', attempts: 0 },
  { id: '3', name: 'Generate Report PDF', status: 'pending', priority: 'low', progress: 0, duration: '-', attempts: 0 },
  { id: '4', name: 'Sync External Data', status: 'completed', priority: 'medium', progress: 100, duration: '45s', attempts: 1 },
  { id: '5', name: 'Backup Database', status: 'failed', priority: 'critical', progress: 23, duration: '5m 12s', attempts: 3 },
  { id: '6', name: 'Clean Old Sessions', status: 'completed', priority: 'low', progress: 100, duration: '12s', attempts: 1 },
];

const statusConfig = {
  pending: { color: '#9ca3af', icon: Clock, label: 'Pending' },
  running: { color: '#60a5fa', icon: Play, label: 'Running' },
  completed: { color: '#34d399', icon: CheckCircle, label: 'Completed' },
  failed: { color: '#ef4444', icon: AlertCircle, label: 'Failed' },
};

const priorityColors = {
  low: '#9ca3af',
  medium: '#60a5fa',
  high: '#fbbf24',
  critical: '#ef4444',
};

export default function QueueManager() {
  const [jobs, setJobs] = useState<QueueJob[]>(initialJobs);
  const [filter, setFilter] = useState('all');

  const retryJob = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: 'pending', progress: 0, attempts: job.attempts + 1 }
        : job
    ));
  };

  const toggleJob = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: job.status === 'running' ? 'paused' : 'running' as const }
        : job
    ));
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const stats = {
    pending: jobs.filter(j => j.status === 'pending').length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  return (
    <section className={styles.queueManager} id="queue-manager">
      <div className={styles.header}>
        <div className={styles.icon}>
          <ListTodo size={28} />
        </div>
        <h2 className={styles.title}>Queue Manager</h2>
        <p className={styles.subtitle}>Background job orchestration</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <Clock size={16} />
          <span className={styles.statValue} style={{ color: '#9ca3af' }}>{stats.pending}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.stat}>
          <Play size={16} />
          <span className={styles.statValue} style={{ color: '#60a5fa' }}>{stats.running}</span>
          <span className={styles.statLabel}>Running</span>
        </div>
        <div className={styles.stat}>
          <CheckCircle size={16} />
          <span className={styles.statValue} style={{ color: '#34d399' }}>{stats.completed}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <AlertCircle size={16} />
          <span className={styles.statValue} style={{ color: '#ef4444' }}>{stats.failed}</span>
          <span className={styles.statLabel}>Failed</span>
        </div>
      </div>

      <div className={styles.filters}>
        {['all', 'pending', 'running', 'completed', 'failed'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.jobList}>
        {filteredJobs.map(job => {
          const StatusIcon = statusConfig[job.status].icon;
          return (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <div className={styles.jobInfo}>
                  <h3>{job.name}</h3>
                  <span 
                    className={styles.priority}
                    style={{ color: priorityColors[job.priority] }}
                  >
                    {job.priority}
                  </span>
                </div>
                <div className={styles.jobActions}>
                  {job.status === 'failed' && (
                    <button 
                      className={styles.actionBtn}
                      onClick={() => retryJob(job.id)}
                      title="Retry"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                  {(job.status === 'running' || job.status === 'pending') && (
                    <button 
                      className={styles.actionBtn}
                      onClick={() => toggleJob(job.id)}
                      title={job.status === 'running' ? 'Pause' : 'Resume'}
                    >
                      {job.status === 'running' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${job.progress}%`,
                    background: statusConfig[job.status].color 
                  }}
                />
              </div>

              <div className={styles.jobMeta}>
                <span 
                  className={styles.status}
                  style={{ color: statusConfig[job.status].color }}
                >
                  <StatusIcon size={14} />
                  {statusConfig[job.status].label}
                </span>
                <span className={styles.duration}>{job.duration}</span>
                <span className={styles.attempts}>{job.attempts} attempt{job.attempts !== 1 ? 's' : ''}</span>
                <span className={styles.progressText}>{job.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
