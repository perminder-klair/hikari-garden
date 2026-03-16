import { useState } from 'react';
import { Download, FileJson, FileText, Image, Calendar, CheckCircle } from 'lucide-react';
import styles from './ExportManager.module.css';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const exportFormats: ExportFormat[] = [
  { id: 'json', name: 'JSON Export', description: 'Raw data with all metadata', icon: <FileJson size={20} /> },
  { id: 'markdown', name: 'Markdown', description: 'Readable text format', icon: <FileText size={20} /> },
  { id: 'pdf', name: 'PDF Report', description: 'Formatted document', icon: <FileText size={20} /> },
  { id: 'images', name: 'Screenshots', description: 'Visual exports of sections', icon: <Image size={20} /> },
];

interface RecentExport {
  id: string;
  name: string;
  date: string;
  size: string;
}

const recentExports: RecentExport[] = [
  { id: '1', name: 'garden-backup-2026-03-14.json', date: 'Yesterday', size: '2.4 MB' },
  { id: '2', name: 'march-reflections.md', date: '3 days ago', size: '156 KB' },
  { id: '3', name: 'q1-summary.pdf', date: '1 week ago', size: '1.8 MB' },
];

export default function ExportManager() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (formatId: string) => {
    setExporting(formatId);
    setTimeout(() => {
      setExporting(null);
    }, 2000);
  };

  return (
    <section className={styles.exportManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Download className={styles.icon} size={20} />
          Export Manager
        </h2>
      </div>

      <div className={styles.exportGrid}>
        {exportFormats.map((format) => (
          <div
            key={format.id}
            className={styles.exportCard}
            onClick={() => handleExport(format.id)}
          >
            <div className={styles.exportIcon}>
              {exporting === format.id ? <CheckCircle size={20} /> : format.icon}
            </div>
            <div className={styles.exportName}>{format.name}</div>
            <div className={styles.exportDesc}>{format.description}</div>
          </div>
        ))}
      </div>

      <div className={styles.recentExports}>
        <div className={styles.sectionTitle}>Recent Exports</div>
        <div className={styles.exportList}>
          {recentExports.map((export_) => (
            <div key={export_.id} className={styles.exportItem}>
              <div className={styles.exportInfo}>
                <Calendar size={14} color="var(--text-secondary)" />
                <span className={styles.exportFileName}>{export_.name}</span>
                <span className={styles.exportDate}>{export_.date}</span>
              </div>
              <span className={styles.exportSize}>{export_.size}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
