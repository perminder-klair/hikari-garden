import { useState } from 'react';
import { Settings, Plus, Trash2, Copy, Check, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import styles from './EnvironmentVars.module.css';

interface EnvVar {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
  category: 'app' | 'api' | 'database' | 'auth' | 'other';
}

const initialVars: EnvVar[] = [
  { id: '1', key: 'VITE_APP_NAME', value: 'Hikari Garden', isSecret: false, description: 'Application name', category: 'app' },
  { id: '2', key: 'VITE_APP_VERSION', value: '2.5.0', isSecret: false, description: 'Current version', category: 'app' },
  { id: '3', key: 'VITE_API_URL', value: 'https://api.zeiq.dev', isSecret: false, description: 'API endpoint', category: 'api' },
  { id: '4', key: 'VITE_GROQ_API_KEY', value: 'gsk_••••••••••••••••••••••••', isSecret: true, description: 'Groq API key', category: 'api' },
  { id: '5', key: 'VITE_GEMINI_API_KEY', value: 'AIza••••••••••••••••••••••••', isSecret: true, description: 'Gemini API key', category: 'api' },
  { id: '6', key: 'VITE_DATABASE_URL', value: 'postgresql://••••••••••••', isSecret: true, description: 'Database connection', category: 'database' },
  { id: '7', key: 'VITE_JWT_SECRET', value: '••••••••••••••••••••••••', isSecret: true, description: 'JWT signing secret', category: 'auth' },
  { id: '8', key: 'VITE_SESSION_TIMEOUT', value: '3600', isSecret: false, description: 'Session timeout (seconds)', category: 'auth' },
];

const categories = {
  app: { label: 'App', color: '#34d399' },
  api: { label: 'API', color: '#60a5fa' },
  database: { label: 'Database', color: '#a78bfa' },
  auth: { label: 'Auth', color: '#fbbf24' },
  other: { label: 'Other', color: '#9ca3af' },
};

export default function EnvironmentVars() {
  const [vars, setVars] = useState<EnvVar[]>(initialVars);
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [newVar, setNewVar] = useState({ key: '', value: '', description: '', category: 'app' as EnvVar['category'], isSecret: false });
  const [isAdding, setIsAdding] = useState(false);

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyValue = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addVar = () => {
    if (!newVar.key || !newVar.value) return;
    const envVar: EnvVar = {
      id: Date.now().toString(),
      key: newVar.key.toUpperCase().replace(/\s+/g, '_'),
      value: newVar.value,
      isSecret: newVar.isSecret,
      description: newVar.description,
      category: newVar.category,
    };
    setVars([...vars, envVar]);
    setNewVar({ key: '', value: '', description: '', category: 'app', isSecret: false });
    setIsAdding(false);
  };

  const deleteVar = (id: string) => {
    setVars(vars.filter(v => v.id !== id));
  };

  const filteredVars = filter === 'all' 
    ? vars 
    : vars.filter(v => v.category === filter || (filter === 'secrets' && v.isSecret));

  const stats = {
    total: vars.length,
    secrets: vars.filter(v => v.isSecret).length,
    exposed: vars.filter(v => !v.isSecret).length,
  };

  return (
    <section className={styles.envVars} id="environment-vars">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Settings size={28} />
        </div>
        <h2 className={styles.title}>Environment Variables</h2>
        <p className={styles.subtitle}>Manage app configuration</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.stat}>
          <Lock size={16} />
          <span className={styles.statValue} style={{ color: '#fbbf24' }}>{stats.secrets}</span>
          <span className={styles.statLabel}>Secrets</span>
        </div>
        <div className={styles.stat}>
          <Unlock size={16} />
          <span className={styles.statValue} style={{ color: '#34d399' }}>{stats.exposed}</span>
          <span className={styles.statLabel}>Exposed</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {['all', 'app', 'api', 'database', 'auth', 'secrets'].map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat === 'secrets' ? '🔒 Secrets' : categories[cat as keyof typeof categories]?.label}
            </button>
          ))}
        </div>
        <button className={styles.addBtn} onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} />
          Add Variable
        </button>
      </div>

      {isAdding && (
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="KEY_NAME"
            value={newVar.key}
            onChange={(e) => setNewVar({ ...newVar, key: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="value"
            value={newVar.value}
            onChange={(e) => setNewVar({ ...newVar, value: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Description"
            value={newVar.description}
            onChange={(e) => setNewVar({ ...newVar, description: e.target.value })}
            className={styles.input}
          />
          <select
            value={newVar.category}
            onChange={(e) => setNewVar({ ...newVar, category: e.target.value as EnvVar['category'] })}
            className={styles.select}
          >
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={newVar.isSecret}
              onChange={(e) => setNewVar({ ...newVar, isSecret: e.target.checked })}
            />
            <Lock size={14} />
            Secret
          </label>
          <button className={styles.saveBtn} onClick={addVar}>Save</button>
        </div>
      )}

      <div className={styles.varList}>
        {filteredVars.map(envVar => (
          <div key={envVar.id} className={styles.varCard}>
            <div className={styles.varHeader}>
              <div className={styles.varKey}>
                <span 
                  className={styles.categoryDot}
                  style={{ background: categories[envVar.category].color }}
                />
                <code>{envVar.key}</code>
                {envVar.isSecret && <Lock size={14} className={styles.secretIcon} />}
              </div>
              <div className={styles.varActions}>
                <button 
                  className={styles.actionBtn}
                  onClick={() => toggleSecret(envVar.id)}
                  title={showSecrets.has(envVar.id) ? 'Hide' : 'Show'}
                >
                  {showSecrets.has(envVar.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={() => copyValue(envVar.value, envVar.id)}
                  title="Copy"
                >
                  {copiedId === envVar.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={() => deleteVar(envVar.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className={styles.varValue}>
              {envVar.isSecret && !showSecrets.has(envVar.id) 
                ? '•'.repeat(Math.min(envVar.value.length, 20))
                : envVar.value
              }
            </div>
            <p className={styles.description}>{envVar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
