import { useState, useEffect } from 'react';
import { Leaf, Droplets, Sun, Wind, Plus, Calendar, Heart, Trash2 } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Plant {
  id: string;
  name: string;
  species: string;
  acquired: string;
  lastWatered: string;
  waterFrequency: number; // days
  sunlight: 'low' | 'medium' | 'high';
  health: number; // 0-100
  notes: string;
  image?: string;
}

const initialPlants: Plant[] = [
  {
    id: '1',
    name: 'Monty',
    species: 'Monstera Deliciosa',
    acquired: '2025-08-15',
    lastWatered: '2026-03-10',
    waterFrequency: 7,
    sunlight: 'medium',
    health: 95,
    notes: 'Thriving! New leaf unfurling.',
  },
  {
    id: '2',
    name: 'Spike',
    species: 'Snake Plant',
    acquired: '2025-06-20',
    lastWatered: '2026-03-08',
    waterFrequency: 14,
    sunlight: 'low',
    health: 100,
    notes: 'Very low maintenance.',
  },
  {
    id: '3',
    name: 'Fern',
    species: 'Boston Fern',
    acquired: '2025-11-01',
    lastWatered: '2026-03-11',
    waterFrequency: 3,
    sunlight: 'medium',
    health: 78,
    notes: 'Needs more humidity.',
  },
];

const sunlightIcons = {
  low: '🌑',
  medium: '⛅',
  high: '☀️',
};

export default function PlantTracker() {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlant, setNewPlant] = useState<Partial<Plant>>({
    sunlight: 'medium',
    health: 100,
    waterFrequency: 7,
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.plant-tracker-section');
  }, [revealRef]);

  const getDaysSinceWatered = (lastWatered: string) => {
    const last = new Date(lastWatered);
    const now = new Date();
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getWaterStatus = (plant: Plant) => {
    const daysSince = getDaysSinceWatered(plant.lastWatered);
    const daysUntil = plant.waterFrequency - daysSince;
    if (daysUntil <= 0) return { status: 'overdue', color: '#e74c3c', text: `${Math.abs(daysUntil)} days overdue` };
    if (daysUntil <= 2) return { status: 'due', color: '#f39c12', text: `${daysUntil} days left` };
    return { status: 'ok', color: '#2ecc71', text: `${daysUntil} days left` };
  };

  const waterPlant = (id: string) => {
    setPlants(plants.map(p => 
      p.id === id ? { ...p, lastWatered: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const addPlant = () => {
    if (!newPlant.name || !newPlant.species) return;
    const plant: Plant = {
      id: Date.now().toString(),
      name: newPlant.name,
      species: newPlant.species,
      acquired: new Date().toISOString().split('T')[0],
      lastWatered: new Date().toISOString().split('T')[0],
      waterFrequency: newPlant.waterFrequency || 7,
      sunlight: newPlant.sunlight || 'medium',
      health: newPlant.health || 100,
      notes: newPlant.notes || '',
    };
    setPlants([...plants, plant]);
    setShowAdd(false);
    setNewPlant({ sunlight: 'medium', health: 100, waterFrequency: 7 });
  };

  const deletePlant = (id: string) => {
    setPlants(plants.filter(p => p.id !== id));
  };

  const stats = {
    total: plants.length,
    needWater: plants.filter(p => getWaterStatus(p).status === 'overdue').length,
    avgHealth: Math.round(plants.reduce((acc, p) => acc + p.health, 0) / plants.length),
  };

  return (
    <section className="plant-tracker-section" id="plants" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Living Collection
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Plant Tracker
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Leaf size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Plants</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Droplets size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: stats.needWater > 0 ? '#e74c3c' : '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.needWater}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Need Water</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <Heart size={20} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{stats.avgHealth}%</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Health</div>
        </div>
      </div>

      {/* Add Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus size={16} />
          Add Plant
        </button>
      </div>

      {/* Plants Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {plants.map(plant => {
          const waterStatus = getWaterStatus(plant);
          return (
            <div
              key={plant.id}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${waterStatus.status === 'overdue' ? '#e74c3c30' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>{plant.name}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{plant.species}</p>
                </div>
                <button
                  onClick={() => deletePlant(plant.id)}
                  style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{sunlightIcons[plant.sunlight]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Health</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plant.health}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${plant.health}%`, height: '100%', background: plant.health > 70 ? '#2ecc71' : plant.health > 40 ? '#f39c12' : '#e74c3c', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <Droplets size={14} color={waterStatus.color} />
                <span style={{ fontSize: '0.8rem', color: waterStatus.color }}>{waterStatus.text}</span>
              </div>

              {plant.notes && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{plant.notes}"
                </p>
              )}

              <button
                onClick={() => waterPlant(plant.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: waterStatus.status === 'overdue' ? '#e74c3c' : '#3498db',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Droplets size={16} />
                Water Plant
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
              Add New Plant
            </h3>

            <input
              type="text"
              placeholder="Plant name"
              value={newPlant.name || ''}
              onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
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
              placeholder="Species"
              value={newPlant.species || ''}
              onChange={(e) => setNewPlant({ ...newPlant, species: e.target.value })}
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
              value={newPlant.sunlight}
              onChange={(e) => setNewPlant({ ...newPlant, sunlight: e.target.value as Plant['sunlight'] })}
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
              <option value="low">Low Light 🌑</option>
              <option value="medium">Medium Light ⛅</option>
              <option value="high">High Light ☀️</option>
            </select>

            <input
              type="number"
              placeholder="Water every X days"
              value={newPlant.waterFrequency || ''}
              onChange={(e) => setNewPlant({ ...newPlant, waterFrequency: parseInt(e.target.value) })}
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

            <textarea
              placeholder="Notes (optional)"
              value={newPlant.notes || ''}
              onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                minHeight: '80px',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addPlant}
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
                Add Plant
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
