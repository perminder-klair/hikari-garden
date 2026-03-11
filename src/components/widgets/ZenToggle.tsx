import { useTheme } from '../../contexts/ThemeContext';
import styles from './ZenToggle.module.css';

export default function ZenToggle() {
  const { zenMode, toggleZen } = useTheme();

  const handleClick = () => {
    toggleZen();
    if (!zenMode) {
      document.getElementById('focus')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button className={`${styles.toggle} zen-toggle`} onClick={handleClick} title="Toggle Zen Mode">
      ZEN{zenMode ? ' Exit' : ''}
    </button>
  );
}
