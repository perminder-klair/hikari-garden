import { useState, useEffect } from 'react';
import { CreditCard, Calendar, PoundSterling, AlertCircle, Check, X, Plus } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Subscription {
  id: string;
  name: string;
  category: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextPayment: string;
  status: 'active' | 'paused' | 'cancelled';
  url?: string;
}

const initialSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', category: 'Entertainment', cost: 10.99, billingCycle: 'monthly', nextPayment: '2026-03-15', status: 'active' },
  { id: '2', name: 'Spotify', category: 'Entertainment', cost: 9.99, billingCycle: 'monthly', nextPayment: '2026-03-20', status: 'active' },
  { id: '3', name: 'GitHub Pro', category: 'Development', cost: 4, billingCycle: 'monthly', nextPayment: '2026-03-25', status: 'active' },
  { id: '4', name: 'Notion', category: 'Productivity', cost: 8, billingCycle: 'monthly', nextPayment: '2026-03-18', status: 'active' },
  { id: '5', name: 'Adobe CC', category: 'Creative', cost: 52.99, billingCycle: 'monthly', nextPayment: '2026-03-10', status: 'active' },
  { id: '6', name: 'AWS', category: 'Development', cost: 25, billingCycle: 'monthly', nextPayment: '2026-03-28', status: 'active' },
];

const categories = ['All', 'Entertainment', 'Development', 'Productivity', 'Creative', 'Health', 'Other'];

export default function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newSub, setNewSub] = useState({
    name: '',
    category: 'Entertainment',
    cost: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    nextPayment: '',
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.subscription-tracker-section');
  }, [revealRef]);

  const filteredSubs = filter === 'All' ? subscriptions : subscriptions.filter(s => s.category === filter);

  const monthlyTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + (s.billingCycle === 'yearly' ? s.cost / 12 : s.cost), 0);

  const yearlyTotal = monthlyTotal * 12;

  const upcomingPayments = subscriptions
    .filter(s => s.status === 'active')
    .sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime())
    .slice(0, 3);

  const addSubscription = () => {
    if (!newSub.name || !newSub.cost || !newSub.nextPayment) return;
    const sub: Subscription = {
      id: Date.now().toString(),
      name: newSub.name,
      category: newSub.category,
      cost: parseFloat(newSub.cost),
      billingCycle: newSub.billingCycle,
      nextPayment: newSub.nextPayment,
      status: 'active',
    };
    setSubscriptions([...subscriptions, sub]);
    setIsAdding(false);
    setNewSub({ name: '', category: 'Entertainment', cost: '', billingCycle: 'monthly', nextPayment: '' });
  };

  const toggleStatus = (id: string) => {
    setSubscriptions(subs => subs.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
    ));
  };

  const deleteSub = (id: string) => {
    setSubscriptions(subs => subs.filter(s => s.id !== id));
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <section className="subscription-tracker-section" id="subscriptions" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Financial Management
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Subscription Tracker
        </h2>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(244, 208, 63, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Calendar size={16} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly</span>
          </div>
          <div style={{ fontSize: '1.75rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
            £{monthlyTotal.toFixed(2)}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <PoundSterling size={16} color="#3498db" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yearly</span>
          </div>
          <div style={{ fontSize: '1.75rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>
            £{yearlyTotal.toFixed(0)}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CreditCard size={16} color="#2ecc71" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active</span>
          </div>
          <div style={{ fontSize: '1.75rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>
            {subscriptions.filter(s => s.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === cat ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {filteredSubs.map(sub => {
          const daysUntil = getDaysUntil(sub.nextPayment);
          const isDueSoon = daysUntil <= 7 && daysUntil >= 0;
          const isOverdue = daysUntil < 0;

          return (
            <div
              key={sub.id}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${sub.status === 'active' ? (isDueSoon ? '#f39c1230' : 'rgba(255,255,255,0.05)') : '#7f8c8d30'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                opacity: sub.status === 'active' ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                    {sub.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.category}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleStatus(sub.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: sub.status === 'active' ? '#2ecc71' : '#7f8c8d',
                      cursor: 'pointer',
                      padding: '0.25rem',
                    }}
                  >
                    {sub.status === 'active' ? <Check size={16} /> : <X size={16} />}
                  </button>
                  <button
                    onClick={() => deleteSub(sub.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      padding: '0.25rem',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>
                  £{sub.cost}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: isOverdue ? '#e74c3c' : isDueSoon ? '#f39c12' : 'var(--text-muted)' }}>
                <AlertCircle size={14} />
                {isOverdue ? `${Math.abs(daysUntil)} days overdue` : isDueSoon ? `Due in ${daysUntil} days` : `Next: ${new Date(sub.nextPayment).toLocaleDateString('en-GB')}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Payments */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} />
          Upcoming Payments
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {upcomingPayments.map(sub => {
            const daysUntil = getDaysUntil(sub.nextPayment);
            return (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: daysUntil <= 7 ? '#f39c12' : '#2ecc71' }} />
                  <span style={{ color: 'var(--text-primary)' }}>{sub.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>£{sub.cost}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(sub.nextPayment).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setIsAdding(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Add Subscription
            </h3>

            <input
              type="text"
              placeholder="Service name"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            />

            <select
              value={newSub.category}
              onChange={(e) => setNewSub({ ...newSub, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Cost"
                value={newSub.cost}
                onChange={(e) => setNewSub({ ...newSub, cost: e.target.value })}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <select
                value={newSub.billingCycle}
                onChange={(e) => setNewSub({ ...newSub, billingCycle: e.target.value as 'monthly' | 'yearly' })}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <input
              type="date"
              value={newSub.nextPayment}
              onChange={(e) => setNewSub({ ...newSub, nextPayment: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addSubscription}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
              <button
                onClick={() => setIsAdding(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
