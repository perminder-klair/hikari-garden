import { useState, useRef, useEffect } from 'react';
import { Share2, Plus, X, Calendar, Clock, Hash, Image as ImageIcon, Send, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import styles from './SocialGarden.module.css';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'linkedin' | 'threads' | 'bluesky' | 'other';
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'posted';
  tags: string[];
  mediaUrls: string[];
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const platforms = [
  { id: 'twitter', label: 'X/Twitter', color: '#000000', icon: '𝕏' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F', icon: '📸' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { id: 'threads', label: 'Threads', color: '#000000', icon: '🧵' },
  { id: 'bluesky', label: 'Bluesky', color: '#0560FF', icon: '🦋' },
  { id: 'other', label: 'Other', color: '#666666', icon: '🌐' },
];

const samplePosts: SocialPost[] = [
  {
    id: '1',
    platform: 'twitter',
    content: 'Just shipped a new feature! 🚀 Building in public is the best way to learn and grow. What are you working on this week?',
    scheduledDate: '2026-03-14',
    scheduledTime: '09:00',
    status: 'scheduled',
    tags: ['buildinpublic', 'indiehacker', 'startup'],
    mediaUrls: [],
  },
  {
    id: '2',
    platform: 'linkedin',
    content: 'Reflections on 10 years in tech: The most important skill isn\'t coding—it\'s communication. Thread 🧵',
    scheduledDate: '2026-03-15',
    scheduledTime: '14:00',
    status: 'draft',
    tags: ['career', 'tech', 'leadership'],
    mediaUrls: [],
  },
  {
    id: '3',
    platform: 'instagram',
    content: 'Morning routine essentials ☕📚 What\'s yours?',
    scheduledDate: '2026-03-10',
    scheduledTime: '08:00',
    status: 'posted',
    tags: ['morningroutine', 'productivity', 'lifestyle'],
    mediaUrls: [],
    engagement: { likes: 127, comments: 23, shares: 8 },
  },
];

export default function SocialGarden() {
  const [posts, setPosts] = useState<SocialPost[]>(samplePosts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | SocialPost['platform']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | SocialPost['status']>('all');
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
        }
      },
      { threshold: 0.1 }
    );

    if (revealRef.current) {
      observer.observe(revealRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredPosts = posts.filter(post => {
    const platformMatch = filter === 'all' || post.platform === filter;
    const statusMatch = statusFilter === 'all' || post.status === statusFilter;
    return platformMatch && statusMatch;
  });

  const draftCount = posts.filter(p => p.status === 'draft').length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const postedCount = posts.filter(p => p.status === 'posted').length;

  function addPost(post: Omit<SocialPost, 'id'>) {
    const newPost: SocialPost = {
      ...post,
      id: Date.now().toString(),
    };
    setPosts(prev => [...prev, newPost]);
    setShowAddModal(false);
  }

  function deletePost(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  function updatePostStatus(id: string, status: SocialPost['status']) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  return (
    <section className={styles.socialGarden} ref={revealRef}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Share2 className={styles.icon} />
          <h2>Social Garden</h2>
        </div>
        <p className={styles.subtitle}>Plan, schedule, and grow your online presence</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{draftCount}</span>
          <span className={styles.statLabel}>Drafts</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{scheduledCount}</span>
          <span className={styles.statLabel}>Scheduled</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{postedCount}</span>
          <span className={styles.statLabel}>Posted</span>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All Platforms
          </button>
          {platforms.map(p => (
            <button
              key={p.id}
              className={`${styles.filterBtn} ${filter === p.id ? styles.active : ''}`}
              onClick={() => setFilter(p.id as SocialPost['platform'])}
              style={{ '--platform-color': p.color } as React.CSSProperties}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          {(['all', 'draft', 'scheduled', 'posted'] as const).map(s => (
            <button
              key={s}
              className={`${styles.statusFilter} ${statusFilter === s ? styles.active : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.postsGrid}>
        {filteredPosts.map(post => {
          const platform = platforms.find(p => p.id === post.platform);
          const isOverdue = post.status === 'scheduled' && new Date(post.scheduledDate) < new Date();

          return (
            <div
              key={post.id}
              className={`${styles.postCard} ${styles[post.status]} ${isOverdue ? styles.overdue : ''}`}
              style={{ '--platform-color': platform?.color } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <div className={styles.platformBadge} style={{ background: platform?.color }}>
                  <span>{platform?.icon}</span>
                  <span>{platform?.label}</span>
                </div>
                <div className={styles.actions}>
                  {post.status === 'draft' && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => updatePostStatus(post.id, 'scheduled')}
                      title="Schedule"
                    >
                      <Calendar size={14} />
                    </button>
                  )}
                  {post.status === 'scheduled' && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => updatePostStatus(post.id, 'posted')}
                      title="Mark as posted"
                    >
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button
                    className={styles.actionBtn}
                    onClick={() => deletePost(post.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className={styles.content}>{post.content}</p>

              {post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      <Hash size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.meta}>
                <div className={styles.scheduleInfo}>
                  <Calendar size={12} />
                  <span>{new Date(post.scheduledDate).toLocaleDateString()}</span>
                  <Clock size={12} />
                  <span>{post.scheduledTime}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[post.status]}`}>
                  {post.status}
                </span>
              </div>

              {post.engagement && (
                <div className={styles.engagement}>
                  <span>❤️ {post.engagement.likes}</span>
                  <span>💬 {post.engagement.comments}</span>
                  <span>🔄 {post.engagement.shares}</span>
                </div>
              )}
            </div>
          );
        })}

        <button className={styles.addCard} onClick={() => setShowAddModal(true)}>
          <Plus size={32} />
          <span>Create Post</span>
        </button>
      </div>

      {showAddModal && (
        <AddPostModal
          onClose={() => setShowAddModal(false)}
          onAdd={addPost}
        />
      )}
    </section>
  );
}

interface AddPostModalProps {
  onClose: () => void;
  onAdd: (post: Omit<SocialPost, 'id'>) => void;
}

function AddPostModal({ onClose, onAdd }: AddPostModalProps) {
  const [platform, setPlatform] = useState<SocialPost['platform']>('twitter');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<SocialPost['status']>('draft');

  const platformData = platforms.find(p => p.id === platform);
  const charLimit = platform === 'twitter' ? 280 : platform === 'threads' ? 500 : 2200;
  const charCount = content.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({
      platform,
      content: content.trim(),
      scheduledDate,
      scheduledTime,
      status,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      mediaUrls: [],
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3><Edit3 size={20} /> Create Post</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Platform</label>
            <div className={styles.platformSelector}>
              {platforms.map(p => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.platformOption} ${platform === p.id ? styles.selected : ''}`}
                  onClick={() => setPlatform(p.id as SocialPost['platform'])}
                  style={{ '--platform-color': p.color } as React.CSSProperties}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              Content
              <span className={`${styles.charCount} ${charCount > charLimit ? styles.overLimit : ''}`}>
                {charCount}/{charLimit}
              </span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="tech, lifestyle, thoughts"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <div className={styles.statusSelector}>
              {(['draft', 'scheduled', 'posted'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.statusOption} ${status === s ? styles.selected : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn}>
              <Send size={16} />
              {status === 'draft' ? 'Save Draft' : status === 'scheduled' ? 'Schedule' : 'Post Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
