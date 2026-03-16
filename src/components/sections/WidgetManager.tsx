import { useState } from 'react';
import { LayoutGrid, Clock, Cloud, Music, Calculator, Calendar, Timer, DollarSign } from 'lucide-react';
import styles from './WidgetManager.module.css';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const initialWidgets: Widget[] = [
  { id: 'clock', name: 'World Clock', description: 'Multiple timezones', icon: <Clock size={18} />, enabled: true },
  { id: 'weather', name: 'Weather', description: 'Local forecast', icon: <Cloud size={18} />, enabled: true },
  { id: 'music', name: 'Now Playing', description: 'Spotify integration', icon: <Music size={18} />, enabled: false },
  { id: 'calculator', name: 'Calculator', description: 'Quick calculations', icon: <Calculator size={18} />, enabled: false },
  { id: 'calendar', name: 'Mini Calendar', description: 'Month view', icon: <Calendar size={18} />, enabled: true },
  { id: 'timer', name: 'Quick Timer', description: 'Countdown widget', icon: <Timer size={18} />, enabled: false },
  { id: 'currency', name: 'Currency', description: 'Exchange rates', icon: <DollarSign size={18} />, enabled: false },
];

export default function WidgetManager() {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const enabledCount = widgets.filter(w => w.enabled).length;

  return (
    <section className={styles.widgetManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <LayoutGrid className={styles.icon} size={20} />
          Widget Manager
          <span style={{ 
            marginLeft: '0.5rem', 
            fontSize: '0.75rem', 
            color: 'var(--text-secondary)',
            fontFamily: 'Space Mono, monospace'
          }}>
            {enabledCount}/{widgets.length} active
          </span>
        </h2>
      </div>

      <div className={styles.widgetGrid}>
        {widgets.map((widget) => (
          <div 
            key={widget.id}
            className={`${styles.widgetCard} ${!widget.enabled ? styles.widgetCardDisabled : ''}`}
            onClick={() => toggleWidget(widget.id)}
          >
            <div className={styles.widgetIcon}>
              {widget.icon}
            </div>
            <div className={styles.widgetInfo}>
              <div className={styles.widgetName}>{widget.name}</div>
              <div className={styles.widgetDesc}>{widget.description}</div>
            </div>
            <div className={`${styles.toggle} ${widget.enabled ? styles.toggleActive : ''}`}>
              <div className={styles.toggleKnob} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
