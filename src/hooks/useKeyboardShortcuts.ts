import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function useKeyboardShortcuts(onSpacePress?: () => void) {
  const { toggleTheme, zenMode, toggleZen } = useTheme();
  const konamiIndex = useRef(0);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const onKonami = useRef<(() => void) | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Theme toggle
      if ((e.key === 't' || e.key === 'T') && e.target === document.body) {
        toggleTheme();
      }

      // Space — plant seed (only when not in zen mode, otherwise timer handled elsewhere)
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        onSpacePress?.();
      }

      // Escape — exit zen
      if (e.key === 'Escape' && zenMode) {
        toggleZen();
      }

      // Konami code
      if (e.key === konamiCode[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === konamiCode.length) {
          onKonami.current?.();
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, zenMode, toggleZen, onSpacePress]);

  return { setKonamiHandler: (fn: () => void) => { onKonami.current = fn; } };
}
