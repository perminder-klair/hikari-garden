import { useState } from 'react';
import { Globe, Activity, CheckCircle, AlertCircle, Clock, Send, Copy, Check } from 'lucide-react';
import styles from './APIDashboard.module.css';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  calls: number;
  lastChecked: string;
}

const initialEndpoints: Endpoint[] = [
  { id: '1', method: 'GET', path: '/api/health', status: 'healthy', latency: 45, uptime: 99.99, calls: 45231, lastChecked: '2s ago' },
  { id: '2', method: 'GET', path: '/api/users', status: 'healthy', latency: 120, uptime: 99.95, calls: 12847, lastChecked: '5s ago' },
  { id: '3', method: 'POST', path: '/api/auth/login', status: 'healthy', latency: 89, uptime: 99.98, calls: 8934, lastChecked: '3s ago' },
  { id: '4', method: 'GET', path: '/api/projects', status: 'degraded', latency: 450, uptime: 98.50, calls: 5621, lastChecked: '10s ago' },
  { id: '5', method: 'POST', path: '/api/tasks', status: 'healthy', latency: 156, uptime: 99.90, calls: 3421, lastChecked: '8s ago' },
  { id: '6', method: 'DELETE', path: '/api/cache', status: 'healthy', latency: 67, uptime: 99.99, calls: 892, lastChecked: '1m ago' },
];

const methodColors: Record<string, string> = {
  GET: '#34d399',
  POST: '#60a5fa',
  PUT: '#fbbf24',
  DELETE: '#ef4444',
  PATCH: '#a78bfa',
};

const statusConfig = {
  healthy: { color: '#34d399', icon: CheckCircle },
  degraded: { color: '#fbbf24', icon: AlertCircle },
  down: { color: '#ef4444', icon: AlertCircle },
};

export default function APIDashboard() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [testResponse, setTestResponse] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const avgLatency = Math.round(endpoints.reduce((acc, e) => acc + e.latency, 0) / endpoints.length);
  const totalCalls = endpoints.reduce((acc, e) => acc + e.calls, 0);
  const healthyCount = endpoints.filter(e => e.status === 'healthy').length;

  const testEndpoint = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setTestResponse(`HTTP/1.1 200 OK
Content-Type: application/json
X-Response-Time: ${endpoint.latency}ms

{
  "status": "success",
  "timestamp": "${new Date().toISOString()}",
  "endpoint": "${endpoint.path}",
  "method": "${endpoint.method}"
}`);
  };

  const copyResponse = async () => {
    await navigator.clipboard.writeText(testResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.apiDashboard} id="api-dashboard">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Globe size={28} />
        </div>
        <h2 className={styles.title}>API Dashboard</h2>
        <p className={styles.subtitle}>Endpoint monitoring & testing</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{endpoints.length}</span>
          <span className={styles.statLabel}>Endpoints</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#34d399' }}>{healthyCount}</span>
          <span className={styles.statLabel}>Healthy</span>
        </div>
        <div className={styles.stat}>
          <Activity size={16} />
          <span className={styles.statValue}>{avgLatency}ms</span>
          <span className={styles.statLabel}>Avg Latency</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalCalls.toLocaleString()}</span>
          <span className={styles.statLabel}>Total Calls</span>
        </div>
      </div>

      <div className={styles.endpoints}>
        {endpoints.map(endpoint => {
          const StatusIcon = statusConfig[endpoint.status].icon;
          return (
            <div 
              key={endpoint.id} 
              className={`${styles.endpointCard} ${selectedEndpoint?.id === endpoint.id ? styles.selected : ''}`}
              onClick={() => testEndpoint(endpoint)}
            >
              <div className={styles.endpointHeader}>
                <span 
                  className={styles.method}
                  style={{ background: methodColors[endpoint.method] }}
                >
                  {endpoint.method}
                </span>
                <code className={styles.path}>{endpoint.path}</code>
                <span 
                  className={styles.status}
                  style={{ color: statusConfig[endpoint.status].color }}
                >
                  <StatusIcon size={14} />
                  {endpoint.status}
                </span>
              </div>
              
              <div className={styles.endpointMetrics}>
                <div className={styles.metric}>
                  <Clock size={14} />
                  <span>{endpoint.latency}ms</span>
                </div>
                <div className={styles.metric}>
                  <span>{endpoint.uptime}%</span>
                </div>
                <div className={styles.metric}>
                  <span>{endpoint.calls.toLocaleString()} calls</span>
                </div>
              </div>
              
              <div className={styles.lastChecked}>
                Last checked: {endpoint.lastChecked}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEndpoint && (
        <div className={styles.testPanel}>
          <div className={styles.testHeader}>
            <h4>Test Response</h4>
            <button className={styles.copyBtn} onClick={copyResponse}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={styles.response}>{testResponse}</pre>
        </div>
      )}
    </section>
  );
}
