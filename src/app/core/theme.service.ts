import { Injectable, effect, signal } from '@angular/core';

const KEY = 'jtech-appstore-theme';
export type Theme = 'light' | 'dark';

/**
 * Light/dark theme toggle. The app is light by default; switching to dark
 * adds a `.dark` class to <html>, which re-points the CSS theme variables
 * (see styles.css). The choice is persisted to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    effect(() => {
      const dark = this.theme() === 'dark';
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(KEY, this.theme());
    });
  }

  private initial(): Theme {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}
