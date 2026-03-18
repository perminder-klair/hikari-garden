import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Thermometer, Plus } from 'lucide-react';
import styles from './CloudGazer.module.css';

interface CloudObservation {
  id: string;
  date: string;
  type: string;
  description: string;
  weather: {
    temp: string;
    wind: string;
  };
}

const CLOUD_TYPES = [
  { id: 'cumulus', name: 'Cumulus', emoji: '☁️', desc: 'Puffy, cotton-like' },
  { id: 'stratus', name: 'Stratus', emoji: '☁️', desc: 'Flat, gray layer' },
  { id: 'cirrus', name: 'Cirrus', emoji: '☁️', desc: 'Wispy, high altitude' },
  { id: 'cumulonimbus', name: 'Cumulonimbus', emoji: '⛈️', desc: 'Thunderstorm clouds' },
  { id: 'altocumulus', name: 'Altocumulus', emoji: '☁️', desc: 'Mid-level patches' },
  { id: 'nimbostratus', name: 'Nimbostratus', emoji: '🌧️', desc: 'Rain clouds' },
];

const CLOUD_EMOJIS = ['☁️', '⛅', '☁️', '🌤️', '☁️'];

const CloudGazer: React.FC = () => {
  const [observations, setObservations] = useState<CloudObservation[]>(() => {
    const saved = localStorage.getItem('cloudGazer_observations');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [temp, setTemp] = useState('');
  const [wind, setWind] = useState('');

  useEffect(() => {
    localStorage.setItem('cloudGazer_observations', JSON.stringify(observations));
  }, [observations]);

  const handleSubmit = () => {
    if (!selectedType || !description.trim()) return;

    const newObservation: CloudObservation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: selectedType,
      description: description.trim(),
      weather: {
        temp: temp || 'Unknown',
        wind: wind || 'Unknown',
      },
    };

    setObservations(prev => [newObservation, ...prev].slice(0, 20));
    setSelectedType('');
    setDescription('');
    setTemp('');
    setWind('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCloudEmoji = (typeId: string) => {
    const cloud = CLOUD_TYPES.find(c => c.id === typeId);
    return cloud?.emoji || '☁️';
  };

  const getCloudName = (typeId: string) => {
    const cloud = CLOUD_TYPES.find(c => c.id === typeId);
    return cloud?.name || typeId;
  };

  return (
    <div className={styles.cloudGazer}>
      <div className={styles.header}>
        <Cloud className={styles.icon} size={28} />
        <div>
          <h2 className={styles.title}>Cloud Gazer</h2>
          <p className={styles.subtitle}>Sky watching &amp; cloud observation journal</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.skyCanvas}>
          <div className={styles.sun}>☀️</div>
          {CLOUD_EMOJIS.map((emoji, i) => (
            <span key={i} className={styles.cloud}>{emoji}</span>
          ))}
        </div>

        <div className={styles.observationCard}>
          <h3 className={styles.observationTitle}>
            <Plus size={18} />
            New Observation
          </h3>

          <div className={styles.cloudTypes}>
            {CLOUD_TYPES.map(cloud => (
              <button
                key={cloud.id}
                className={`${styles.cloudType} ${selectedType === cloud.id ? styles.active : ''}`}
                onClick={() => setSelectedType(cloud.id)}
                title={cloud.desc}
              >
                {cloud.emoji} {cloud.name}
              </button>
            ))}
          </div>

          <div className={styles.weatherInfo}>
            <div className={styles.weatherItem}>
              <Thermometer size={16} />
              <input
                type="text"
                placeholder="Temp (°C)"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                style={{ width: '80px', padding: '0.25rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
            </div>
            <div className={styles.weatherItem}>
              <Wind size={16} />
              <input
                type="text"
                placeholder="Wind"
                value={wind}
                onChange={(e) => setWind(e.target.value)}
                style={{ width: '100px', padding: '0.25rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              />
            </div>
          </div>

          <textarea
            className={styles.textArea}
            placeholder="What do you see? Describe the shapes, colors, movement..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSubmit}
            disabled={!selectedType || !description.trim()}
          >
            <Cloud size={18} />
            Log Observation
          </button>
        </div>

        <div className={styles.historyCard}>
          <h3 className={styles.historyTitle}>Sky Journal</h3>
          {observations.length === 0 ? (
            <div className={styles.emptyState}>
              No observations yet. Look up and start watching! ☁️
            </div>
          ) : (
            <div className={styles.observationList}>
              {observations.map(obs => (
                <div key={obs.id} className={styles.observationItem}>
                  <span className={styles.observationIcon}>{getCloudEmoji(obs.type)}</span>
                  <div className={styles.observationContent}>
                    <div className={styles.observationHeader}>
                      <span className={styles.observationDate}>{formatDate(obs.date)}</span>
                      <span className={styles.observationType}>{getCloudName(obs.type)}</span>
                    </div>
                    <p className={styles.observationText}>{obs.description}</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096' }}>
                      🌡️ {obs.weather.temp} • 💨 {obs.weather.wind}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudGazer;
