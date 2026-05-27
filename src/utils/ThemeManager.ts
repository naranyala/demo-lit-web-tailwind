export type Theme = 'light' | 'dark' | 'system';

class ThemeManager {
  private currentTheme: Theme = 'system';

  constructor() {
    this.init();
  }

  private init() {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    this.applyTheme();
  }

  setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  private applyTheme() {
    const root = window.document.documentElement;
    const isDark = 
      this.currentTheme === 'dark' || 
      (this.currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  listen(callback: (theme: Theme) => void) {
    // Simple event-based system could be added here if needed
    callback(this.currentTheme);
  }
}

export const themeManager = new ThemeManager();
