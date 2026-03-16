import { useState } from 'react';
import { Webhook, CheckCircle, XCircle, Clock, Copy, Check, RefreshCw, Plus } from 'lucide-react';
import styles from './WebhookManager.module.css';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  lastDelivery: string | null;
  successRate: number;
  secret: string;
}

const initialWebhooks: WebhookConfig[] = [
  {
    id: '1',
    name: 'GitHub Integration',
    url: 'https://zeiq.dev/api/webhooks/github',
    events: ['push', 'pull_request', 'release'],
    status: 'active',
    lastDelivery: '2m ago',
    successRate: 99.5,
    secret: 'whsec_••••••••••••••••••••••••',
  },
  {
    id: '2',
    name: 'Discord Notifications',
    url: 'https://discord.com/api/webhooks/••••••••••••••••••',
    events: ['deployment', 'alert'],
    status: 'active',
    lastDelivery: '15m ago',
    successRate: 98.2,
    secret: '••••••••••••••••••••••••',
  },
  {
    id: '3',
    name: 'Slack Alerts',
    url: 'https://hooks.slack.com/services/••••••••••••••••••',
    events: ['error', 'critical'],
    status: 'failed',
    lastDelivery: '2h ago',
    successRate: 45.0,
    secret: '••••••••••••••••••••••••',
  },
  {
    id: '4',
    name: 'Custom Endpoint',
    url: 'https://api.internal.company.com/webhooks',
    events: ['user.created', 'user.updated'],
    status: 'active',
    lastDelivery: '5m ago',
    successRate: 99.9,
    secret: 'sk_••••••••••••••••••••••••',
  },
];

const statusConfig = {
  active: { color: '#34d399', icon: CheckCircle },
  inactive: { color: '#9ca3af', icon: XCircle },
  failed: { color: '#ef4444', icon: XCircle },
};

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleStatus = (id: string) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === id 
        ? { ...wh, status: wh.status === 'active' ? 'inactive' : 'active' as const }
        : wh
    ));
  };

  const copySecret = async (secret: string) => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCount = webhooks.filter(w => w.status === 'active').length;
  const avgSuccess = webhooks.reduce((acc, w) => acc + w.successRate, 0) / webhooks.length;

  return (
    <section className={styles.webhookManager} id="webhook-manager">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Webhook size={28} />
        </div>
        <h2 className={styles.title}>Webhook Manager</h2>
        <p className={styles.subtitle}>Endpoint configuration & delivery logs</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{webhooks.length}</span>
          <span className={styles.statLabel}>Webhooks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#34d399' }}>{activeCount}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{avgSuccess.toFixed(1)}%</span>
          <span className={styles.statLabel}>Avg Success</span>
        </div>
      </div>

      <div className={styles.webhookList}>
        {webhooks.map(webhook => {
          const StatusIcon = statusConfig[webhook.status].icon;
          return (
            <div 
              key={webhook.id} 
              className={`${styles.webhookCard} ${selectedWebhook?.id === webhook.id ? styles.selected : ''}`}
              onClick={() => setSelectedWebhook(selectedWebhook?.id === webhook.id ? null : webhook)}
            >
              <div className={styles.webhookHeader}>
                <div className={styles.webhookInfo}>
                  <h3>{webhook.name}</h3>
                  <span 
                    className={styles.status}
                    style={{ color: statusConfig[webhook.status].color }}
                  >
                    <StatusIcon size={14} />
                    {webhook.status}
                  </span>
                </div>
                <button 
                  className={styles.toggleBtn}
                  onClick={(e) => { e.stopPropagation(); toggleStatus(webhook.id); }}
                >
                  {webhook.status === 'active' ? 'Pause' : 'Activate'}
                </button>
              </div>

              <div className={styles.webhookUrl}>
                <code>{webhook.url}</code>
              </div>

              <div className={styles.events}>
                {webhook.events.map(event => (
                  <span key={event} className={styles.eventTag}>{event}</span>
                ))}
              </div>

              <div className={styles.webhookMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Success Rate:</span>
                  <span 
                    className={styles.metricValue}
                    style={{ color: webhook.successRate > 95 ? '#34d399' : webhook.successRate > 80 ? '#fbbf24' : '#ef4444' }}
                  >
                    {webhook.successRate}%
                  </span>
                </div>
                <div className={styles.metric}>
                  <Clock size={14} />
                  <span>{webhook.lastDelivery || 'Never'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedWebhook && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h4>Webhook Secret</h4>
            <button className={styles.copyBtn} onClick={() => copySecret(selectedWebhook.secret)}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <code className={styles.secret}>{selectedWebhook.secret}</code>
          
          <div className={styles.payloadExample}>
            <h5>Example Payload</h5>
            <pre>{`{
  "event": "${selectedWebhook.events[0]}",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "id": "evt_1234567890",
    "type": "${selectedWebhook.events[0]}"
  }
}`}</pre>
          </div>
        </div>
      )}
    </section>
  );
}
