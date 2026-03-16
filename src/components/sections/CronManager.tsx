import { useState } from 'react';
import { Clock, Play, Pause, Trash2, Plus, Calendar, CheckCircle, AlertCircle, Clock3 } from 'lucide-react';
import styles from './CronManager.module.css';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string | null;
  nextRun: string;
  runCount: number;
}

const initialJobs: CronJob[] = [
  {
    id: '1',
    name: 'Garden Evolution',
    schedule: '0 */4 * * *',
    command: 'npm run evolve',
    description: 'Auto-enhance garden every 4 hours',
    status: 'active',
    lastRun: '2026-03-14 06:49',
    nextRun: '2026-03-14 10:49',
    runCount: 156,
  },
  {
    id: '2',
    name: 'Fizzy Task Check',
    schedule: '0 * * * *',
    command: 'npm run fizzy:check',
    description: 'Check for @hikari assignments hourly',
    status: 'active',
    lastRun: '2026-03-14 09:51',
    nextRun: '2026-03-14 10:51',
    runCount: 892,
  },
  {
    id: '3',
    name: 'Backup Database',
    schedule: '0 2 * * *',
    command: 'npm run backup',
    description: 'Daily database backup at 2 AM',
    status: 'active',
    lastRun: '2026-03-14 02:00',
    nextRun: '2026-03-15 02:00',
    runCount: 45,
  },
  {
    id: '4',
    name: 'Clean Temp Files',
    schedule: '0 0 * * 0',
    command: 'npm run cleanup',
    description: 'Weekly cleanup of temp files',
    status: 'paused',
    lastRun: '2026-03-09 00:00',
    nextRun: 'Paused',
    runCount: 12,
  },
  {
    id: '5',
    name: 'Health Check',
    schedule: '*/5 * * * *',
    command: 'npm run health',
    description: 'System health monitoring',
    status: 'active',
    lastRun: '2026-03-14 10:55',
    nextRun: '2026-03-14 11:00',
    runCount: 3456,
  },
];

const statusConfig = {
  active: { color: '#34d399', icon: CheckCircle, label: 'Active' },
  paused: { color: '#fbbf24', icon: Pause, label: 'Paused' },
  error: { color: '#ef4444', icon: AlertCircle, label: 'Error' },
};

function parseCron(schedule: string): string {
  const parts = schedule.split(' ');
  if (parts.length !== 5) return schedule;
  
  const [minute, hour, day, month, weekday] = parts;
  
  if (schedule === '0 */4 * * *') return 'Every 4 hours';
  if (schedule === '0 * * * *') return 'Every hour';
  if (schedule === '0 2 * * *') return 'Daily at 2:00 AM';
  if (schedule === '0 0 * * 0') return 'Weekly on Sunday';
  if (schedule === '*/5 * * * *') return 'Every 5 minutes';
  
  return schedule;
}

export default function CronManager() {
  const [jobs, setJobs] = useState<CronJob[]>(initialJobs);
  const [filter, setFilter] = useState<string>('all');

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: job.status === 'active' ? 'paused' : 'active' as const }
        : job
    ));
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    paused: jobs.filter(j => j.status === 'paused').length,
    totalRuns: jobs.reduce((acc, j) => acc + j.runCount, 0),
  };

  return (
    <section className={styles.cronManager} id="cron-manager">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Clock size={28} />
        </div>
        <h2 className={styles.title}>Cron Manager</h2>
        <p className={styles.subtitle}>Scheduled task automation</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Jobs</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#34d399' }}>{stats.active}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#fbbf24' }}>{stats.paused}</span>
          <span className={styles.statLabel}>Paused</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.totalRuns.toLocaleString()}</span>
          <span className={styles.statLabel}>Total Runs</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {['all', 'active', 'paused', 'error'].map(status => (
            <button
              key={status}
              className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button className={styles.addBtn}>
          <Plus size={16} />
          New Job
        </button>
      </div>

      <div className={styles.jobList}>
        {filteredJobs.map(job => {
          const StatusIcon = statusConfig[job.status].icon;
          return (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <div className={styles.jobInfo}>
                  <h3 className={styles.jobName}>{job.name}</h3>
                  <span 
                    className={styles.statusBadge}
                    style={{ color: statusConfig[job.status].color }}
                  >
                    <StatusIcon size={14} />
                    {statusConfig[job.status].label}
                  </span>
                </div>
                <div className={styles.jobActions}>
                  <button 
                    className={styles.actionBtn}
                    onClick={() => toggleStatus(job.id)}
                    title={job.status === 'active' ? 'Pause' : 'Resume'}
                  >
                    {job.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button 
                    className={styles.actionBtn}
                    onClick={() => deleteJob(job.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className={styles.description}>{job.description}</p>

              <div className={styles.schedule}>
                <Clock3 size={14} />
                <code>{job.schedule}</code>
                <span className={styles.humanReadable}>{parseCron(job.schedule)}</span>
              </div>

              <div className={styles.command}>
                <span className={styles.commandLabel}>Command:</span>
                <code>{job.command}</code>
              </div>

              <div className={styles.jobMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={14} />
                  <span>Last: {job.lastRun || 'Never'}</span>
                </div>
                <div className={styles.metaItem}>
                  <Clock size={14} />
                  <span>Next: {job.nextRun}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.runCount}>{job.runCount} runs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
