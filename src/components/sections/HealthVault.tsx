import { useState, useEffect } from 'react';
import { Heart, Activity, Scale, Droplets, Moon, Flame, TrendingUp, Calendar } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface HealthMetric {
  date: string;
  weight?: number;
  steps?: number;
  calories?: number;
  sleep?: number;
  water?: number;
  heartRate?: number;
}

const healthData: HealthMetric[] = [
  { date: '2026-03-11', weight: 72.5, steps: 8432, calories: 2150, sleep: 7.5, water: 2.5, heartRate: 68 },
  { date: '2026-03-10', weight: 72.8, steps: 10234, calories: 2380, sleep: 8, water: 3, heartRate: 65 },
  { date: '2026-03-09', weight: 73.1, steps: 6789, calories: 1980, sleep: 6.5, water: 2, heartRate: 70 },
  { date: '2026-03-08', weight: 73.0, steps: 12500, calories: 2650, sleep: 7, water: 3.5, heartRate: 62 },
  { date: '2026-03-07', weight: 73.2, steps: 8900, calories: 2200, sleep: 7.5, water: 2.5, heartRate: 66 },
  { date: '2026-03-06', weight: 73.5, steps: 5600, calories: 1850, sleep: 6, water: 2, heartRate: 72 },
  { date: '2026-03-05', weight: 73.8, steps: 11200, calories: 2450, sleep: 8, water: 3, heartRate: 64 },
];

const weeklyGoals = {
  steps: { target: 70000, current: 63455 },
  workouts: { target: 5, current: 3 },
  water: { target: 21, current: 16.5 },
  sleep: { target: 49, current: 43.5 },
};

export default function HealthVault() {
  const [selectedMetric, setSelectedMetric] = useState<keyof HealthMetric>('steps');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.health-vault-section');
  }, [revealRef]);

  const latest = healthData[0];
  const weekAvg = {
    weight: healthData.slice(0, 7).reduce((acc, d) => acc + (d.weight || 0), 0) / 7,
    steps: Math.round(healthData.slice(0, 7).reduce((acc, d) => acc + (d.steps || 0), 0) / 7),
    sleep: (healthData.slice(0, 7).reduce((acc, d) => acc + (d.sleep || 0), 0) / 7).toFixed(1),
    heartRate: Math.round(healthData.slice(0, 7).reduce((acc, d) => acc + (d.heartRate || 0), 0) / 7),
  };

  const metricConfig = {
    steps: { label: 'Steps', color: '#2ecc71', icon: Activity, unit: '' },
    calories: { label: 'Calories', color: '#e67e22', icon: Flame, unit: 'kcal' },
    sleep: { label: 'Sleep', color: '#9b59b6', icon: Moon, unit: 'hrs' },
    water: { label: 'Water', color: '#3498db', icon: Droplets, unit: 'L' },
    heartRate: { label: 'Heart Rate', color: '#e74c3c', icon: Heart, unit: 'bpm' },
  };

  return (
    <section className="health-vault-section" id="health" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Wellness Metrics
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Health Vault
        </h2>
      </div>

      {/* Today's Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
          <Activity size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{latest.steps?.toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Steps Today</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(230, 126, 34, 0.3)' }}>
          <Flame size={20} style={{ color: '#e67e22', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#e67e22', fontFamily: 'Cormorant Garamond, serif' }}>{latest.calories}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Calories</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(155, 89, 182, 0.3)' }}>
          <Moon size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#9b59b6', fontFamily: 'Cormorant Garamond, serif' }}>{latest.sleep}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sleep</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
          <Droplets size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{latest.water}L</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Water</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
          <Heart size={20} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{latest.heartRate}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Heart Rate</div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} />
          Weekly Goals
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(weeklyGoals).map(([key, goal]) => {
            const percent = (goal.current / goal.target) * 100;
            const colors: Record<string, string> = {
              steps: '#2ecc71',
              workouts: '#e67e22',
              water: '#3498db',
              sleep: '#9b59b6',
            };
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(percent, 100)}%`,
                    height: '100%',
                    background: colors[key],
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Chart */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} />
            7-Day History
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Object.entries(metricConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key as keyof HealthMetric)}
                  style={{
                    padding: '0.5rem',
                    background: selectedMetric === key ? config.color : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: selectedMetric === key ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                  title={config.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '150px', padding: '1rem 0' }}>
          {healthData.slice().reverse().map((day) => {
            const value = day[selectedMetric];
            const numValue = typeof value === 'number' ? value : 0;
            const max = Math.max(...healthData.map(d => {
              const v = d[selectedMetric];
              return typeof v === 'number' ? v : 0;
            }));
            const height = max > 0 ? (numValue / max) * 100 : 0;
            const config = metricConfig[selectedMetric as keyof typeof metricConfig];
            
            return (
              <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {selectedMetric === 'sleep' ? `${numValue}h` : numValue}
                </div>
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  background: config.color,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px',
                  transition: 'height 0.3s ease',
                }} />
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
