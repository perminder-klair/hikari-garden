import { useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import styles from './ThemeCustomizer.module.css';

const accentColors = [
  { name: 'Amber', value: '#f4d03f' },
  { name: 'Coral', value: '#ff6b6b' },
  { name: 'Teal', value: '#4ecdc4' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Blue', value: '#3498db' },
];

const fontOptions = [
  { name: 'Space Mono', value: 'Space Mono' },
  { name: 'Inter', value: 'Inter' },
  { name: 'System', value: 'system-ui' },
];

const densityOptions = [
  { name: 'Compact', desc: 'Tighter spacing', value: 'compact' },
  { name: 'Default', desc: 'Balanced spacing', value: 'default' },
  { name: 'Comfortable', desc: 'More breathing room', value: 'comfortable' },
];

export default function ThemeCustomizer() {
  const [activeColor, setActiveColor] = useState('#f4d03f');
  const [activeFont, setActiveFont] = useState('Space Mono');
  const [activeDensity, setActiveDensity] = useState('default');

  const resetTheme = () => {
    setActiveColor('#f4d03f');
    setActiveFont('Space Mono');
    setActiveDensity('default');
  };

  return (
    <section className={styles.themeCustomizer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Palette className={styles.icon} size={20} />
          Theme Customizer
        </h2>
        <button className={styles.resetBtn} onClick={resetTheme}>
          <RotateCcw size={14} style={{ marginRight: '0.25rem' }} />
          Reset
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Accent Color</div>
        <div className={styles.colorGrid}>
          {accentColors.map((color) => (
            <div
              key={color.value}
              className={`${styles.colorOption} ${activeColor === color.value ? styles.colorOptionActive : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setActiveColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Font Family</div>
        <div className={styles.fontOptions}>
          {fontOptions.map((font) => (
            <button
              key={font.value}
              className={`${styles.fontOption} ${activeFont === font.value ? styles.fontOptionActive : ''}`}
              onClick={() => setActiveFont(font.value)}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Spacing Density</div>
        <div className={styles.densityOptions}>
          {densityOptions.map((density) => (
            <button
              key={density.value}
              className={`${styles.densityOption} ${activeDensity === density.value ? styles.densityOptionActive : ''}`}
              onClick={() => setActiveDensity(density.value)}
            >
              <div className={styles.densityLabel}>{density.name}</div>
              <div className={styles.densityDesc}>{density.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewTitle}>Preview</div>
        <div className={styles.previewContent}>
          <div className={styles.previewCard}>
            <div className={styles.previewText} style={{ color: activeColor }}>
              Sample Heading
            </div>
            <div className={styles.previewSubtext}>
              This is how your garden will look
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
