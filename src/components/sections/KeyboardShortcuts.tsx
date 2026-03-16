import { Keyboard, Command, Moon, Plus, Search, HelpCircle } from 'lucide-react';
import styles from './KeyboardShortcuts.module.css';

const shortcuts = [
  { icon: <Plus size={16} />, name: 'Plant Seed', keys: ['Space'] },
  { icon: <Moon size={16} />, name: 'Toggle Theme', keys: ['T'] },
  { icon: <Search size={16} />, name: 'Quick Search', keys: ['Cmd', 'K'] },
  { icon: <Command size={16} />, name: 'Command Palette', keys: ['Cmd', 'Shift', 'P'] },
  { icon: <HelpCircle size={16} />, name: 'Show Help', keys: ['?'] },
  { icon: <Keyboard size={16} />, name: 'Focus Mode', keys: ['F'] },
];

export default function KeyboardShortcuts() {
  return (
    <section className={styles.keyboardShortcuts}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Keyboard className={styles.icon} size={20} />
          Keyboard Shortcuts
        </h2>
      </div>

      <div className={styles.shortcutsGrid}>
        {shortcuts.map((shortcut, index) => (
          <div key={index} className={styles.shortcutCard}>
            <div className={styles.shortcutInfo}>
              <span className={styles.shortcutIcon}>{shortcut.icon}</span>
              <span className={styles.shortcutName}>{shortcut.name}</span>
            </div>
            <div className={styles.shortcutKeys}>
              {shortcut.keys.map((key, keyIndex) => (
                <span key={keyIndex}>
                  <span className={styles.key}>{key}</span>
                  {keyIndex < shortcut.keys.length - 1 && (
                    <span className={styles.keyPlus}>+</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
