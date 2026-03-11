import { useWeather } from '../../hooks/useWeather';
import styles from './WeatherWidget.module.css';

export default function WeatherWidget() {
  const weather = useWeather();

  return (
    <div className={`${styles.widget} weather-widget`}>
      <span className={styles.icon}>{weather.icon}</span>
      <div className={styles.info}>
        <span className={styles.temp}>{weather.temp}</span>
        <span className={styles.location}>Birmingham</span>
      </div>
    </div>
  );
}
