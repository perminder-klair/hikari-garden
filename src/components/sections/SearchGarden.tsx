import { useState, useMemo } from 'react';
import { Search, FileText, Bookmark, Lightbulb, Calendar, Tag } from 'lucide-react';
import styles from './SearchGarden.module.css';

interface SearchResult {
  id: string;
  title: string;
  type: 'note' | 'bookmark' | 'idea' | 'event';
  section: string;
  date: string;
}

const mockResults: SearchResult[] = [
  { id: '1', title: 'Project ideas for Q2', type: 'idea', section: 'Idea Garden', date: '2 days ago' },
  { id: '2', title: 'React performance optimization', type: 'bookmark', section: 'Bookmark Forest', date: '1 week ago' },
  { id: '3', title: 'Weekly reflection notes', type: 'note', section: 'Thought Stream', date: '3 days ago' },
  { id: '4', title: 'Team standup notes', type: 'note', section: 'Quick Notes', date: 'Today' },
  { id: '5', title: 'Design system inspiration', type: 'bookmark', section: 'Inspiration Board', date: '2 weeks ago' },
  { id: '6', title: 'Product launch planning', type: 'event', section: 'Focus Sessions', date: 'Tomorrow' },
];

const typeIcons = {
  note: <FileText size={18} />,
  bookmark: <Bookmark size={18} />,
  idea: <Lightbulb size={18} />,
  event: <Calendar size={18} />,
};

export default function SearchGarden() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = ['All', 'Notes', 'Bookmarks', 'Ideas', 'Events'];

  const filteredResults = useMemo(() => {
    let results = mockResults;

    if (query) {
      results = results.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.section.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (activeFilter && activeFilter !== 'All') {
      const typeMap: Record<string, string> = {
        'Notes': 'note',
        'Bookmarks': 'bookmark',
        'Ideas': 'idea',
        'Events': 'event',
      };
      results = results.filter(r => r.type === typeMap[activeFilter]);
    }

    return results;
  }, [query, activeFilter]);

  return (
    <section className={styles.searchGarden}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Search className={styles.icon} size={20} />
          Search Garden
        </h2>
      </div>

      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search your garden..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterChip} ${activeFilter === filter ? styles.filterChipActive : ''}`}
            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={styles.results}>
        {filteredResults.map((result) => (
          <div key={result.id} className={styles.resultItem}>
            <div className={styles.resultIcon}>
              {typeIcons[result.type]}
            </div>
            <div className={styles.resultContent}>
              <div className={styles.resultTitle}>{result.title}</div>
              <div className={styles.resultMeta}>
                {result.section} • {result.date}
              </div>
            </div>
            
            <span className={styles.resultType}>
              {result.type}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
