import React, { useState, useEffect, useMemo } from 'react';
import { Sprout, Plus, Trash2, Package } from 'lucide-react';
import styles from './SeedLibrary.module.css';

interface Seed {
  id: string;
  name: string;
  variety: string;
  category: string;
  quantity: number;
  dateAdded: string;
  notes: string;
}

const CATEGORIES = [
  { id: 'vegetables', name: 'Vegetables', emoji: '🥬' },
  { id: 'herbs', name: 'Herbs', emoji: '🌿' },
  { id: 'flowers', name: 'Flowers', emoji: '🌸' },
  { id: 'fruits', name: 'Fruits', emoji: '🍅' },
  { id: 'trees', name: 'Trees', emoji: '🌳' },
  { id: 'succulents', name: 'Succulents', emoji: '🌵' },
];

const SeedLibrary: React.FC = () => {
  const [seeds, setSeeds] = useState<Seed[]>(() => {
    const saved = localStorage.getItem('seedLibrary_seeds');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    category: '',
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('seedLibrary_seeds', JSON.stringify(seeds));
  }, [seeds]);

  const filteredSeeds = useMemo(() => {
    if (filter === 'all') return seeds;
    return seeds.filter(s => s.category === filter);
  }, [seeds, filter]);

  const stats = useMemo(() => {
    const totalSeeds = seeds.reduce((sum, s) => sum + s.quantity, 0);
    const categories = new Set(seeds.map(s => s.category)).size;
    return { totalSeeds, categories, varieties: seeds.length };
  }, [seeds]);

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.category) return;

    const newSeed: Seed = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      variety: formData.variety.trim(),
      category: formData.category,
      quantity: formData.quantity,
      dateAdded: new Date().toISOString(),
      notes: formData.notes.trim(),
    };

    setSeeds(prev => [newSeed, ...prev]);
    setFormData({ name: '', variety: '', category: '', quantity: 1, notes: '' });
  };

  const updateQuantity = (id: string, delta: number) => {
    setSeeds(prev => prev.map(seed => {
      if (seed.id === id) {
        const newQty = Math.max(0, seed.quantity + delta);
        return { ...seed, quantity: newQty };
      }
      return seed;
    }).filter(s => s.quantity > 0));
  };

  const deleteSeed = (id: string) => {
    setSeeds(prev => prev.filter(s => s.id !== id));
  };

  const getCategoryEmoji = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId)?.emoji || '🌱';
  };

  const getCategoryName = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId)?.name || catId;
  };

  return (
    <div className={styles.seedLibrary}>
      <div className={styles.header}>
        <Sprout className={styles.icon} size={28} />
        <div>
          <h2 className={styles.title}>Seed Library</h2>
          <p className={styles.subtitle}>Track your seed collection &amp; garden plans</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.addCard}>
          <h3 className={styles.addTitle}>
            <Plus size={18} />
            Add Seeds
          </h3>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Seed Name</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g., Tomato"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Variety</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g., Roma, Cherry..."
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <div className={styles.categorySelect}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoryChip} ${formData.category === cat.id ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Quantity (packets)</label>
              <input
                type="number"
                min="1"
                className={styles.formInput}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Notes</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Sowing date, source, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.category}
          >
            <Package size={18} />
            Add to Library
          </button>
        </div>

        <div className={styles.collectionCard}>
          <div className={styles.collectionHeader}>
            <h3 className={styles.collectionTitle}>Your Collection</h3>
            <span className={styles.seedCount}>{seeds.length} varieties</span>
          </div>

          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.filterTab} ${filter === cat.id ? styles.active : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {filteredSeeds.length === 0 ? (
            <div className={styles.emptyState}>
              {filter === 'all' 
                ? "No seeds in your library yet. Start collecting! 🌱"
                : `No ${getCategoryName(filter).toLowerCase()} seeds yet.`}
            </div>
          ) : (
            <div className={styles.seedList}>
              {filteredSeeds.map(seed => (
                <div key={seed.id} className={styles.seedItem}>
                  <div className={styles.seedIcon}>{getCategoryEmoji(seed.category)}</div>
                  <div className={styles.seedInfo}>
                    <div className={styles.seedName}>
                      {seed.name} {seed.variety && `(${seed.variety})`}
                    </div>
                    <div className={styles.seedMeta}>
                      <span className={styles.seedCategory}>{getCategoryName(seed.category)}</span>
                      {seed.notes && <span>{seed.notes}</span>}
                    </div>
                  </div>
                  <div className={styles.seedQuantity}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(seed.id, -1)}
                    >−</button>
                    <span className={styles.qtyValue}>{seed.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(seed.id, 1)}
                    >+</button>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteSeed(seed.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>Garden Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.totalSeeds}</div>
              <div className={styles.statLabel}>Total Packets</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.varieties}</div>
              <div className={styles.statLabel}>Varieties</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.categories}</div>
              <div className={styles.statLabel}>Categories</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{seeds.length > 0 ? Math.round(stats.totalSeeds / stats.varieties * 10) / 10 : 0}</div>
              <div className={styles.statLabel}>Avg per Variety</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedLibrary;
