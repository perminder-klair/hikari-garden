import { useState, useEffect } from 'react';

interface WeatherData {
  temp: string;
  icon: string;
}

const iconMap: Record<number, string> = {
  0: '☀', 1: '🌤', 2: '⛅', 3: '☁',
  45: '🌫', 48: '🌫', 51: '🌦', 53: '🌧',
  55: '🌧', 61: '🌧', 63: '🌧', 65: '🌧',
  71: '🌨', 73: '🌨', 75: '🌨', 95: '⛈',
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({ temp: '--°C', icon: '☁' });

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=52.5862&longitude=-2.0577&current_weather=true'
        );
        const data = await res.json();
        if (cancelled) return;
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        setWeather({ temp: `${temp}°C`, icon: iconMap[code] || '☁' });
      } catch {
        if (!cancelled) setWeather({ temp: '--°C', icon: '☁' });
      }
    }

    fetchWeather();
    const id = setInterval(fetchWeather, 600000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return weather;
}
