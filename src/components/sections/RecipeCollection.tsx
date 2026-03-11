import { useState } from 'react';
import { ChefHat, Clock, Users, Flame, Leaf, Heart } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  time: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  description: string;
  favorite: boolean;
}

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Miso Ramen',
    cuisine: 'Japanese',
    time: '45 min',
    servings: 2,
    difficulty: 'medium',
    tags: ['vegetarian', 'comfort', 'soup'],
    description: 'Rich umami broth with silky noodles, soft-boiled egg, and fresh scallions.',
    favorite: true,
  },
  {
    id: '2',
    name: 'Palak Paneer',
    cuisine: 'Indian',
    time: '35 min',
    servings: 4,
    difficulty: 'medium',
    tags: ['vegetarian', 'spicy', 'protein'],
    description: 'Creamy spinach curry with homemade paneer cubes and aromatic spices.',
    favorite: true,
  },
  {
    id: '3',
    name: 'Matcha Latte',
    cuisine: 'Japanese',
    time: '10 min',
    servings: 1,
    difficulty: 'easy',
    tags: ['drink', 'caffeine', 'ceremonial'],
    description: 'Whisked ceremonial grade matcha with frothy oat milk and a touch of honey.',
    favorite: false,
  },
  {
    id: '4',
    name: 'Chana Masala',
    cuisine: 'Indian',
    time: '40 min',
    servings: 4,
    difficulty: 'easy',
    tags: ['vegan', 'spicy', 'hearty'],
    description: 'Tangy chickpea curry with tomatoes, onions, and warming spices.',
    favorite: true,
  },
  {
    id: '5',
    name: 'Onigiri',
    cuisine: 'Japanese',
    time: '25 min',
    servings: 3,
    difficulty: 'easy',
    tags: ['snack', 'portable', 'rice'],
    description: 'Hand-formed rice triangles with umeboshi filling, wrapped in nori.',
    favorite: false,
  },
  {
    id: '6',
    name: 'Vegetable Biryani',
    cuisine: 'Indian',
    time: '60 min',
    servings: 6,
    difficulty: 'hard',
    tags: ['vegetarian', 'festive', 'rice'],
    description: 'Layered aromatic rice with spiced vegetables, saffron, and fried onions.',
    favorite: true,
  },
];

const difficultyColors = {
  easy: '#2ecc71',
  medium: '#f4d03f',
  hard: '#e74c3c',
};

export default function RecipeCollection() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set(recipes.filter(r => r.favorite).map(r => r.id)));
  const [filter, setFilter] = useState<'all' | 'favorites' | 'japanese' | 'indian'>('all');

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'favorites') return favorites.has(recipe.id);
    if (filter === 'japanese') return recipe.cuisine === 'Japanese';
    if (filter === 'indian') return recipe.cuisine === 'Indian';
    return true;
  });

  return (
    <section className="recipe-section" id="recipes" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Culinary Garden
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Recipe Collection
        </h2>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {(['all', 'favorites', 'japanese', 'indian'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem',
              background: filter === f ? 'var(--accent-gold)' : 'transparent',
              border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Recipe Header */}
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ChefHat size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {recipe.cuisine}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                  {recipe.name}
                </h3>
              </div>
              <button
                onClick={() => toggleFavorite(recipe.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <Heart 
                  size={18} 
                  fill={favorites.has(recipe.id) ? 'var(--accent-gold)' : 'transparent'}
                  color={favorites.has(recipe.id) ? 'var(--accent-gold)' : 'var(--text-muted)'}
                />
              </button>
            </div>

            {/* Recipe Body */}
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {recipe.description}
              </p>

              {/* Meta Info */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recipe.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Users size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recipe.servings}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Flame size={14} style={{ color: difficultyColors[recipe.difficulty] }} />
                  <span style={{ fontSize: '0.75rem', color: difficultyColors[recipe.difficulty], textTransform: 'capitalize' }}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {recipe.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '4px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Leaf size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
