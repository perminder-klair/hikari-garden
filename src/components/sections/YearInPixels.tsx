import { useState, useEffect } from 'react';
import { Calendar, Smile, Meh, Frown, Sun, CloudRain } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface DayData {
  date: string;
  mood: number; // 1-5
  note?: string;
}

const moodColors = [
  '#2c3e50', // empty
  '#e74c3c', // terrible
  '#e67e22', // bad
  '#f4d03f', // neutral
  '#2ecc71', // good
  '#9b59b6', // excellent
];

const moodLabels = ['', 'Terrible', 'Bad', 'Neutral', 'Good', 'Excellent'];
const moodIcons = [null, Frown, Frown, Meh, Smile, Sun];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function YearInPixels() {
  const [yearData, setYearData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.year-pixels-section');
    
    // Generate sample data for the current year
    const data: DayData[] = [];
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startOfYear);
      date.setDate(date.getDate() + i);
      
      // Generate random mood data up to today
      const isPast = date <= today;
      const mood = isPast ? Math.floor(Math.random() * 5) + 1 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        mood,
        note: mood > 0 ? `Day ${i + 1} of the year` : undefined,
      });
    }
    
    setYearData(data);
  }, [revealRef]);

  const getDayPosition = (index: number) => {
    const week = Math.floor(index / 7);
    const day = index % 7;
    return { week, day };
  };

  const getStats = () => {
    const filled = yearData.filter(d => d.mood > 0);
    if (filled.length === 0) return { average: 0, best: 0, worst: 0, total: 0 };
    
    const moods = filled.map(d => d.mood);
    const average = moods.reduce((a, b) => a + b, 0) / moods.length;
    
    return {
      average: average.toFixed(1),
      best: Math.max(...moods),
      worst: Math.min(...moods),
      total: filled.length,
    };
  };

  const stats = getStats();

  return (
    <section className="year-pixels-section" id="year-pixels" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Mood Tracker
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Year in Pixels
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.average}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Mood</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontFamily: 'Cormorant Garamond, serif' }}>{stats.best}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontFamily: 'Cormorant Garamond, serif' }}>{stats.worst}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Worst</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{stats.total}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Days Tracked</span>
        </div>
      </div>

      {/* Pixel Grid */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '2rem',
        overflowX: 'auto',
      }}>
        {/* Month Labels */}
        <div style={{ display: 'flex', marginBottom: '0.5rem', marginLeft: '2rem' }}>
          {months.map((month, i) => (
            <div key={month} style={{ 
              flex: 1, 
              textAlign: 'left', 
              fontSize: '0.65rem', 
              color: 'var(--text-muted)',
              minWidth: '20px'
            }}>
              {month}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {/* Day Labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '0.5rem' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} style={{ 
                width: '12px', 
                height: '12px', 
                fontSize: '0.6rem', 
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {i % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Pixels */}
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', maxWidth: 'calc(100% - 20px)' }}>
            {yearData.map((day, index) => {
              const { week } = getDayPosition(index);
              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    width: '12px',
                    height: '12px',
                    background: moodColors[day.mood],
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    transform: hoveredDay?.date === day.date ? 'scale(1.5)' : 'scale(1)',
                    zIndex: hoveredDay?.date === day.date ? 10 : 1,
                  }}
                  title={`${day.date}: ${moodLabels[day.mood] || 'Not tracked'}`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {moodLabels.map((label, i) => {
            if (!label) return null;
            const Icon = moodIcons[i];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '12px', height: '12px', background: moodColors[i], borderRadius: '2px' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDay && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: `${moodColors[selectedDay.mood]}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {(() => {
              const Icon = moodIcons[selectedDay.mood];
              return Icon ? <Icon size={24} style={{ color: moodColors[selectedDay.mood] }} /> : <CloudRain size={24} style={{ color: 'var(--text-muted)' }} />;
            })()}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {selectedDay.date}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {moodLabels[selectedDay.mood] || 'Not tracked'}
            </div>
          </div>
          <button 
            onClick={() => setSelectedDay(null)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
