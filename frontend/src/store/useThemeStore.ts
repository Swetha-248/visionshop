import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleTheme: () => set((state) => {
    const newDark = !state.isDark;
    if (newDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    return { isDark: newDark };
  }),
}));
