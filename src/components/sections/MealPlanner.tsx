import { useState, useEffect } from 'react';
import { Utensils, Plus, Calendar, Clock, Users, Trash2, ChefHat, ShoppingCart } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  prepTime: number;
  servings: number;
  ingredients: string[];
  tags: string[];
}

interface DayPlan {
  date: string;
  meals: { [key: string]: string }; // mealType -> mealId
}

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: '#f39c12' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', color: '#2ecc71' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', color: '#9b59b6' },
  { id: 'snack', label: 'Snack', icon: '🍿', color: '#e74c3c' },
];

const initialMeals: Meal[] = [
  { id: '1', name: 'Avocado Toast', type: 'breakfast', calories: 350, prepTime: 10, servings: 1, ingredients: ['bread', 'avocado', 'eggs', 'chili flakes'], tags: ['vegetarian', 'quick'] },
  { id: '2', name: 'Chicken Curry', type: 'dinner', calories: 550, prepTime: 45, servings: 4, ingredients: ['chicken', 'onion', 'tomatoes', 'spices', 'rice'], tags: ['indian', 'spicy'] },
  { id: '3', name: 'Greek Salad', type: 'lunch', calories: 280, prepTime: 15, servings: 2, ingredients: ['cucumber', 'tomatoes', 'feta', 'olives', 'olive oil'], tags: ['vegetarian', 'mediterranean'] },
  { id: '4', name: 'Smoothie Bowl', type: 'breakfast', calories: 400, prepTime: 10, servings: 1, ingredients: ['banana', 'berries', 'yogurt', 'granola'], tags: ['healthy', 'quick'] },
  { id: '5', name: 'Stir Fry Noodles', type: 'dinner', calories: 480, prepTime: 30, servings: 2, ingredients: ['noodles', 'vegetables', 'soy sauce', 'garlic', 'ginger'], tags: ['asian', 'vegetarian'] },
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPlanner() {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [weekPlan, setWeekPlan] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    type: 'dinner',
    calories: 400,
    prepTime: 30,
    servings: 2,
    ingredients: [],
    tags: [],
  });
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.meal-planner-section');
  }, [revealRef]);

  const getMealForSlot = (dayIndex: number, mealType: string) => {
    const dayKey = daysOfWeek[dayIndex];
    const mealId = weekPlan[dayKey]?.[mealType];
    return meals.find(m => m.id === mealId);
  };

  const assignMeal = (dayIndex: number, mealType: string, mealId: string) => {
    const dayKey = daysOfWeek[dayIndex];
    setWeekPlan(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [mealType]: mealId }
    }));
  };

  const removeMeal = (dayIndex: number, mealType: string) => {
    const dayKey = daysOfWeek[dayIndex];
    setWeekPlan(prev => {
      const updated = { ...prev[dayKey] };
      delete updated[mealType];
      return { ...prev, [dayKey]: updated };
    });
  };

  const getShoppingList = () => {
    const ingredients: { [key: string]: number } = {};
    
    Object.entries(weekPlan).forEach(([day, dayMeals]) => {
      Object.values(dayMeals).forEach(mealId => {
        const meal = meals.find(m => m.id === mealId);
        if (meal) {
          meal.ingredients.forEach(ing => {
            ingredients[ing] = (ingredients[ing] || 0) + 1;
          });
        }
      });
    });
    
    return Object.entries(ingredients).sort((a, b) => b[1] - a[1]);
  };

  const addMeal = () => {
    if (!newMeal.name) return;
    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      type: newMeal.type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      calories: newMeal.calories || 400,
      prepTime: newMeal.prepTime || 30,
      servings: newMeal.servings || 2,
      ingredients: newMeal.ingredients || [],
      tags: newMeal.tags || [],
    };
    setMeals([...meals, meal]);
    setShowAddMeal(false);
    setNewMeal({ type: 'dinner', calories: 400, prepTime: 30, servings: 2, ingredients: [], tags: [] });
  };

  const getDayStats = (dayIndex: number) => {
    const dayKey = daysOfWeek[dayIndex];
    const dayMeals = weekPlan[dayKey] || {};
    let totalCalories = 0;
    let totalPrepTime = 0;
    
    Object.values(dayMeals).forEach(mealId => {
      const meal = meals.find(m => m.id === mealId);
      if (meal) {
        totalCalories += meal.calories;
        totalPrepTime += meal.prepTime;
      }
    });
    
    return { totalCalories, totalPrepTime, mealCount: Object.keys(dayMeals).length };
  };

  return (
    <section className="meal-planner-section" id="meals" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Culinary Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Meal Planner
        </h2>
      </div>

      {/* Day Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {daysOfWeek.map((day, i) => {
          const stats = getDayStats(i);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: '1rem',
                background: selectedDay === i ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                border: 'none',
                borderRadius: '8px',
                color: selectedDay === i ? 'var(--bg-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                minWidth: '80px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{day}</div>
              <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', opacity: 0.7 }}>
                {stats.mealCount} meals
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {(() => {
          const stats = getDayStats(selectedDay);
          return (
            <>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#f39c12', fontFamily: 'Cormorant Garamond, serif' }}>{stats.totalCalories}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Calories</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#3498db', fontFamily: 'Cormorant Garamond, serif' }}>{stats.totalPrepTime}m</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prep Time</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.mealCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meals</div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Meal Slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {mealTypes.map(mealType => {
          const assignedMeal = getMealForSlot(selectedDay, mealType.id);
          return (
            <div key={mealType.id} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{mealType.icon}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{mealType.label}</span>
                {assignedMeal && (
                  <button
                    onClick={() => removeMeal(selectedDay, mealType.id)}
                    style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {assignedMeal ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <ChefHat size={24} color={mealType.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{assignedMeal.name}</div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{assignedMeal.calories} cal</span>
                      <span>{assignedMeal.prepTime} min</span>
                      <span>{assignedMeal.servings} servings</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {meals.filter(m => m.type === mealType.id).map(meal => (
                    <button
                      key={meal.id}
                      onClick={() => assignMeal(selectedDay, mealType.id, meal.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      {meal.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAddMeal(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px dashed rgba(244, 208, 63, 0.5)',
                      borderRadius: '20px',
                      color: 'var(--accent-gold)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Plus size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    New
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setShowShoppingList(true)}
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
          <ShoppingCart size={16} />
          Shopping List
        </button>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
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
          onClick={() => setShowAddMeal(false)}
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
              Add New Meal
            </h3>

            <input
              type="text"
              placeholder="Meal name"
              value={newMeal.name || ''}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
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
              value={newMeal.type}
              onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value as any })}
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
              {mealTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories || ''}
                onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <input
                type="number"
                placeholder="Minutes"
                value={newMeal.prepTime || ''}
                onChange={(e) => setNewMeal({ ...newMeal, prepTime: parseInt(e.target.value) })}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <input
                type="number"
                placeholder="Servings"
                value={newMeal.servings || ''}
                onChange={(e) => setNewMeal({ ...newMeal, servings: parseInt(e.target.value) })}
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
              type="text"
              placeholder="Ingredients (comma separated)"
              value={newMeal.ingredients?.join(', ') || ''}
              onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value.split(',').map(i => i.trim()).filter(Boolean) })}
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
                onClick={addMeal}
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
                Add Meal
              </button>
              <button
                onClick={() => setShowAddMeal(false)}
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

      {/* Shopping List Modal */}
      {showShoppingList && (
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
          onClick={() => setShowShoppingList(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(244, 208, 63, 0.2)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '70vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={20} />
              Shopping List
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {getShoppingList().length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No meals planned yet</p>
              ) : (
                getShoppingList().map(([ingredient, count]) => (
                  <div key={ingredient} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{ingredient}</span>
                    <span style={{ color: 'var(--accent-gold)' }}>×{count}</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowShoppingList(false)}
              style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
