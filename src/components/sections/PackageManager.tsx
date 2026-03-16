import { useState } from 'react';
import { Package, Plus, Trash2, RefreshCw, Check, AlertCircle, Search, Filter } from 'lucide-react';
import styles from './PackageManager.module.css';

interface Package {
  id: string;
  name: string;
  version: string;
  latest: string;
  type: 'dependency' | 'devDependency';
  status: 'up-to-date' | 'update-available' | 'deprecated';
  description: string;
  size: string;
  lastUpdated: string;
}

const initialPackages: Package[] = [
  {
    id: '1',
    name: 'react',
    version: '^18.2.0',
    latest: '18.2.0',
    type: 'dependency',
    status: 'up-to-date',
    description: 'A JavaScript library for building user interfaces',
    size: '42 KB',
    lastUpdated: '2026-03-10',
  },
  {
    id: '2',
    name: 'react-dom',
    version: '^18.2.0',
    latest: '18.2.0',
    type: 'dependency',
    status: 'up-to-date',
    description: 'React package for working with the DOM',
    size: '1.2 MB',
    lastUpdated: '2026-03-10',
  },
  {
    id: '3',
    name: 'typescript',
    version: '^5.3.0',
    latest: '5.4.2',
    type: 'devDependency',
    status: 'update-available',
    description: 'TypeScript is a superset of JavaScript',
    size: '28 MB',
    lastUpdated: '2026-03-08',
  },
  {
    id: '4',
    name: 'vite',
    version: '^5.0.0',
    latest: '5.1.6',
    type: 'devDependency',
    status: 'update-available',
    description: 'Next generation frontend tooling',
    size: '18 MB',
    lastUpdated: '2026-03-05',
  },
  {
    id: '5',
    name: '@types/react',
    version: '^18.2.0',
    latest: '18.2.67',
    type: 'devDependency',
    status: 'update-available',
    description: 'TypeScript definitions for React',
    size: '156 KB',
    lastUpdated: '2026-03-12',
  },
  {
    id: '6',
    name: 'lucide-react',
    version: '^0.344.0',
    latest: '0.358.0',
    type: 'dependency',
    status: 'update-available',
    description: 'Beautiful & consistent icons',
    size: '2.4 MB',
    lastUpdated: '2026-03-11',
  },
  {
    id: '7',
    name: 'date-fns',
    version: '^3.3.0',
    latest: '3.6.0',
    type: 'dependency',
    status: 'update-available',
    description: 'Modern JavaScript date utility library',
    size: '1.8 MB',
    lastUpdated: '2026-03-09',
  },
  {
    id: '8',
    name: 'uuid',
    version: '^9.0.0',
    latest: '9.0.1',
    type: 'dependency',
    status: 'up-to-date',
    description: 'RFC4122 UUIDs',
    size: '12 KB',
    lastUpdated: '2026-02-28',
  },
];

const statusConfig = {
  'up-to-date': { color: '#34d399', icon: Check },
  'update-available': { color: '#fbbf24', icon: RefreshCw },
  'deprecated': { color: '#ef4444', icon: AlertCircle },
};

export default function PackageManager() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = filter === 'all' || pkg.type === filter || pkg.status === filter;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updatePackage = async (id: string) => {
    setUpdating(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, version: `^${pkg.latest}`, status: 'up-to-date' as const } : pkg
    ));
    setUpdating(null);
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const stats = {
    total: packages.length,
    dependencies: packages.filter(p => p.type === 'dependency').length,
    devDependencies: packages.filter(p => p.type === 'devDependency').length,
    updates: packages.filter(p => p.status === 'update-available').length,
  };

  return (
    <section className={styles.manager} id="package-manager">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Package size={28} />
        </div>
        <h2 className={styles.title}>Package Manager</h2>
        <p className={styles.subtitle}>Track and manage dependencies</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.dependencies}</span>
          <span className={styles.statLabel}>Dependencies</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.devDependencies}</span>
          <span className={styles.statLabel}>Dev</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#fbbf24' }}>{stats.updates}</span>
          <span className={styles.statLabel}>Updates</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {['all', 'dependency', 'devDependency', 'update-available'].map(type => (
            <button
              key={type}
              className={`${styles.filterBtn} ${filter === type ? styles.active : ''}`}
              onClick={() => setFilter(type)}
            >
              {type === 'all' ? 'All' : type === 'update-available' ? 'Updates' : type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.packageList}>
        {filteredPackages.map(pkg => {
          const StatusIcon = statusConfig[pkg.status].icon;
          return (
            <div key={pkg.id} className={styles.packageCard}>
              <div className={styles.packageHeader}>
                <div className={styles.packageInfo}>
                  <h3 className={styles.packageName}>{pkg.name}</h3>
                  <span className={styles.packageType}>{pkg.type}</span>
                </div>
                <div className={styles.packageActions}>
                  {pkg.status === 'update-available' && (
                    <button
                      className={styles.updateBtn}
                      onClick={() => updatePackage(pkg.id)}
                      disabled={updating === pkg.id}
                    >
                      {updating === pkg.id ? <RefreshCw size={14} className={styles.spin} /> : <RefreshCw size={14} />}
                      Update
                    </button>
                  )}
                  <button className={styles.removeBtn} onClick={() => removePackage(pkg.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className={styles.description}>{pkg.description}</p>

              <div className={styles.packageMeta}>
                <div className={styles.versions}>
                  <span className={styles.current}>{pkg.version}</span>
                  {pkg.status === 'update-available' && (
                    <span className={styles.latest}>→ {pkg.latest}</span>
                  )}
                </div>
                <div className={styles.details}>
                  <span>{pkg.size}</span>
                  <span>•</span>
                  <span>{pkg.lastUpdated}</span>
                </div>
              </div>

              <div className={styles.status} style={{ color: statusConfig[pkg.status].color }}>
                <StatusIcon size={14} />
                {pkg.status.replace('-', ' ')}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
