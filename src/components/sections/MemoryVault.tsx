import { useState, useEffect } from 'react';
import { Archive, Search, Tag, Calendar, Heart, Trash2, Plus, X } from 'lucide-react';
import styles from './MemoryVault.module.css';

interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  favorite: boolean;
  category: 'moment' | 'achievement' | 'idea' | 'reflection';
}

const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'First deployment',
    content: 'Successfully deployed the Hikari Garden to production. The feeling of seeing it live was incredible.',
    date: '2026-03-10',
    tags: ['milestone', 'deployment', 'achievement'],
    favorite: true,
    category: 'achievement'
  },
  {
    id: '2',
    title: 'Late night coding',
    content: 'Stayed up until 3am perfecting the particle animation system. Sometimes the best ideas come in the quiet hours.',
    date: '2026-03-12',
    tags: ['coding', 'late-night', 'flow'],
    favorite: false,
    category: 'moment'
  },
  {
    id: '3',
    title: 'Design breakthrough',
    content: 'Finally found the perfect color palette - the amber gold against dark backgrounds creates exactly the atmosphere I wanted.',
    date: '2026-03-14',
    tags: ['design', 'colors', 'breakthrough'],
    favorite: true,
    category: 'idea'
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'moment', label: 'Moments', icon: '⏰' },
  { id: 'achievement', label: 'Achievements', icon: '🏆' },
  { id: 'idea', label: 'Ideas', icon: '💡' },
  { id: 'reflection', label: 'Reflections', icon: '🤔' },
];

export default function MemoryVault() {
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    category: 'moment' as Memory['category'],
    tags: ''
  });

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteCount = memories.filter(m => m.favorite).length;
  const allTags = [...new Set(memories.flatMap(m => m.tags))];

  const toggleFavorite = (id: string) => {
    setMemories(memories.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
  };

  const deleteMemory = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  const addMemory = () => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) return;
    
    const memory: Memory = {
      id: Date.now().toString(),
      title: newMemory.title,
      content: newMemory.content,
      date: new Date().toISOString().split('T')[0],
      tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      favorite: false,
      category: newMemory.category
    };
    
    setMemories([memory, ...memories]);
    setNewMemory({ title: '', content: '', category: 'moment', tags: '' });
    setShowAddForm(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Archive className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Memory Vault</h2>
        <p className={styles.sectionSubtitle}>Preserve moments that matter</p>
      </div>

      <div className={styles.stats}>
        <span>{memories.length} memories</span>
        <span className={styles.dot}>•</span>
        <span>{favoriteCount} favorites</span>
        <span className={styles.dot}>•</span>
        <span>{allTags.length} tags</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className={styles.addButton} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Cancel' : 'Add Memory'}
        </button>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={styles.categoryButton}
            data-active={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {showAddForm && (
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Memory title..."
            value={newMemory.title}
            onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
          />
          <textarea
            placeholder="What do you want to remember?"
            rows={3}
            value={newMemory.content}
            onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
          />
          <div className={styles.formRow}>
            <select
              value={newMemory.category}
              onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value as Memory['category'] })}
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newMemory.tags}
              onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
            />
          </div>
          <button className={styles.saveButton} onClick={addMemory}>
            Save Memory
          </button>
        </div>
      )}

      <div className={styles.memoriesList}>
        {filteredMemories.length === 0 ? (
          <p className={styles.emptyState}>No memories found. Create your first memory above.</p>
        ) : (
          filteredMemories.map(memory => (
            <div key={memory.id} className={styles.memoryCard} data-category={memory.category}>
              <div className={styles.memoryHeader}>
                <h3 className={styles.memoryTitle}>{memory.title}</h3>
                <div className={styles.memoryActions}>
                  <button 
                    className={styles.favoriteButton}
                    data-favorite={memory.favorite}
                    onClick={() => toggleFavorite(memory.id)}
                  >
                    <Heart size={18} fill={memory.favorite ? "currentColor" : "none"} />
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => deleteMemory(memory.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className={styles.memoryContent}>{memory.content}</p>

              <div className={styles.memoryFooter}>
                <div className={styles.memoryMeta}>
                  <span className={styles.category}>
                    {CATEGORIES.find(c => c.id === memory.category)?.icon} {memory.category}
                  </span>
                  <span className={styles.date}>
                    <Calendar size={12} />
                    {memory.date}
                  </span>
                </div>
                
                <div className={styles.tags}>
                  {memory.tags.map(tag => (
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
    </section>
  );
}
