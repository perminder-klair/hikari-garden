import { useState, useRef, useEffect } from 'react';
import { Eye, Plus, X, Target, Calendar, Image as ImageIcon, Check } from 'lucide-react';
import styles from './VisionBoard.module.css';

interface VisionItem {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'health' | 'travel' | 'learning' | 'relationships' | 'creative' | 'finance' | 'other';
  targetDate: string;
  imageUrl?: string;
  milestones: Milestone[];
  completed: boolean;
}

interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

const categories = [
  { id: 'career', label: 'Career', color: '#3498db' },
  { id: 'health', label: 'Health', color: '#2ecc71' },
  { id: 'travel', label: 'Travel', color: '#9b59b6' },
  { id: 'learning', label: 'Learning', color: '#f39c12' },
  { id: 'relationships', label: 'Relationships', color: '#e74c3c' },
  { id: 'creative', label: 'Creative', color: '#1abc9c' },
  { id: 'finance', label: 'Finance', color: '#27ae60' },
  { id: 'other', label: 'Other', color: '#95a5a6' },
];

const sampleVisions: VisionItem[] = [
  {
    id: '1',
    title: 'Launch Side Project',
    description: 'Build and launch a successful SaaS product',
    category: 'career',
    targetDate: '2026-12-31',
    milestones: [
      { id: 'm1', text: 'Validate idea with 10 potential users', completed: true },
      { id: 'm2', text: 'Build MVP', completed: false },
      { id: 'm3', text: 'Launch beta', completed: false },
    ],
    completed: false,
  },
  {
    id: '2',
    title: 'Run a Marathon',
    description: 'Complete a full marathon race',
    category: 'health',
    targetDate: '2026-10-15',
    milestones: [
      { id: 'm4', text: 'Run 5k without stopping', completed: true },
      { id: 'm5', text: 'Complete half marathon', completed: false },
      { id: 'm6', text: 'Train up to 30km', completed: false },
    ],
    completed: false,
  },
];

export default function VisionBoard() {
  const [visions, setVisions] = useState<VisionItem[]>(sampleVisions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const filteredVisions = selectedCategory === 'all'
    ? visions
    : visions.filter(v => v.category === selectedCategory);

  const completedCount = visions.filter(v => v.completed).length;
  const totalMilestones = visions.reduce((acc, v) => acc + v.milestones.length, 0);
  const completedMilestones = visions.reduce(
    (acc, v) => acc + v.milestones.filter(m => m.completed).length,
    0
  );

  const toggleMilestone = (visionId: string, milestoneId: string) => {
    setVisions(prev => prev.map(v => {
      if (v.id !== visionId) return v;
      const updatedMilestones = v.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const allCompleted = updatedMilestones.every(m => m.completed);
      return {
        ...v,
        milestones: updatedMilestones,
        completed: allCompleted && updatedMilestones.length > 0,
      };
    }));
  };

  const addVision = (vision: Omit<VisionItem, 'id' | 'milestones' | 'completed'>) => {
    const newVision: VisionItem = {
      ...vision,
      id: Date.now().toString(),
      milestones: [],
      completed: false,
    };
    setVisions(prev => [...prev, newVision]);
    setShowAddModal(false);
  };

  const deleteVision = (id: string) => {
    setVisions(prev => prev.filter(v => v.id !== id));
  };

  return (
    <section className={styles.visionBoard} ref={revealRef}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Eye className={styles.icon} />
          <h2>Vision Board</h2>
        </div>
        <p className={styles.subtitle}>Dream big. Track progress. Achieve.</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{visions.length}</span>
          <span className={styles.statLabel}>Visions</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedCount}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedMilestones}/{totalMilestones}</span>
          <span className={styles.statLabel}>Milestones</span>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ '--category-color': cat.color } as React.CSSProperties}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.visionsGrid}>
        {filteredVisions.map(vision => {
          const category = categories.find(c => c.id === vision.category);
          const progress = vision.milestones.length > 0
            ? Math.round((vision.milestones.filter(m => m.completed).length / vision.milestones.length) * 100)
            : 0;

          return (
            <div
              key={vision.id}
              className={`${styles.visionCard} ${vision.completed ? styles.completed : ''}`}
              style={{ '--category-color': category?.color || '#95a5a6' } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge} style={{ background: category?.color }}>
                  {category?.label}
                </span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteVision(vision.id)}
                >
                  <X size={14} />
                </button>
              </div>

              <h3 className={styles.visionTitle}>{vision.title}</h3>
              <p className={styles.visionDesc}>{vision.description}</p>

              <div className={styles.targetDate}>
                <Calendar size={14} />
                <span>Target: {new Date(vision.targetDate).toLocaleDateString()}</span>
              </div>

              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                <span className={styles.progressText}>{progress}%</span>
              </div>

              <div className={styles.milestones}>
                {vision.milestones.map(milestone => (
                  <label key={milestone.id} className={styles.milestone}>
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => toggleMilestone(vision.id, milestone.id)}
                    />
                    <span className={milestone.completed ? styles.completed : ''}>
                      {milestone.text}
                    </span>
                  </label>
                ))}
              </div>

              {vision.completed && (
                <div className={styles.completedBadge}>
                  <Check size={16} />
                  <span>Achieved!</span>
                </div>
              )}
            </div>
          );
        })}

        <button className={styles.addCard} onClick={() => setShowAddModal(true)}>
          <Plus size={32} />
          <span>Add Vision</span>
        </button>
      </div>

      {showAddModal && (
        <AddVisionModal
          onClose={() => setShowAddModal(false)}
          onAdd={addVision}
        />
      )}
    </section>
  );
}

interface AddVisionModalProps {
  onClose: () => void;
  onAdd: (vision: Omit<VisionItem, 'id' | 'milestones' | 'completed'>) => void;
}

function AddVisionModal({ onClose, onAdd }: AddVisionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VisionItem['category']>('career');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim(),
      category,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3><Target size={20} /> Add New Vision</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your vision..."
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as VisionItem['category'])}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn}>
              <Plus size={16} /> Add Vision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
