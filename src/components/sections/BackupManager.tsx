import { useState } from 'react';
import { Database, Download, Trash2, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import styles from './BackupManager.module.css';

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  status: 'complete' | 'in_progress' | 'failed';
}

const initialBackups: Backup[] = [
  { id: '1', name: 'Auto-backup-2026-03-14', date: 'Today, 14:30', size: '245 MB', status: 'complete' },
  { id: '2', name: 'Manual-backup-2026-03-13', date: 'Yesterday, 09:15', size: '238 MB', status: 'complete' },
  { id: '3', name: 'Auto-backup-2026-03-13', date: 'Yesterday, 02:00', size: '238 MB', status: 'complete' },
  { id: '4', name: 'Weekly-backup-2026-03-10', date: '4 days ago', size: '231 MB', status: 'complete' },
];

export default function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const createBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup: Backup = {
        id: Date.now().toString(),
        name: `Manual-backup-${new Date().toISOString().split('T')[0]}`,
        date: 'Just now',
        size: '247 MB',
        status: 'complete',
      };
      setBackups(prev => [newBackup, ...prev]);
      setIsBackingUp(false);
    }, 2000);
  };

  const deleteBackup = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
  };

  const restoreBackup = (id: string) => {
    // Simulate restore
    alert(`Restoring backup ${id}...`);
  };

  const totalSize = '1.2 GB';
  const lastBackup = '2 hours ago';
  const autoBackupEnabled = true;

  return (
    <section className={styles.backupManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Database className={styles.icon} size={20} />
          Backup Manager
        </h2>
        <button 
          className={styles.backupBtn} 
          onClick={createBackup}
          disabled={isBackingUp}
        >
          {isBackingUp ? <Clock size={14} /> : <Download size={14} />}
          {isBackingUp ? 'Backing up...' : 'Backup Now'}
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{backups.length}</div>
          <div className={styles.statLabel}>Total Backups</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalSize}</div>
          <div className={styles.statLabel}>Storage Used</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{lastBackup}</div>
          <div className={styles.statLabel}>Last Backup</div>
        </div>
      </div>

      <div className={styles.backupList}>
        {backups.map((backup) => (
          <div key={backup.id} className={styles.backupItem}>
            <div className={styles.backupIcon}>
              <CheckCircle size={20} />
            </div>
            <div className={styles.backupInfo}>
              <div className={styles.backupName}>{backup.name}</div>
              <div className={styles.backupMeta}>
                {backup.date} • {autoBackupEnabled && backup.name.startsWith('Auto') ? 'Auto' : 'Manual'}
              </div>
            </div>
            <div className={styles.backupSize}>{backup.size}</div>
            <div className={styles.backupActions}>
              <button 
                className={styles.actionBtn} 
                onClick={() => restoreBackup(backup.id)}
                title="Restore"
              >
                <RotateCcw size={14} />
              </button>
              <button 
                className={styles.actionBtn} 
                onClick={() => deleteBackup(backup.id)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
