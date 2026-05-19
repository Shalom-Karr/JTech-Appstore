import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

/** Thumb-reachable bottom tab bar, shown only on small screens. */
@Component({
  selector: 'jt-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-line flex"
      aria-label="Primary"
    >
      @for (t of tabs; track t.path) {
        <a
          [routerLink]="t.path"
          [routerLinkActiveOptions]="{ exact: t.path === '/' }"
          routerLinkActive="text-brand"
          class="flex-1 flex flex-col items-center gap-0.5 py-2 text-muted text-[11px] font-medium"
        >
          <span class="text-lg leading-none">{{ t.icon }}</span>
          {{ t.label }}
        </a>
      }
    </nav>
  `,
})
export class MobileNavComponent {
  private auth = inject(AuthService);

  get tabs() {
    return [
      { path: '/', icon: '🏠', label: 'Home' },
      { path: '/browse', icon: '🔍', label: 'Browse' },
      { path: '/submit', icon: '➕', label: 'Submit' },
      { path: '/library', icon: '📚', label: 'Library' },
      {
        path: this.auth.isLoggedIn() ? '/profile' : '/login',
        icon: '👤',
        label: this.auth.isLoggedIn() ? 'Profile' : 'Log in',
      },
    ];
  }
}
