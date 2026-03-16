import { useState, useEffect } from 'react';
import { Dumbbell, Trophy, Flame, Calendar, Plus, Trash2, Activity } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  exercises: Exercise[];
  notes: string;
  rating: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

const workoutTypes = [
  { name: 'Push', icon: '💪', color: '#e74c3c' },
  { name: 'Pull', icon: '🏋️', color: '#3498db' },
  { name: 'Legs', icon: '🦵', color: '#2ecc71' },
  { name: 'Full Body', icon: '🔥', color: '#f39c12' },
  { name: 'Cardio', icon: '🏃', color: '#9b59b6' },
  { name: 'Boxing', icon: '🥊', color: '#e67e22' },
];

const initialWorkouts: Workout[] = [
  {
    id: '1',
    date: '2026-03-12',
    type: 'Push',
    duration: 60,
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
      { name: 'Overhead Press', sets: 3, reps: 10, weight: 50 },
      { name: 'Dips', sets: 3, reps: 12 },
    ],
    notes: 'Good session, felt strong',
    rating: 5,
  },
  {
    id: '2',
    date: '2026-03-11',
    type: 'Pull',
    duration: 55,
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 120 },
      { name: 'Pull-ups', sets: 4, reps: 8 },
      { name: 'Barbell Rows', sets: 3, reps: 10, weight: 70 },
    ],
    notes: 'Back felt good',
    rating: 4,
  },
  {
    id: '3',
    date: '2026-03-10',
    type: 'Legs',
    duration: 65,
    exercises: [
      { name: 'Squats', sets: 4, reps: 8, weight: 100 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 150 },
      { name: 'Calf Raises', sets: 4, reps: 15, weight: 60 },
    ],
    notes: 'Heavy leg day',
    rating: 5,
  },
];

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [showAdd, setShowAdd] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    type: 'Push',
    duration: 60,
    exercises: [],
    date: new Date().toISOString().split('T')[0],
    rating: 4,
  });
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({ sets: 3, reps: 10 });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.workout-log-section');
  }, [revealRef]);

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((acc, w) => acc + w.duration, 0);
  const currentStreak = calculateStreak(workouts);
  const avgRating = workouts.reduce((acc, w) => acc + w.rating, 0) / workouts.length;

  const typeStats = workoutTypes.map(type => ({
    ...type,
    count: workouts.filter(w => w.type === type.name).length,
    minutes: workouts.filter(w => w.type === type.name).reduce((acc, w) => acc + w.duration, 0),
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count);

  function calculateStreak(workouts: Workout[]): number {
    const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 && (dates[i] === today || dates[i] === yesterday)) {
        streak++;
      } else if (i > 0) {
        const curr = new Date(dates[i]);
        const prev = new Date(dates[i - 1]);
        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
      }
    }
    return streak;
  }

  const addExercise = () => {
    if (!newExercise.name) return;
    setNewWorkout({
      ...newWorkout,
      exercises: [...(newWorkout.exercises || []), newExercise as Exercise],
    });
    setNewExercise({ sets: 3, reps: 10 });
  };

  const removeExercise = (index: number) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises?.filter((_, i) => i !== index),
    });
  };

  const addWorkout = () => {
    if (!newWorkout.exercises?.length) return;
    const workout: Workout = {
      id: Date.now().toString(),
      date: newWorkout.date || new Date().toISOString().split('T')[0],
      type: newWorkout.type || 'Push',
      duration: newWorkout.duration || 60,
      exercises: newWorkout.exercises || [],
      notes: newWorkout.notes || '',
      rating: newWorkout.rating || 4,
    };
    setWorkouts([workout, ...workouts]);
    setShowAdd(false);
    setNewWorkout({ type: 'Push', duration: 60, exercises: [], date: new Date().toISOString().split('T')[0], rating: 4 });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  // Last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const getDayWorkout = (date: string) => workouts.find(w => w.date === date);

  return (
    <section className="workout-log-section" id="workouts" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Physical Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Workout Log
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Dumbbell size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{totalWorkouts}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Workouts</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Activity size={20} style={{ color: '#2ecc71', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{Math.floor(totalMinutes / 60)}h</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Time</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Flame size={20} style={{ color: '#e74c3c', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{currentStreak}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Day Streak</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <Trophy size={20} style={{ color: '#f39c12', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{avgRating.toFixed(1)}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Rating</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} />
          Last 7 Days
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {last7Days.map(date => {
            const workout = getDayWorkout(date);
            const type = workoutTypes.find(t => t.name === workout?.type);
            return (
              <div key={date} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    aspectRatio: '1',
                    background: workout ? type?.color : 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                  }}
                  title={workout ? `${workout.type} - ${workout.duration}min` : 'Rest day'}
                >
                  {workout ? type?.icon : '💤'}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {new Date(date).toLocaleDateString('en-GB', { weekday: 'narrow' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workout Types */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {typeStats.map(type => (
          <div key={type.name} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: type.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {type.icon}
            </div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{type.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{type.count} workouts • {type.minutes}min</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Workouts */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Recent Workouts</h3>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-gold)',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
            }}
          >
            <Plus size={14} />
            Log Workout
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {workouts.slice(0, 5).map(workout => {
            const type = workoutTypes.find(t => t.name === workout.type);
            return (
              <div key={workout.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: type?.color || '#95a5a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  {type?.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{workout.type}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {workout.date} • {workout.duration}min • {workout.exercises.length} exercises
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f39c12' }}>{'★'.repeat(workout.rating)}</span>
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Workout Modal */}
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
            overflow: 'auto',
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
              Log Workout
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={newWorkout.type}
                onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              >
                {workoutTypes.map(t => <option key={t.name} value={t.name}>{t.icon} {t.name}</option>)}
              </select>
              
              <input
                type="number"
                placeholder="Duration (min)"
                value={newWorkout.duration || ''}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <input
              type="date"
              value={newWorkout.date}
              onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
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

            {/* Add Exercise */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Add Exercise</h4>
              
              <input
                type="text"
                placeholder="Exercise name"
                value={newExercise.name || ''}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                }}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Sets"
                  value={newExercise.sets || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={newExercise.reps || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={newExercise.weight || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) })}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
              
              <button
                onClick={addExercise}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Add Exercise
              </button>
            </div>

            {/* Exercise List */}
            {newWorkout.exercises && newWorkout.exercises.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Exercises ({newWorkout.exercises.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {newWorkout.exercises.map((ex, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {ex.name} - {ex.sets}×{ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ''}
                      </span>
                      <button
                        onClick={() => removeExercise(i)}
                        style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <textarea
              placeholder="Notes..."
              value={newWorkout.notes || ''}
              onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                minHeight: '80px',
                resize: 'vertical',
              }}
            />

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setNewWorkout({ ...newWorkout, rating })}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: (newWorkout.rating || 4) >= rating ? '#f39c12' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '4px',
                      color: (newWorkout.rating || 4) >= rating ? 'white' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={addWorkout}
                disabled={!newWorkout.exercises?.length}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: newWorkout.exercises?.length ? 'pointer' : 'not-allowed',
                  opacity: newWorkout.exercises?.length ? 1 : 0.5,
                }}
              >
                Log Workout
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
