import { useState } from 'react';
import { BookOpen, Search, FileText, Code, Layers, Zap, Shield, Database } from 'lucide-react';
import styles from './DocumentationHub.module.css';

const documents = [
  {
    id: 1,
    title: 'Getting Started',
    description: 'Quick start guide for new users and contributors',
    icon: <Zap size={20} />,
    tag: 'Guide',
    updated: '2 days ago',
  },
  {
    id: 2,
    title: 'API Reference',
    description: 'Complete API documentation with examples',
    icon: <Code size={20} />,
    tag: 'Reference',
    updated: '1 week ago',
  },
  {
    id: 3,
    title: 'Architecture',
    description: 'System design and component architecture',
    icon: <Layers size={20} />,
    tag: 'Technical',
    updated: '3 days ago',
  },
  {
    id: 4,
    title: 'Security Guide',
    description: 'Security best practices and guidelines',
    icon: <Shield size={20} />,
    tag: 'Security',
    updated: '2 weeks ago',
  },
  {
    id: 5,
    title: 'Database Schema',
    description: 'Data models and relationships documentation',
    icon: <Database size={20} />,
    tag: 'Technical',
    updated: '5 days ago',
  },
  {
    id: 6,
    title: 'Changelog',
    description: 'Version history and release notes',
    icon: <FileText size={20} />,
    tag: 'Reference',
    updated: 'Today',
  },
];

export default function DocumentationHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.documentationHub}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BookOpen className={styles.icon} size={20} />
          Documentation Hub
        </h2>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className={styles.searchBtn}>
          <Search size={18} />
        </button>
      </div>

      <div className={styles.docsGrid}>
        {filteredDocs.map((doc) => (
          <div key={doc.id} className={styles.docCard}>
            <div className={styles.docIcon}>{doc.icon}</div>
            <h3 className={styles.docTitle}>{doc.title}</h3>
            <p className={styles.docDescription}>{doc.description}</p>
            <div className={styles.docMeta}>
              <span className={styles.docTag}>{doc.tag}</span>
              <span>{doc.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
