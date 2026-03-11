import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  zenMode: boolean;
  toggleZen: () => void;
  bgOverride: string | null;
  setBgOverride: (bg: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [zenMode, setZenMode] = useState(false);
  const [bgOverride, setBgOverride] = useState<string | null>(null);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('light-mode', next === 'light');
      document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
      return next;
    });
  }, []);

  const toggleZen = useCallback(() => {
    setZenMode(prev => {
      const next = !prev;
      document.body.classList.toggle('zen-mode', next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, zenMode, toggleZen, bgOverride, setBgOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
