// hooks/useCurrentTheme.js
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function useCurrentTheme() {
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    if (theme === 'system') {
      setCurrentTheme(systemTheme ?? 'light');
    } else {
      setCurrentTheme(theme ?? 'light');
    }
  }, [theme, systemTheme]);

  return currentTheme;
}