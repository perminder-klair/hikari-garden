import { useState } from 'react';
import { ToggleLeft, Plus } from 'lucide-react';
import styles from './FeatureFlags.module.css';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'boolean' | 'percentage' | 'user';
  lastModified: string;
  environments: {
    development: boolean;
    staging: boolean;
    production: boolean;
  };
}

const initialFlags: FeatureFlag[] = [
  {
    id: '1',
    name: 'new_dashboard',
    description: 'Enable the redesigned dashboard layout',
    enabled: true,
    type: 'boolean',
    lastModified: '2 hours ago',
    environments: { development: true, staging: true, production: false },
  },
  {
    id: '2',
    name: 'dark_mode_v2',
    description: 'Next generation dark mode with auto-switching',
    enabled: true,
    type: 'boolean',
    lastModified: '1 day ago',
    environments: { development: true, staging: true, production: true },
  },
  {
    id: '3',
    name: 'beta_api',
    description: 'Route 10% of traffic to new API endpoints',
    enabled: false,
    type: 'percentage',
    lastModified: '3 days ago',
    environments: { development: true, staging: false, production: false },
  },
  {
    id: '4',
    name: 'premium_features',
    description: 'Enable premium features for beta users',
    enabled: true,
    type: 'user',
    lastModified: '1 week ago',
    environments: { development: true, staging: true, production: true },
  },
  {
    id: '5',
    name: 'experimental_ai',
    description: 'AI-powered content suggestions',
    enabled: false,
    type: 'boolean',
    lastModified: '2 weeks ago',
    environments: { development: true, staging: false, production: false },
  },
];

type Environment = 'development' | 'staging' | 'production';

export default function FeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);
  const [activeEnv, setActiveEnv] = useState<Environment>('development');

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => 
      f.id === id 
        ? { ...f, enabled: !f.enabled, environments: { ...f.environments, [activeEnv]: !f.environments[activeEnv] } }
        : f
    ));
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'boolean': return styles.typeBoolean;
      case 'percentage': return styles.typePercentage;
      case 'user': return styles.typeUser;
      default: return '';
    }
  };

  const enabledCount = flags.filter(f => f.environments[activeEnv]).length;

  return (
    <section className={styles.featureFlags}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <ToggleLeft className={styles.icon} size={20} />
          Feature Flags
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
            ({enabledCount}/{flags.length} enabled)
          </span>
        </h2>
        <button className={styles.addBtn}>
          <Plus size={14} />
          New Flag
        </button>
      </div>

      <div className={styles.environmentTabs}>
        {(['development', 'staging', 'production'] as Environment[]).map((env) => (
          <button
            key={env}
            className={`${styles.tab} ${activeEnv === env ? styles.tabActive : ''}`}
            onClick={() => setActiveEnv(env)}
          >
            {env.charAt(0).toUpperCase() + env.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.flagsList}>
        {flags.map((flag) => (
          <div key={flag.id} className={styles.flagItem}>
            <button
              className={`${styles.flagToggle} ${flag.environments[activeEnv] ? styles.flagToggleActive : ''}`}
              onClick={() => toggleFlag(flag.id)}
            >
              <div className={styles.flagToggleKnob} />
            </button>
            
            <div className={styles.flagInfo}>
              <div className={styles.flagName}>{flag.name}</div>
              <div className={styles.flagDescription}>{flag.description}</div>
            </div>
            
            <div className={styles.flagMeta}>
              <span className={`${styles.flagType} ${getTypeClass(flag.type)}`}>
                {flag.type}
              </span>
              <span className={styles.lastModified}>{flag.lastModified}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
