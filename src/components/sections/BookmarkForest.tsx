import { useState, useEffect } from 'react';
import { Bookmark, Folder, Link, ExternalLink, Plus, Trash2, Search, Tag } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  folder: string;
  tags: string[];
  added: string;
  favicon?: string;
}

const folders = ['Development', 'Design', 'Reading', 'Tools', 'Inspiration', 'Reference'];

const initialBookmarks: BookmarkItem[] = [
  {
    id: '1',
    title: 'React Documentation',
    url: 'https://react.dev',
    folder: 'Development',
    tags: ['react', 'docs'],
    added: '2025-06-01',
  },
  {
    id: '2',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    folder: 'Inspiration',
    tags: ['design', 'inspiration'],
    added: '2025-07-15',
  },
  {
    id: '3',
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    folder: 'Reading',
    tags: ['news', 'tech'],
    added: '2025-08-01',
  },
  {
    id: '4',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    folder: 'Reference',
    tags: ['docs', 'web'],
    added: '2025-05-20',
  },
  {
    id: '5',
    title: 'Awwwards',
    url: 'https://awwwards.com',
    folder: 'Inspiration',
    tags: ['design', 'web'],
    added: '2025-09-10',
  },
];

const folderIcons: Record<string, string> = {
  Development: '💻',
  Design: '🎨',
  Reading: '📚',
  Tools: '🛠️',
  Inspiration: '✨',
  Reference: '📖',
};

export default function BookmarkForest() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newBookmark, setNewBookmark] = useState<Partial<BookmarkItem>>({
    folder: 'Development',
    tags: [],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.bookmark-forest-section');
  }, [revealRef]);

  const filteredBookmarks = bookmarks.filter(b => {
    const matchesFolder = selectedFolder === 'All' || b.folder === selectedFolder;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const addBookmark = () => {
    if (!newBookmark.title || !newBookmark.url) return;
    const bookmark: BookmarkItem = {
      id: Date.now().toString(),
      title: newBookmark.title,
      url: newBookmark.url,
      folder: newBookmark.folder || 'Development',
      tags: newBookmark.tags || [],
      added: new Date().toISOString().split('T')[0],
    };
    setBookmarks([bookmark, ...bookmarks]);
    setShowAdd(false);
    setNewBookmark({ folder: 'Development', tags: [] });
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const folderCounts = folders.reduce((acc, folder) => ({
    ...acc,
    [folder]: bookmarks.filter(b => b.folder === folder).length,
  }), {} as Record<string, number>);

  return (
    <section className="bookmark-forest-section" id="bookmarks" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Curated Links
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Bookmark Forest
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Bookmark size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{bookmarks.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bookmarks</div>
        </div>
        {folders.slice(0, 4).map(folder => (
          <div key={folder} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem' }}>{folderIcons[folder]}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{folderCounts[folder]}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{folder}</div>
          </div>
        ))}
      </div>

      {/* Search & Add */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Folder Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedFolder('All')}
          style={{
            padding: '0.5rem 1rem',
            background: selectedFolder === 'All' ? 'var(--accent-gold)' : 'transparent',
            border: `1px solid ${selectedFolder === 'All' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            color: selectedFolder === 'All' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {folders.map(folder => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedFolder === folder ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${selectedFolder === folder ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: selectedFolder === folder ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {folderIcons[folder]} {folder}
          </button>
        ))}
      </div>

      {/* Bookmarks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>{folderIcons[bookmark.folder]}</div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {bookmark.title}
                  <ExternalLink size={12} />
                </a>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bookmark.url}
              </p>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {bookmark.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.25rem' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Add Bookmark
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={newBookmark.title || ''}
              onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            />

            <input
              type="text"
              placeholder="URL"
              value={newBookmark.url || ''}
              onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            />

            <select
              value={newBookmark.folder}
              onChange={(e) => setNewBookmark({ ...newBookmark, folder: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addBookmark}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
