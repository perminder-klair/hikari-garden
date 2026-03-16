import { useState } from 'react';
import { Play, Send, Save, Trash2, Plus, Copy, Check, Globe, Lock, Clock } from 'lucide-react';
import styles from './APIPlayground.module.css';

interface APIRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body: string;
  createdAt: string;
}

interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
}

const savedRequests: APIRequest[] = [
  {
    id: '1',
    name: 'Get Weather',
    method: 'GET',
    url: 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
    headers: {},
    body: '',
    createdAt: '2026-03-10',
  },
  {
    id: '2',
    name: 'GitHub User',
    method: 'GET',
    url: 'https://api.github.com/users/parminderklair',
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    body: '',
    createdAt: '2026-03-09',
  },
];

const methodColors: Record<string, string> = {
  GET: '#34d399',
  POST: '#60a5fa',
  PUT: '#fbbf24',
  DELETE: '#ef4444',
  PATCH: '#a78bfa',
};

export default function APIPlayground() {
  const [requests, setRequests] = useState<APIRequest[]>(savedRequests);
  const [activeRequest, setActiveRequest] = useState<APIRequest>({
    id: '',
    name: 'New Request',
    method: 'GET',
    url: '',
    headers: {},
    body: '',
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method: activeRequest.method,
        headers: activeRequest.headers,
      };
      
      if (['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && activeRequest.body) {
        options.body = activeRequest.body;
      }
      
      const res = await fetch(activeRequest.url, options);
      const duration = Date.now() - startTime;
      
      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      const body = await res.text();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers,
        body: body.slice(0, 5000),
        duration,
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        body: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      });
    } finally {
      setLoading(false);
    }
  };

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setActiveRequest({
        ...activeRequest,
        headers: { ...activeRequest.headers, [newHeaderKey]: newHeaderValue },
      });
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...activeRequest.headers };
    delete newHeaders[key];
    setActiveRequest({ ...activeRequest, headers: newHeaders });
  };

  const saveRequest = () => {
    const newRequest = { ...activeRequest, id: Date.now().toString() };
    setRequests([newRequest, ...requests]);
    setShowSaveModal(false);
  };

  const deleteRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const loadRequest = (request: APIRequest) => {
    setActiveRequest(request);
    setResponse(null);
  };

  const copyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatJSON = (text: string) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  return (
    <section className={styles.playground} id="api-playground">
      <div className={styles.header}>
        <div className={styles.icon}>
          <Globe size={28} />
        </div>
        <h2 className={styles.title}>API Playground</h2>
        <p className={styles.subtitle}>Test and explore APIs</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Saved Requests</h3>
            <button className={styles.newBtn} onClick={() => {
              setActiveRequest({
                id: '',
                name: 'New Request',
                method: 'GET',
                url: '',
                headers: {},
                body: '',
                createdAt: new Date().toISOString().split('T')[0],
              });
              setResponse(null);
            }}>
              <Plus size={14} />
              New
            </button>
          </div>
          
          <div className={styles.requestList}>
            {requests.map(request => (
              <div
                key={request.id}
                className={`${styles.requestItem} ${activeRequest.id === request.id ? styles.active : ''}`}
                onClick={() => loadRequest(request)}
              >
                <span
                  className={styles.method}
                  style={{ color: methodColors[request.method] }}
                >
                  {request.method}
                </span>
                <span className={styles.requestName}>{request.name}</span>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRequest(request.id);
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.requestPanel}>
            <div className={styles.requestBar}>
              <select
                className={styles.methodSelect}
                value={activeRequest.method}
                onChange={(e) => setActiveRequest({ ...activeRequest, method: e.target.value as APIRequest['method'] })}
                style={{ color: methodColors[activeRequest.method] }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              
              <input
                type="text"
                className={styles.urlInput}
                placeholder="Enter URL..."
                value={activeRequest.url}
                onChange={(e) => setActiveRequest({ ...activeRequest, url: e.target.value })}
              />
              
              <button
                className={styles.sendBtn}
                onClick={sendRequest}
                disabled={loading || !activeRequest.url}
              >
                {loading ? <Clock size={16} className={styles.spin} /> : <Send size={16} />}
                {loading ? 'Sending...' : 'Send'}
              </button>
              
              <button
                className={styles.saveBtn}
                onClick={() => setShowSaveModal(true)}
              >
                <Save size={16} />
              </button>
            </div>

            <div className={styles.tabs}>
              <div className={styles.tabContent}>
                <h4>Headers</h4>
                <div className={styles.headersList}>
                  {Object.entries(activeRequest.headers).map(([key, value]) => (
                    <div key={key} className={styles.headerRow}>
                      <span className={styles.headerKey}>{key}</span>
                      <span className={styles.headerValue}>{value}</span>
                      <button onClick={() => removeHeader(key)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.addHeader}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={newHeaderKey}
                    onChange={(e) => setNewHeaderKey(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                  />
                  <button onClick={addHeader}>Add</button>
                </div>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && (
                <div className={styles.tabContent}>
                  <h4>Body</h4>
                  <textarea
                    className={styles.bodyInput}
                    placeholder="Request body (JSON)..."
                    value={activeRequest.body}
                    onChange={(e) => setActiveRequest({ ...activeRequest, body: e.target.value })}
                    rows={6}
                  />
                </div>
              )}
            </div>
          </div>

          {response && (
            <div className={styles.responsePanel}>
              <div className={styles.responseHeader}>
                <div className={styles.responseMeta}>
                  <span
                    className={styles.status}
                    style={{
                      color: response.status >= 200 && response.status < 300 ? '#34d399' :
                             response.status >= 400 ? '#ef4444' : '#fbbf24'
                    }}
                  >
                    {response.status} {response.statusText}
                  </span>
                  <span className={styles.duration}>{response.duration}ms</span>
                </div>
                <button className={styles.copyBtn} onClick={copyResponse}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <pre className={styles.responseBody}>
                <code>{formatJSON(response.body)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className={styles.modal} onClick={() => setShowSaveModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowSaveModal(false)}>×</button>
            <h3>Save Request</h3>
            <input
              type="text"
              placeholder="Request name..."
              value={activeRequest.name}
              onChange={(e) => setActiveRequest({ ...activeRequest, name: e.target.value })}
            />
            <button className={styles.confirmBtn} onClick={saveRequest} disabled={!activeRequest.name}>
              Save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
