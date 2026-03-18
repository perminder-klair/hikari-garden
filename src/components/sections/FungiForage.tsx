import { useState, useMemo } from 'react';
import { Mushroom, MapPin, Calendar, Camera, Search, Leaf, AlertTriangle, Check } from 'lucide-react';
import styles from './FungiForage.module.css';

interface MushroomEntry {
  id: string;
  name: string;
  scientificName: string;
  date: string;
  location: string;
  edible: 'edible' | 'toxic' | 'unknown';
  confidence: number;
  notes: string;
  image?: string;
  tags: string[];
}

const mushroomDatabase = [
  { name: 'Chanterelle', scientific: 'Cantharellus cibarius', edible: 'edible', season: 'summer-autumn', habitat: 'deciduous woods' },
  { name: 'Porcini', scientific: 'Boletus edulis', edible: 'edible', season: 'summer-autumn', habitat: 'coniferous forests' },
  { name: 'Morel', scientific: 'Morchella esculenta', edible: 'edible', season: 'spring', habitat: 'burned areas, orchards' },
  { name: 'Oyster', scientific: 'Pleurotus ostreatus', edible: 'edible', season: 'autumn-winter', habitat: 'dead wood' },
  { name: 'Shiitake', scientific: 'Lentinula edodes', edible: 'edible', season: 'autumn', habitat: 'hardwood logs' },
  { name: 'Death Cap', scientific: 'Amanita phalloides', edible: 'toxic', season: 'summer-autumn', habitat: 'mixed woods' },
  { name: 'Destroying Angel', scientific: 'Amanita virosa', edible: 'toxic', season: 'summer', habitat: 'deciduous woods' },
  { name: 'Fly Agaric', scientific: 'Amanita muscaria', edible: 'toxic', season: 'autumn', habitat: 'pine forests' },
  { name: 'Liberty Cap', scientific: 'Psilocybe semilanceata', edible: 'unknown', season: 'autumn', habitat: 'grasslands' },
  { name: 'Turkey Tail', scientific: 'Trametes versicolor', edible: 'edible', season: 'year-round', habitat: 'dead hardwood' },
];

const foragingTips = [
  'Always carry a field guide and use multiple sources for identification',
  'Never consume a mushroom unless you are 100% certain of its identity',
  'Start with easily identifiable species like chanterelles and morels',
  'Check local regulations - some areas require permits for foraging',
  'Leave some mushrooms behind to ensure future growth',
  'Use a basket instead of a bag to allow spores to spread',
  'Note the habitat - trees, soil type, and moisture all matter',
  'Take photos of the cap, gills, stem, and base for identification',
];

