import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, Target, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-03-11', description: 'Freelance Project', amount: 2500, category: 'Income', type: 'income' },
  { id: '2', date: '2026-03-10', description: 'Gym Membership', amount: 35, category: 'Health', type: 'expense' },
  { id: '3', date: '2026-03-09', description: 'Groceries', amount: 85, category: 'Food', type: 'expense' },
  { id: '4', date: '2026-03-08', description: 'Side Project Payment', amount: 1200, category: 'Income', type: 'income' },
  { id: '5', date: '2026-03-07', description: 'Books', amount: 45, category: 'Learning', type: 'expense' },
  { id: '6', date: '2026-03-06', description: 'Coffee & Snacks', amount: 18, category: 'Food', type: 'expense' },
];

const budgetCategories: BudgetCategory[] = [
  { name: 'Food', budgeted: 400, spent: 285, color: '#e74c3c' },
  { name: 'Health', budgeted: 150, spent: 120, color: '#2ecc71' },
  { name: 'Learning', budgeted: 200, spent: 145, color: '#3498db' },
  { name: 'Entertainment', budgeted: 100, spent: 45, color: '#9b59b6' },
  { name: 'Transport', budgeted: 150, spent: 98, color: '#f39c12' },
];

const savingsGoals = [
  { name: 'Emergency Fund', target: 10000, current: 6500, color: '#2ecc71' },
  { name: 'New Laptop', target: 2500, current: 1800, color: '#3498db' },
  { name: 'Holiday', target: 3000, current: 1200, color: '#e67e22' },
];

export default function FinanceGarden() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isAdding, setIsAdding] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense' as 'income' | 'expense',
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.finance-garden-section');
  }, [revealRef]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type,
    };
    setTransactions([transaction, ...transactions]);
    setIsAdding(false);
    setNewTransaction({ description: '', amount: '', category: 'Food', type: 'expense' });
  };

  return (
    <section className="finance-garden-section" id="finance" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Financial Wellness
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Finance Garden
        </h2>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={16} color="#2ecc71" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Income</span>
          </div>
          <div style={{ fontSize: '1.75rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>
            £{totalIncome.toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TrendingDown size={16} color="#e74c3c" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expenses</span>
          </div>
          <div style={{ fontSize: '1.75rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>
            £{totalExpenses.toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: `1px solid ${netSavings >= 0 ? 'rgba(52, 152, 219, 0.3)' : 'rgba(231, 76, 60, 0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Wallet size={16} color={netSavings >= 0 ? '#3498db' : '#e74c3c'} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Savings</span>
          </div>
          <div style={{ fontSize: '1.75rem', color: netSavings >= 0 ? '#3498db' : '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>
            £{netSavings.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={18} />
          Monthly Budget
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {budgetCategories.map(cat => {
            const percent = (cat.spent / cat.budgeted) * 100;
            return (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.name}</span>
                  <span style={{ fontSize: '0.8rem', color: percent > 90 ? '#e74c3c' : 'var(--text-muted)' }}>
                    £{cat.spent} / £{cat.budgeted}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(percent, 100)}%`,
                    height: '100%',
                    background: percent > 90 ? '#e74c3c' : cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {savingsGoals.map(goal => {
          const percent = (goal.current / goal.target) * 100;
          return (
            <div key={goal.name} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: `1px solid ${goal.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{goal.name}</span>
                <Target size={16} color={goal.color} />
              </div>
              <div style={{ fontSize: '1.5rem', color: goal.color, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>
                £{goal.current.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                of £{goal.target.toLocaleString()} target
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: goal.color,
                  borderRadius: '3px',
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                {Math.round(percent)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} />
            Recent Transactions
          </h3>
          <button
            onClick={() => setIsAdding(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-gold)',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--bg-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Add Transaction
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.slice(0, 6).map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date} • {t.category}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: t.type === 'income' ? '#2ecc71' : '#e74c3c', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>
                {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                £{t.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
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
              Add Transaction
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Type</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['expense', 'income'].map(type => (
                  <button
                    key={type}
                    onClick={() => setNewTransaction({ ...newTransaction, type: type as 'income' | 'expense' })}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: newTransaction.type === type ? (type === 'income' ? '#2ecc71' : '#e74c3c') : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '4px',
                      color: newTransaction.type === type ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
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
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
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
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
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
              {['Food', 'Health', 'Learning', 'Entertainment', 'Transport', 'Income'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addTransaction}
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
