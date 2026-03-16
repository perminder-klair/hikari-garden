import { useState } from 'react';
import { Palette, Copy, Check, Plus, Trash2, RefreshCw, Download, Upload } from 'lucide-react';
import styles from './DesignTokens.module.css';

interface Token {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border';
  description: string;
}

interface TokenSet {
  id: string;
  name: string;
  tokens: Token[];
}

const initialSets: TokenSet[] = [
  {
    id: '1',
    name: 'Garden Theme',
    tokens: [
      { id: 't1', name: '--bg-primary', value: '#0d0d0d', type: 'color', description: 'Main background' },
      { id: 't2', name: '--bg-secondary', value: '#1a1a1a', type: 'color', description: 'Card background' },
      { id: 't3', name: '--accent-gold', value: '#f4d03f', type: 'color', description: 'Primary accent' },
      { id: 't4', name: '--text-primary', value: '#f5f5f0', type: 'color', description: 'Main text' },
      { id: 't5', name: '--spacing-sm', value: '0.5rem', type: 'spacing', description: 'Small spacing' },
      { id: 't6', name: '--spacing-md', value: '1rem', type: 'spacing', description: 'Medium spacing' },
      { id: 't7', name: '--radius-lg', value: '12px', type: 'border', description: 'Large radius' },
      { id: 't8', name: '--shadow-card', value: '0 8px 24px rgba(0,0,0,0.2)', type: 'shadow', description: 'Card shadow' },
    ],
  },
  {
    id: '2',
    name: 'Light Mode',
    tokens: [
      { id: 't9', name: '--bg-primary', value: '#ffffff', type: 'color', description: 'Main background' },
      { id: 't10', name: '--bg-secondary', value: '#f5f5f5', type: 'color', description: 'Card background' },
      { id: 't11', name: '--text-primary', value: '#1a1a1a', type: 'color', description: 'Main text' },
      { id: 't12', name: '--text-secondary', value: '#666666', type: 'color', description: 'Secondary text' },
    ],
  },
];

const typeIcons = {
  color: '🎨',
  spacing: '📏',
  typography: '🔤',
  shadow: '☁️',
  border: '⬜',
};

export default function DesignTokens() {
  const [sets, setSets] = useState<TokenSet[]>(initialSets);
  const [activeSet, setActiveSet] = useState<TokenSet>(initialSets[0]);
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newToken, setNewToken] = useState<Partial<Token>>({
    name: '',
    value: '',
    type: 'color',
    description: '',
  });

  const filteredTokens = activeSet.tokens.filter(
    (t) => filter === 'all' || t.type === filter
  );

  const copyToken = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteToken = (id: string) => {
    const updatedSets = sets.map((s) =>
      s.id === activeSet.id
        ? { ...s, tokens: s.tokens.filter((t) => t.id !== id) }
        : s
    );
    setSets(updatedSets);
    setActiveSet({
      ...activeSet,
      tokens: activeSet.tokens.filter((t) => t.id !== id),
    });
  };

  const addToken = () => {
    if (!newToken.name || !newToken.value) return;

    const token: Token = {
      id: Date.now().toString(),
      name: newToken.name,
      value: newToken.value,
      type: (newToken.type as Token['type']) || 'color',
      description: newToken.description || '',
    };

    const updatedSets = sets.map((s) =>
      s.id === activeSet.id ? { ...s, tokens: [...s.tokens, token] } : s
    );
    setSets(updatedSets);
    setActiveSet({ ...activeSet, tokens: [...activeSet.tokens, token] });
    setNewToken({ name: '', value: '', type: 'color', description: '' });
    setShowAddModal(false);
  };

  const exportTokens = () => {
    const css = activeSet.tokens
      .map((t) => `  ${t.name}: ${t.value}; /* ${t.description} */`)
      .join('\n');
    const content = `:root {\n${css}\n}`;

    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSet.name.toLowerCase().replace(/\s+/g, '-')}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const types = ['all', 'color', 'spacing', 'typography', 'shadow', 'border'];

  return (
    <section className={styles.tokens} id="design-tokens">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Palette size={28} />
        </div>
        <h2 className={styles.title}>Design Tokens</h2>
        <p className={styles.subtitle}>Manage design system tokens</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Token Sets</h3>
          </div>
          <div className={styles.setList}>
            {sets.map((set) => (
              <button
                key={set.id}
                className={`${styles.setItem} ${activeSet.id === set.id ? styles.active : ''}`}
                onClick={() => setActiveSet(set)}
              >
                <span className={styles.setName}>{set.name}</span>
                <span className={styles.setCount}>{set.tokens.length} tokens</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <div className={styles.filters}>
              {types.map((type) => (
                <button
                  key={type}
                  className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type === 'all' ? 'All' : `${typeIcons[type as keyof typeof typeIcons]} ${type}`}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={exportTokens}>
                <Download size={14} />
                Export
              </button>
              <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
                <Plus size={14} />
                Add Token
              </button>
            </div>
          </div>

          <div className={styles.tokenGrid}>
            {filteredTokens.map((token) => (
              <div key={token.id} className={styles.tokenCard}>
                <div className={styles.tokenHeader}>
                  <span className={styles.tokenType}>{typeIcons[token.type]}</span>
                  <div className={styles.tokenActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => copyToken(token.id, token.value)}
                      title="Copy value"
                    >
                      {copiedId === token.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => deleteToken(token.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className={styles.tokenContent}>
                  <code className={styles.tokenName}>{token.name}</code>
                  {token.type === 'color' && (
                    <div
                      className={styles.colorPreview}
                      style={{ background: token.value }}
                    />
                  )}
                  <span className={styles.tokenValue}>{token.value}</span>
                </div>
                <p className={styles.tokenDesc}>{token.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className={styles.modal} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>
              ×
            </button>
            <h3>Add New Token</h3>

            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                placeholder="--token-name"
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Type</label>
              <select
                value={newToken.type}
                onChange={(e) => setNewToken({ ...newToken, type: e.target.value as Token['type'] })}
              >
                <option value="color">Color</option>
                <option value="spacing">Spacing</option>
                <option value="typography">Typography</option>
                <option value="shadow">Shadow</option>
                <option value="border">Border</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Value</label>
              <input
                type="text"
                placeholder="Token value..."
                value={newToken.value}
                onChange={(e) => setNewToken({ ...newToken, value: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <input
                type="text"
                placeholder="What is this token for?"
                value={newToken.description}
                onChange={(e) => setNewToken({ ...newToken, description: e.target.value })}
              />
            </div>

            <button className={styles.saveBtn} onClick={addToken} disabled={!newToken.name || !newToken.value}>
              Add Token
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