export default function FungiForage() {
  const [entries, setEntries] = useState<MushroomEntry[]>(() => {
    const saved = localStorage.getItem('fungiForage_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'edible' | 'toxic' | 'unknown'>('all');
  
  const [newEntry, setNewEntry] = useState<Partial<MushroomEntry>>({
    name: '',
    scientificName: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    edible: 'unknown',
    confidence: 50,
    notes: '',
    tags: [],
  });

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || entry.edible === filter;
      return matchesSearch && matchesFilter;
    });
  }, [entries, searchTerm, filter]);

  const stats = useMemo(() => ({
    total: entries.length,
    edible: entries.filter(e => e.edible === 'edible').length,
    toxic: entries.filter(e => e.edible === 'toxic').length,
    unknown: entries.filter(e => e.edible === 'unknown').length,
    locations: new Set(entries.map(e => e.location)).size,
  }), [entries]);

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.location) return;
    
    const entry: MushroomEntry = {
      id: Date.now().toString(),
      name: newEntry.name,
      scientificName: newEntry.scientificName || 'Unknown',
      date: newEntry.date || new Date().toISOString(),
      location: newEntry.location,
      edible: newEntry.edible as 'edible' | 'toxic' | 'unknown',
      confidence: newEntry.confidence || 50,
      notes: newEntry.notes || '',
      tags: newEntry.tags || [],
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('fungiForage_entries', JSON.stringify(updated));
    
    setNewEntry({
      name: '',
      scientificName: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      edible: 'unknown',
      confidence: 50,
      notes: '',
      tags: [],
    });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('fungiForage_entries', JSON.stringify(updated));
  };

  const getEdibleIcon = (edible: string) => {
    switch (edible) {
      case 'edible': return <Check size={16} className={styles.edibleIcon} />;
      case 'toxic': return <AlertTriangle size={16} className={styles.toxicIcon} />;
      default: return <Search size={16} className={styles.unknownIcon} />;
    }
  };

  const getEdibleClass = (edible: string) => {
    switch (edible) {
      case 'edible': return styles.edible;
      case 'toxic': return styles.toxic;
      default: return styles.unknown;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Mushroom className={styles.icon} />
        <h2>Fungi Forage</h2>
        <p>Track your mushroom hunting adventures</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Finds</span>
        </div>
        <div className={`${styles.stat} ${styles.edible}`}>
          <span className={styles.statValue}>{stats.edible}</span>
          <span className={styles.statLabel}>Edible</span>
        </div>
        <div className={`${styles.stat} ${styles.toxic}`}>
          <span className={styles.statValue}>{stats.toxic}</span>
          <span className={styles.statLabel}>Toxic</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.locations}</span>
          <span className={styles.statLabel}>Locations</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search mushrooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          {(['all', 'edible', 'toxic', 'unknown'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          <Camera size={18} />
          Log Find
        </button>
      </div>

      {/* Quick Reference */}
      <div className={styles.reference}>
        <h3>Common Species</h3>
        <div className={styles.speciesGrid}>
          {mushroomDatabase.slice(0, 6).map((shroom) => (
            <div key={shroom.name} className={`${styles.speciesCard} ${getEdibleClass(shroom.edible)}`}>
              <div className={styles.speciesHeader}>
                <span className={styles.speciesName}>{shroom.name}</span>
                {getEdibleIcon(shroom.edible)}
              </div>
              <span className={styles.speciesScientific}>{shroom.scientific}</span>
              <div className={styles.speciesMeta}>
                <span><Calendar size={12} /> {shroom.season}</span>
                <span><MapPin size={12} /> {shroom.habitat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foraging Tips */}
      <div className={styles.tips}>
        <h3><Leaf size={18} /> Foraging Safety</h3>
        <ul>
          {foragingTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Entries List */}
      {filteredEntries.length > 0 && (
        <div className={styles.entries}>
          <h3>Your Foraging Log</h3>
          <div className={styles.entriesGrid}>
            {filteredEntries.map((entry) => (
              <div key={entry.id} className={`${styles.entryCard} ${getEdibleClass(entry.edible)}`}>
                <div className={styles.entryHeader}>
                  <div className={styles.entryTitle}>
                    <h4>{entry.name}</h4>
                    {getEdibleIcon(entry.edible)}
                  </div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(entry.id)}
                  >
                    ×
                  </button>
                </div>
                <span className={styles.scientific}>{entry.scientificName}</span>
                <div className={styles.entryMeta}>
                  <span><Calendar size={12} /> {new Date(entry.date).toLocaleDateString()}</span>
                  <span><MapPin size={12} /> {entry.location}</span>
                </div>
                <div className={styles.confidence}>
                  <div className={styles.confidenceBar}>
                    <div 
                      className={styles.confidenceFill} 
                      style={{ width: `${entry.confidence}%` }}
                    />
                  </div>
                  <span>{entry.confidence}% confident</span>
                </div>
                {entry.notes && <p className={styles.entryNotes}>{entry.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Entry Dialog */}
      {showAddForm && (
        <div className={styles.dialogOverlay} onClick={() => setShowAddForm(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>Log Mushroom Find</h3>
            
            <div className={styles.formGroup}>
              <label>Mushroom Name *</label>
              <input
                type="text"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                placeholder="e.g., Chanterelle"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Scientific Name</label>
              <input
                type="text"
                value={newEntry.scientificName}
                onChange={(e) => setNewEntry({ ...newEntry, scientificName: e.target.value })}
                placeholder="e.g., Cantharellus cibarius"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Location *</label>
                <input
                  type="text"
                  value={newEntry.location}
                  onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                  placeholder="Forest name, park..."
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Edibility</label>
              <div className={styles.edibilityOptions}>
                {(['edible', 'toxic', 'unknown'] as const).map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.edibilityBtn} ${newEntry.edible === opt ? styles.active : ''} ${styles[opt]}`}
                    onClick={() => setNewEntry({ ...newEntry, edible: opt })}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Identification Confidence: {newEntry.confidence}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newEntry.confidence}
                onChange={(e) => setNewEntry({ ...newEntry, confidence: Number(e.target.value) })}
                className={styles.confidenceSlider}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Notes</label>
              <textarea
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                placeholder="Habitat details, surrounding trees, smell, etc."
                rows={3}
              />
            </div>

            <div className={styles.dialogButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button 
                className={styles.saveBtn} 
                onClick={handleAddEntry}
                disabled={!newEntry.name || !newEntry.location}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
