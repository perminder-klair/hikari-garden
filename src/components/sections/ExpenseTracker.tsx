import { useState, useEffect } from 'react';
import { Receipt, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, PieChart, Calendar } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

const categories = [
  { name: 'Food', color: '#e74c3c', icon: '🍽️' },
  { name: 'Transport', color: '#3498db', icon: '🚗' },
  { name: 'Entertainment', color: '#9b59b6', icon: '🎬' },
  { name: 'Shopping', color: '#f39c12', icon: '🛍️' },
  { name: 'Bills', color: '#e67e22', icon: '📄' },
  { name: 'Health', color: '#2ecc71', icon: '💊' },
  { name: 'Other', color: '#95a5a6', icon: '📦' },
];

const initialExpenses: Expense[] = [
  { id: '1', amount: 45.50, category: 'Food', description: 'Grocery shopping', date: '2026-03-12', type: 'expense' },
  { id: '2', amount: 1200, category: 'Bills', description: 'Rent', date: '2026-03-01', type: 'expense' },
  { id: '3', amount: 35, category: 'Entertainment', description: 'Cinema tickets', date: '2026-03-10', type: 'expense' },
  { id: '4', amount: 2500, category: 'Other', description: 'Freelance payment', date: '2026-03-05', type: 'income' },
  { id: '5', amount: 80, category: 'Transport', description: 'Fuel', date: '2026-03-11', type: 'expense' },
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.expense-tracker-section');
  }, [revealRef]);

  const filteredExpenses = expenses.filter(e => 
    filter === 'all' ? true : e.type === filter
  );

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, e) => acc + e.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, e) => acc + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.name && e.type === 'expense').reduce((acc, e) => acc + e.amount, 0),
  })).filter(c => c.total > 0);

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;
    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount.toString()),
      category: newExpense.category || 'Other',
      description: newExpense.description,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      type: newExpense.type || 'expense',
    };
    setExpenses([expense, ...expenses]);
    setShowAdd(false);
    setNewExpense({ category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <section className="expense-tracker-section" id="expenses" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Financial Flow
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Expense Tracker
        </h2>
      </div>

      {/* Balance Card */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Balance</p>
          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '3rem', color: balance >= 0 ? '#2ecc71' : '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>
            £{balance.toFixed(2)}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(46, 204, 113, 0.1)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <TrendingUp size={20} color="#2ecc71" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.25rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>£{totalIncome.toFixed(2)}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Income</div>
          </div>
          <div style={{ background: 'rgba(231, 76, 60, 0.1)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <TrendingDown size={20} color="#e74c3c" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.25rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>£{totalExpense.toFixed(2)}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expenses</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={16} />
            By Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categoryTotals.map(cat => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.name}</span>
                    <span style={{ fontSize: '0.85rem', color: cat.color }}>£{cat.total.toFixed(2)}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(cat.total / totalExpense) * 100}%`, height: '100%', background: cat.color, borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'expense', 'income'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                background: filter === f ? 'var(--accent-gold)' : 'transparent',
                border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '4px',
                color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredExpenses.map(expense => {
          const cat = categories.find(c => c.name === expense.category);
          return (
            <div
              key={expense.id}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{cat?.icon || '📦'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{expense.description}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{expense.date} • {expense.category}</div>
              </div>
              <div style={{ color: expense.type === 'income' ? '#2ecc71' : '#e74c3c', fontWeight: 500 }}>
                {expense.type === 'income' ? '+' : '-'}£{expense.amount.toFixed(2)}
              </div>
              <button
                onClick={() => deleteExpense(expense.id)}
                style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.25rem' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAdd && (
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
          onClick={() => setShowAdd(false)}
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
              Add Transaction
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {(['expense', 'income'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setNewExpense({ ...newExpense, type: t })}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: newExpense.type === t ? (t === 'income' ? '#2ecc71' : '#e74c3c') : 'transparent',
                    border: `1px solid ${newExpense.type === t ? (t === 'income' ? '#2ecc71' : '#e74c3c') : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '4px',
                    color: newExpense.type === t ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount || ''}
              onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
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

            <input
              type="text"
              placeholder="Description"
              value={newExpense.description || ''}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
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
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
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
            >
              {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addExpense}
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
                onClick={() => setShowAdd(false)}
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
