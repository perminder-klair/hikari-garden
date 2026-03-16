import { useState, useEffect } from 'react';
import { Moon, Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Eye, Navigation } from 'lucide-react';
import { useGarden } from '../../contexts/GardenContext';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog';
  uvIndex: number;
  visibility: number;
  pressure: number;
}

interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: WeatherData['condition'];
  precipitation: number;
}

const mockWeather: WeatherData = {
  temp: 12,
  feelsLike: 10,
  humidity: 72,
  windSpeed: 14,
  condition: 'cloudy',
  uvIndex: 2,
  visibility: 10,
  pressure: 1013,
};

const mockForecast: DailyForecast[] = [
  { day: 'Fri', high: 14, low: 8, condition: 'rain', precipitation: 80 },
  { day: 'Sat', high: 11, low: 6, condition: 'cloudy', precipitation: 20 },
  { day: 'Sun', high: 13, low: 7, condition: 'clear', precipitation: 0 },
  { day: 'Mon', high: 15, low: 9, condition: 'clear', precipitation: 10 },
  { day: 'Tue', high: 12, low: 8, condition: 'rain', precipitation: 60 },
];

const conditionIcons = {
  clear: <Sun size={48} color="#f39c12" />,
  cloudy: <Cloud size={48} color="#95a5a6" />,
  rain: <CloudRain size={48} color="#3498db" />,
  snow: <span style={{ fontSize: '2rem' }}>❄️</span>,
  fog: <Eye size={48} color="#7f8c8d" />,
};

const conditionLabels = {
  clear: 'Clear Sky',
  cloudy: 'Cloudy',
  rain: 'Rainy',
  snow: 'Snow',
  fog: 'Foggy',
};

export default function WeatherStation() {
  const [weather] = useState<WeatherData>(mockWeather);
  const [forecast] = useState<DailyForecast[]>(mockForecast);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const { revealRef } = useGarden();

  useEffect(() => {
    revealRef.current?.('.weather-station-section');
  }, [revealRef]);

  const convertTemp = (c: number) => unit === 'C' ? c : Math.round(c * 9/5 + 32);

  return (
    <section className="weather-station-section" id="weather" style={{ marginBottom: '8rem', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-amber)', display: 'block', marginBottom: '1rem' }}>
          Local Conditions
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
          Weather Station
        </h2>
      </div>

      {/* Main Weather Card */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '4rem', fontWeight: 300, color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>
                {convertTemp(weather.temp)}°
              </span>
              <button
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {unit}
              </button>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>Feels like {convertTemp(weather.feelsLike)}°</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {conditionIcons[weather.condition]}
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{conditionLabels[weather.condition]}</p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <Droplets size={20} style={{ color: '#3498db', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{weather.humidity}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Humidity</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <Wind size={20} style={{ color: '#95a5a6', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{weather.windSpeed}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>km/h</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <Sun size={20} style={{ color: '#f39c12', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{weather.uvIndex}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UV Index</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <Eye size={20} style={{ color: '#9b59b6', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'Cormorant Garamond, serif' }}>{weather.visibility}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>km visibility</div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation size={16} />
          5-Day Forecast
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {forecast.map((day, i) => (
            <div
              key={day.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: i === 0 ? 'rgba(244, 208, 63, 0.05)' : 'transparent',
                borderRadius: '8px',
                border: i === 0 ? '1px solid rgba(244, 208, 63, 0.2)' : '1px solid transparent',
              }}
            >
              <div style={{ width: '50px', fontWeight: 500, color: 'var(--text-primary)' }}>{day.day}</div>
              
              <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                {conditionIcons[day.condition]}
              </div>
              
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ height: '6px', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '3px', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: `${((day.low - 0) / 20) * 100}%`,
                      right: `${100 - ((day.high - 0) / 20) * 100}%`,
                      height: '100%',
                      background: day.condition === 'rain' ? '#3498db' : day.condition === 'clear' ? '#f39c12' : '#95a5a6',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
              
              <div style={{ width: '80px', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{convertTemp(day.low)}°</span>
                {' '}
                <span style={{ color: 'var(--text-primary)' }}>{convertTemp(day.high)}°</span>
              </div>
              
              {day.precipitation > 0 && (
                <div style={{ width: '50px', textAlign: 'right', fontSize: '0.75rem', color: '#3498db' }}>
                  {day.precipitation}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
