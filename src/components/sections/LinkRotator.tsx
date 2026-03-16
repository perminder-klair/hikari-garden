import { useState, useEffect } from 'react';
import { Link2, ExternalLink, Clock, Star, Trash2, Plus, RefreshCw, Copy, Check } from 'lucide-react';
import styles from './LinkRotator.module.css';

interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'tool' | 'resource' | 'inspiration';
  addedAt: string;
  isFavorite: boolean;
  visitCount: number;
}

const initialLinks: LinkItem[] = [
  { id: '1', url: 'https://github.com/trending', title: 'GitHub Trending', description: 'Discover trending repositories', category: 'resource', addedAt: '2026-03-10', isFavorite: true, visitCount: 12 },
  { id: '2', url: 'https://dribbble.com', title: 'Dribbble', description: 'Design inspiration and showcases', category: 'inspiration', addedAt: '2026-03-09', isFavorite: false, visitCount: 8 },
  { id: '3', url: 'https://dev.to', title: 'Dev.to', description: 'Developer community and articles', category: 'article', addedAt: '2026-03-08', isFavorite: true, visitCount: 25 },
  { id: '4', url: 'https://css-tricks.com', title: 'CSS-Tricks', description: 'Web design and development', category: 'article', addedAt: '2026-03-07', isFavorite: false, visitCount: 15 },
  { id: '5', url: 'https://www.youtube.com/c/Fireship', title: 'Fireship', description: 'Quick tech tutorials', category: 'video', addedAt: '2026-03-06', isFavorite: true, visitCount: 30 },
  { id: '6', url: 'https://excalidraw.com', title: 'Excalidraw', description: 'Virtual whiteboard for sketching', category: 'tool', addedAt: '2026-03-05', isFavorite: false, visitCount: 5 },
  { id: '7', url: 'https://regex101.com', title: 'Regex101', description: 'Build, test, and debug regex', category: 'tool', addedAt: '2026-03-04', isFavorite: true, visitCount: 18 },
  { id: '8', url: 'https://www.figma.com/community', title: 'Figma Community', description: 'Free design resources', category: 'resource', addedAt: '2026-03-03', isFavorite: false, visitCount: 7 },
];

const categoryColors: Record<string, string> = {
  article: '#60a5fa',
  video: '#ef4444',
  tool: '#34d399',
  resource: '#a78bfa',
  inspiration: '#f472b6',
};

const categoryIcons: Record<string, string> = {
  article: '📄',
  video: '🎬',
  tool: '🛠️',
  resource: '📚',
  inspiration: '✨',
};

export default function LinkRotator() {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [filter, setFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({ url: '', title: '', description: '', category: 'article' as LinkItem['category'] });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rotatingLink, setRotatingLink] = useState<LinkItem | null>(null);

  const filteredLinks = links.filter(link => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return link.isFavorite;
    return link.category === filter;
  });

  const handleAddLink = () => {
    if (!newLink.url || !newLink.title) return;
    
    const link: LinkItem = {
      id: Date.now().toString(),
      ...newLink,
      addedAt: new Date().toISOString().split('T')[0],
      isFavorite: false,
      visitCount: 0,
    };
    
    setLinks([link, ...links]);
    setNewLink({ url: '', title: '', description: '', category: 'article' });
    setShowAddModal(false);
  };

  const toggleFavorite = (id: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, isFavorite: !link.isFavorite } : link
    ));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const copyUrl = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const rotateRandom = () => {
    const randomLink = filteredLinks[Math.floor(Math.random() * filteredLinks.length)];
    if (randomLink) {
      setRotatingLink(randomLink);
      setTimeout(() => setRotatingLink(null), 3000);
    }
  };

  const visitLink = (id: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, visitCount: link.visitCount + 1 } : link
    ));
  };

  const totalVisits = links.reduce((acc, link) => acc + link.visitCount, 0);
  const favoriteCount = links.filter(l => l.isFavorite).length;

  return (
    <section className={styles.rotator} id="link-rotator">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Link2 size={28} />
        </div>
        <h2 className={styles.title}>Link Rotator</h2>
        <p className={styles.subtitle}>Curated discoveries, rotated daily</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{links.length}</span>
          <span className={styles.statLabel}>Links</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{favoriteCount}</span>
          <span className={styles.statLabel}>Favorites</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalVisits}</span>
          <span className={styles.statLabel}>Visits</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {['all', 'favorites', 'article', 'video', 'tool', 'resource', 'inspiration'].map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat === 'favorites' ? '⭐ Favorites' : categoryIcons[cat] + ' ' + cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.rotateBtn} onClick={rotateRandom}>
            <RefreshCw size={16} />
            Spin
          </button>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {rotatingLink && (
        <div className={styles.rotatorDisplay}>
          <div className={styles.rotatorContent}>
            <span className={styles.rotatorLabel}>Today's Pick</span>
            <a 
              href={rotatingLink.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.rotatorLink}
              onClick={() => visitLink(rotatingLink.id)}
            >
              <span className={styles.rotatorIcon}>{categoryIcons[rotatingLink.category]}</span>
              <span className={styles.rotatorTitle}>{rotatingLink.title}</span>
              <ExternalLink size={16} />
            </a>
            <p className={styles.rotatorDesc}>{rotatingLink.description}</p>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {filteredLinks.map((link) => (
          <div 
            key={link.id} 
            className={styles.linkCard}
            style={{ '--category-color': categoryColors[link.category] } as React.CSSProperties}
          >
            <div className={styles.linkHeader}>
              <span className={styles.categoryBadge}>
                {categoryIcons[link.category]} {link.category}
              </span>
              <div className={styles.linkActions}>
                <button 
                  className={`${styles.actionBtn} ${link.isFavorite ? styles.favorite : ''}`}
                  onClick={() => toggleFavorite(link.id)}
                  title="Toggle favorite"
                >
                  <Star size={14} fill={link.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={() => copyUrl(link.id, link.url)}
                  title="Copy URL"
                >
                  {copiedId === link.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={() => deleteLink(link.id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <a 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkTitle}
              onClick={() => visitLink(link.id)}
            >
              {link.title}
              <ExternalLink size={14} />
            </a>

            <p className={styles.linkDesc}>{link.description}</p>

            <div className={styles.linkMeta}>
              <span className={styles.metaItem}>
                <Clock size={12} />
                {link.addedAt}
              </span>
              <span className={styles.metaItem}>
                👁 {link.visitCount} visits
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className={styles.modal} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>×</button>
            <h3>Add New Link</h3>
            
            <div className={styles.formGroup}>
              <label>URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Link title..."
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                placeholder="Brief description..."
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={newLink.category}
                onChange={(e) => setNewLink({ ...newLink, category: e.target.value as LinkItem['category'] })}
              >
                <option value="article">📄 Article</option>
                <option value="video">🎬 Video</option>
                <option value="tool">🛠️ Tool</option>
                <option value="resource">📚 Resource</option>
                <option value="inspiration">✨ Inspiration</option>
              </select>
            </div>

            <button 
              className={styles.saveBtn}
              onClick={handleAddLink}
              disabled={!newLink.url || !newLink.title}
            >
              Add Link
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
