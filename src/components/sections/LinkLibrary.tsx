import { useState } from 'react';
import { Link2, ExternalLink, Folder, Tag, Search, Star, Trash2, Plus } from 'lucide-react';
import styles from './LinkLibrary.module.css';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  starred: boolean;
  addedAt: string;
}

const INITIAL_LINKS: LinkItem[] = [
  {
    id: '1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation',
    category: 'Development',
    tags: ['react', 'docs', 'frontend'],
    starred: true,
    addedAt: '2026-03-10'
  },
  {
    id: '2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs',
    description: 'Comprehensive TypeScript guide',
    category: 'Development',
    tags: ['typescript', 'docs'],
    starred: true,
    addedAt: '2026-03-11'
  },
  {
    id: '3',
    title: 'CSS Tricks',
    url: 'https://css-tricks.com',
    description: 'Daily articles about CSS',
    category: 'Design',
    tags: ['css', 'design', 'tutorial'],
    starred: false,
    addedAt: '2026-03-12'
  },
  {
    id: '4',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Resources for developers by developers',
    category: 'Development',
    tags: ['reference', 'web'],
    starred: true,
    addedAt: '2026-03-13'
  },
  {
    id: '5',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: 'Design inspiration and networking',
    category: 'Design',
    tags: ['inspiration', 'ui', 'ux'],
    starred: false,
    addedAt: '2026-03-14'
  },
];

const CATEGORIES = ['All', 'Development', 'Design', 'Productivity', 'Learning', 'Tools'];

export default function LinkLibrary() {
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '', category: 'Development', tags: '' });

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const starredCount = links.filter(l => l.starred).length;

  const toggleStar = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, starred: !l.starred } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) return;
    
    const link: LinkItem = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      description: newLink.description,
      category: newLink.category,
      tags: newLink.tags.split(',').map(t => t.trim()).filter(Boolean),
      starred: false,
      addedAt: new Date().toISOString().split('T')[0]
    };
    
    setLinks([link, ...links]);
    setNewLink({ title: '', url: '', description: '', category: 'Development', tags: '' });
    setShowAddForm(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Link2 className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Link Library</h2>
        <p className={styles.sectionSubtitle}>Curated collection of useful resources</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          className={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          Add Link
        </button>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={styles.categoryButton}
            data-active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            <Folder size={14} />
            {cat}
            <span className={styles.count}>
              {cat === 'All' ? links.length : links.filter(l => l.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {showAddForm && (
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Title"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />
          <input
            type="url"
            placeholder="URL"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newLink.description}
            onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
          />
          <select
            value={newLink.category}
            onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newLink.tags}
            onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })}
          />
          <div className={styles.formActions}>
            <button onClick={addLink}>Add Link</button>
            <button onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.linksList}>
        {filteredLinks.length === 0 ? (
          <p className={styles.emptyState}>No links found. Try a different search or category.</p>
        ) : (
          filteredLinks.map(link => (
            <div key={link.id} className={styles.linkCard}>
              <div className={styles.linkHeader}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.linkTitle}
                >
                  {link.title}
                  <ExternalLink size={14} />
                </a>
                
                <div className={styles.linkActions}>
                  <button 
                    className={styles.starButton}
                    data-starred={link.starred}
                    onClick={() => toggleStar(link.id)}
                  >
                    <Star size={16} fill={link.starred ? "currentColor" : "none"} />
                  </button>
                  
                  <button 
                    className={styles.deleteButton}
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className={styles.linkDescription}>{link.description}</p>

              <div className={styles.linkMeta}>
                <span className={styles.category}>
                  <Folder size={12} />
                  {link.category}
                </span>
                
                <div className={styles.tags}>
                  {link.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <span>{filteredLinks.length} links</span>
        <span>•</span>
        <span>{starredCount} starred</span>
      </div>
    </section>
  );
}
