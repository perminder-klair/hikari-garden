import { useTheme } from '../../contexts/ThemeContext';
import styles from './MoodToggle.module.css';

export default function MoodToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggle} onClick={toggleTheme} title="Toggle light/dark mode">
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
