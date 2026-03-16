import { useState } from 'react';
import { Code2, Copy, Check, Plus, Trash2, Search, Tag, FileCode } from 'lucide-react';
import styles from './SnippetVault.module.css';

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  createdAt: string;
}

const initialSnippets: Snippet[] = [
  {
    id: '1',
    title: 'React useDebounce Hook',
    code: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}`,
    language: 'typescript',
    description: 'Debounce hook for React with TypeScript',
    tags: ['react', 'hooks', 'typescript'],
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    title: 'CSS Grid Centering',
    code: `.center {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
    language: 'css',
    description: 'Perfect centering with CSS Grid',
    tags: ['css', 'layout', 'grid'],
    createdAt: '2026-03-09',
  },
  {
    id: '3',
    title: 'Fetch with Retry',
    code: `async function fetchWithRetry(
  url: string, 
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}`,
    language: 'typescript',
    description: 'Fetch wrapper with exponential backoff retry',
    tags: ['javascript', 'fetch', 'async'],
    createdAt: '2026-03-08',
  },
  {
    id: '4',
    title: 'Python List Comprehension',
    code: `# Filter and transform in one line
numbers = [1, 2, 3, 4, 5, 6]
evens_squared = [x**2 for x in numbers if x % 2 == 0]
# Result: [4, 16, 36]`,
    language: 'python',
    description: 'List comprehension with conditional filtering',
    tags: ['python', 'list', 'comprehension'],
    createdAt: '2026-03-07',
  },
  {
    id: '5',
    title: 'Docker Multi-stage Build',
    code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html`,
    language: 'dockerfile',
    description: 'Optimized Docker multi-stage build for Node.js',
    tags: ['docker', 'nodejs', 'nginx'],
    createdAt: '2026-03-06',
  },
];

const languageColors: Record<string, string> = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  css: '#264de4',
  python: '#3776ab',
  dockerfile: '#2496ed',
  html: '#e34c26',
  sql: '#336791',
  bash: '#89e051',
};

export default function SnippetVault() {
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
    title: '',
    code: '',
    language: 'typescript',
    description: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const filteredSnippets = snippets.filter(snippet => {
    const matchesFilter = filter === 'all' || snippet.language === filter;
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const addSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return;
    
    const snippet: Snippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      code: newSnippet.code,
      language: newSnippet.language || 'typescript',
      description: newSnippet.description || '',
      tags: newSnippet.tags || [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setSnippets([snippet, ...snippets]);
    setNewSnippet({ title: '', code: '', language: 'typescript', description: '', tags: [] });
    setShowAddModal(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !newSnippet.tags?.includes(tagInput.trim())) {
      setNewSnippet({ ...newSnippet, tags: [...(newSnippet.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewSnippet({ ...newSnippet, tags: newSnippet.tags?.filter(t => t !== tag) || [] });
  };

  const languages = ['all', ...Array.from(new Set(snippets.map(s => s.language)))];

  return (
    <section className={styles.vault} id="snippet-vault">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Code2 size={28} />
        </div>
        <h2 className={styles.title}>Snippet Vault</h2>
        <p className={styles.subtitle}>Reusable code snippets and patterns</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {languages.map(lang => (
            <button
              key={lang}
              className={`${styles.filterBtn} ${filter === lang ? styles.active : ''}`}
              onClick={() => setFilter(lang)}
            >
              {lang === 'all' ? 'All' : lang}
            </button>
          ))}
        </div>

        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add Snippet
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{snippets.length}</span>
          <span className={styles.statLabel}>Snippets</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{languages.length - 1}</span>
          <span className={styles.statLabel}>Languages</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {snippets.reduce((acc, s) => acc + s.tags.length, 0)}
          </span>
          <span className={styles.statLabel}>Tags</span>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredSnippets.map(snippet => (
          <div key={snippet.id} className={styles.snippetCard}>
            <div className={styles.cardHeader}>
              <div className={styles.titleRow}>
                <FileCode size={18} style={{ color: languageColors[snippet.language] || '#888' }} />
                <h3>{snippet.title}</h3>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => copyCode(snippet.id, snippet.code)}
                  title="Copy code"
                >
                  {copiedId === snippet.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => deleteSnippet(snippet.id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className={styles.description}>{snippet.description}</p>

            <div className={styles.codeBlock}>
              <pre>
                <code>{snippet.code.slice(0, 200)}{snippet.code.length > 200 ? '...' : ''}</code>
              </pre>
            </div>

            <div className={styles.cardFooter}>
              <span 
                className={styles.language}
                style={{ color: languageColors[snippet.language] || '#888' }}
              >
                {snippet.language}
              </span>
              <div className={styles.tags}>
                {snippet.tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className={styles.modal} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>×</button>
            <h3>Add New Snippet</h3>

            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Snippet title..."
                value={newSnippet.title}
                onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Language</label>
              <select
                value={newSnippet.language}
                onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="css">CSS</option>
                <option value="python">Python</option>
                <option value="dockerfile">Dockerfile</option>
                <option value="html">HTML</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <input
                type="text"
                placeholder="Brief description..."
                value={newSnippet.description}
                onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Code</label>
              <textarea
                placeholder="Paste your code here..."
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                rows={8}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags</label>
              <div className={styles.tagInput}>
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button onClick={addTag}>Add</button>
              </div>
              <div className={styles.tagList}>
                {newSnippet.tags?.map(tag => (
                  <span key={tag} className={styles.tagChip}>
                    {tag}
                    <button onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <button 
              className={styles.saveBtn}
              onClick={addSnippet}
              disabled={!newSnippet.title || !newSnippet.code}
            >
              Save Snippet
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
