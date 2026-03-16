import { useState } from 'react';
import { Archive, Folder, FileText, Image, Music, Video, Box, Calendar, Search, Trash2, RotateCcw } from 'lucide-react';
import styles from './ArchiveVault.module.css';

interface ArchiveItem {
  id: string;
  title: string;
  type: 'project' | 'document' | 'photo' | 'audio' | 'video' | 'memory';
  date: string;
  description: string;
  tags: string[];
  size?: string;
}

const archiveItems: ArchiveItem[] = [
  { id: '1', title: 'ListMe Platform', type: 'project', date: '2019-2022', description: 'Previous startup venture - local business discovery platform', tags: ['startup', 'legacy', 'entrepreneurship'], size: '2.4 GB' },
  { id: '2', title: 'Packrs Delivery App', type: 'project', date: '2020-2021', description: 'On-demand delivery service platform', tags: ['mobile', 'delivery', 'legacy'], size: '1.8 GB' },
  { id: '3', title: 'Early Portfolio', type: 'document', date: '2015-2018', description: 'First professional portfolio and case studies', tags: ['portfolio', 'career', 'growth'], size: '156 MB' },
  { id: '4', title: 'University Projects', type: 'project', date: '2012-2015', description: 'Computer Science coursework and side projects', tags: ['education', 'learning', 'nostalgia'], size: '890 MB' },
  { id: '5', title: 'First Code', type: 'memory', date: '2010', description: 'Hello World and early programming experiments', tags: ['beginnings', 'nostalgia', 'milestone'] },
  { id: '6', title: 'Travel Photos 2018', type: 'photo', date: '2018', description: 'Solo backpacking trip through Southeast Asia', tags: ['travel', 'memories', 'adventure'], size: '4.2 GB' },
  { id: '7', title: 'Mixtape Collection', type: 'audio', date: '2015-2020', description: 'Curated playlists and music discoveries', tags: ['music', 'nostalgia', 'creativity'], size: '12 GB' },
  { id: '8', title: 'Family Videos', type: 'video', date: 'Various', description: 'Digitized family memories and celebrations', tags: ['family', 'memories', 'precious'], size: '28 GB' },
];

const typeIcons = {
  project: Folder,
  document: FileText,
  photo: Image,
  audio: Music,
  video: Video,
  memory: Box,
};

const typeColors = {
  project: '#60a5fa',
  document: '#a78bfa',
  photo: '#f472b6',
  audio: '#34d399',
  video: '#fbbf24',
  memory: '#f87171',
};

export default function ArchiveVault() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [trashedItems, setTrashedItems] = useState<Set<string>>(new Set());

  const filteredItems = archiveItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch && !trashedItems.has(item.id);
  });

  const handleTrash = (id: string) => {
    setTrashedItems(prev => new Set([...prev, id]));
  };

  const handleRestore = (id: string) => {
    setTrashedItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const totalSize = filteredItems.reduce((acc, item) => {
    if (item.size) {
      const size = parseFloat(item.size);
      return acc + size;
    }
    return acc;
  }, 0);

  return (
    <section className={styles.vault} id="archive-vault">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Archive size={28} />
        </div>
        <h2 className={styles.title}>Archive Vault</h2>
        <p className={styles.subtitle}>Preserved memories and past projects</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {['all', 'project', 'document', 'photo', 'audio', 'video', 'memory'].map((type) => (
            <button
              key={type}
              className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{filteredItems.length}</span>
          <span className={styles.statLabel}>Items</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalSize.toFixed(1)} GB</span>
          <span className={styles.statLabel}>Total Size</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{trashedItems.size}</span>
          <span className={styles.statLabel}>In Trash</span>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredItems.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <div
              key={item.id}
              className={styles.item}
              onClick={() => setSelectedItem(item)}
              style={{ '--type-color': typeColors[item.type] } as React.CSSProperties}
            >
              <div className={styles.itemHeader}>
                <Icon size={20} style={{ color: typeColors[item.type] }} />
                <button
                  className={styles.trashBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrash(item.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDesc}>{item.description}</p>
              <div className={styles.itemMeta}>
                <span className={styles.itemDate}>
                  <Calendar size={12} />
                  {item.date}
                </span>
                {item.size && <span className={styles.itemSize}>{item.size}</span>}
              </div>
              <div className={styles.itemTags}>
                {item.tags.map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {trashedItems.size > 0 && (
        <div className={styles.trashSection}>
          <h4>
            <Trash2 size={16} />
            Recently Deleted
          </h4>
          <div className={styles.trashList}>
            {archiveItems.filter(item => trashedItems.has(item.id)).map(item => (
              <div key={item.id} className={styles.trashItem}>
                <span>{item.title}</span>
                <button onClick={() => handleRestore(item.id)}>
                  <RotateCcw size={14} />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedItem && (
        <div className={styles.modal} onClick={() => setSelectedItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>×</button>
            <div className={styles.modalHeader}>
              {(() => {
                const Icon = typeIcons[selectedItem.type];
                return <Icon size={32} style={{ color: typeColors[selectedItem.type] }} />;
              })()}
              <h3>{selectedItem.title}</h3>
            </div>
            <p className={styles.modalDesc}>{selectedItem.description}</p>
            <div className={styles.modalMeta}>
              <span><Calendar size={14} /> {selectedItem.date}</span>
              {selectedItem.size && <span>Size: {selectedItem.size}</span>}
              <span>Type: {selectedItem.type}</span>
            </div>
            <div className={styles.modalTags}>
              {selectedItem.tags.map(tag => (
                <span key={tag} className={styles.modalTag}>#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
