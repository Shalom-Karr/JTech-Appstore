import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { StoreService } from '../core/store.service';
import { ThemeService } from '../core/theme.service';

/** Responsive top navigation — search, submit, library, notifications, account. */
@Component({
  selector: 'jt-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-surface border-b border-line sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center gap-2 sm:gap-3">
        <!-- logo -->
        <a routerLink="/" class="flex items-center gap-2 shrink-0">
          <img src="jtech-mark.png" alt="JTech" class="w-9 h-9 rounded-lg" />
          <span class="font-display font-extrabold text-lg sm:text-xl leading-none hidden xs:block">
            JTech<span class="text-brand">AppStore</span>
          </span>
        </a>

        <!-- search (desktop) -->
        <form
          class="flex-1 max-w-xl hidden md:flex items-center bg-paper border border-line rounded-lg px-3"
          (submit)="search($event)"
        >
          <span class="text-muted">🔍</span>
          <input
            name="q"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            placeholder="Search apps…"
            class="flex-1 bg-transparent px-2 py-2 outline-none text-sm text-ink"
            aria-label="Search apps"
          />
        </form>

        <div class="flex-1 md:hidden"></div>

        <!-- desktop nav -->
        <nav class="hidden md:flex items-center gap-1 shrink-0">
          <button
            (click)="theme.toggle()"
            class="p-2 rounded-lg hover:bg-surface-2 text-xl"
            [title]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            aria-label="Toggle theme"
          >
            {{ theme.theme() === 'dark' ? '☀️' : '🌙' }}
          </button>
          @if (user()) {
            <button
              (click)="notifOpen.set(!notifOpen()); menuOpen.set(false)"
              class="p-2 rounded-lg hover:bg-surface-2 text-xl relative"
              title="Notifications"
              aria-label="Notifications"
            >
              🔔
              @if (notifs().length) {
                <span class="absolute -top-0.5 -right-0.5 bg-bad text-on-brand text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{{ notifs().length }}</span>
              }
            </button>
          }
          <a routerLink="/submit" class="jt-btn jt-btn-gold">+ Submit app</a>
          <a routerLink="/browse" routerLinkActive="text-brand" class="p-2 rounded-lg hover:bg-surface-2 text-sm font-medium">Browse</a>
          <a routerLink="/library" routerLinkActive="text-brand" class="p-2 rounded-lg hover:bg-surface-2 text-xl" title="My library">📚</a>
          @if (user(); as u) {
            <div class="relative">
              <button (click)="menuOpen.set(!menuOpen()); notifOpen.set(false)" class="flex items-center gap-1 p-1 rounded-lg hover:bg-surface-2 relative" aria-label="Account menu">
                <img [src]="u.avatarUrl" alt="" class="w-8 h-8 rounded-full object-cover border border-line" />
                @if (u.role === 'admin' && pending() > 0) {
                  <span class="absolute -top-0.5 -right-0.5 bg-bad text-on-brand text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{{ pending() }}</span>
                }
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 mt-1 w-56 jt-card shadow-xl py-1 text-sm" (mouseleave)="menuOpen.set(false)">
                  <div class="px-3 py-2 border-b border-line">
                    <div class="font-semibold">{{ u.fullName }}</div>
                    <div class="text-muted text-xs">&commat;{{ u.username }}</div>
                  </div>
                  <a routerLink="/profile" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-surface-2">My profile &amp; apps</a>
                  <a routerLink="/library" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-surface-2">My library</a>
                  <a routerLink="/submit" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-surface-2">Submit an app</a>
                  <a routerLink="/about" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-surface-2">About</a>
                  @if (u.role === 'admin') {
                    <a routerLink="/admin" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-surface-2 text-brand font-medium">
                      Admin review @if (pending() > 0) { <span class="text-bad">({{ pending() }})</span> }
                    </a>
                  }
                  <button (click)="logout()" class="w-full text-left px-3 py-2 hover:bg-surface-2 text-bad border-t border-line">Log out</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="jt-btn jt-btn-ghost ml-1">Log in</a>
          }
        </nav>

        <!-- mobile actions -->
        <div class="flex md:hidden items-center gap-1 shrink-0">
          @if (user()) {
            <button
              (click)="notifOpen.set(!notifOpen()); mobileOpen.set(false)"
              class="p-2 rounded-lg hover:bg-surface-2 text-xl relative"
              aria-label="Notifications"
            >
              🔔
              @if (notifs().length) {
                <span class="absolute -top-0.5 -right-0.5 bg-bad text-on-brand text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{{ notifs().length }}</span>
              }
            </button>
          }
          <a routerLink="/library" class="p-2 rounded-lg hover:bg-surface-2 text-xl" title="My library">📚</a>
          <button (click)="mobileOpen.set(!mobileOpen())" class="p-2 rounded-lg hover:bg-surface-2" aria-label="Menu">
            <span class="text-2xl leading-none">{{ mobileOpen() ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>

      <!-- search (mobile) -->
      <div class="md:hidden px-3 pb-3">
        <form class="flex items-center bg-paper border border-line rounded-lg px-3" (submit)="search($event)">
          <span class="text-muted">🔍</span>
          <input
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            placeholder="Search apps…"
            class="flex-1 bg-transparent px-2 py-2 outline-none text-sm text-ink"
            aria-label="Search apps"
          />
        </form>
      </div>

      <!-- notifications dropdown -->
      @if (notifOpen() && user()) {
        <div class="absolute right-2 sm:right-4 top-16 w-80 max-w-[calc(100vw-1rem)] jt-card shadow-xl z-50 overflow-hidden">
          <div class="px-3 py-2 border-b border-line font-semibold text-sm flex items-center justify-between">
            <span>Notifications</span>
            <button (click)="notifOpen.set(false)" class="text-muted hover:text-ink" aria-label="Close">✕</button>
          </div>
          @if (notifs().length) {
            <div class="max-h-96 overflow-y-auto">
              @for (n of notifs(); track $index) {
                <a
                  [routerLink]="n.link"
                  (click)="notifOpen.set(false)"
                  class="flex items-start gap-2 px-3 py-2.5 hover:bg-surface-2 border-b border-line last:border-0 text-sm"
                >
                  <span class="text-lg leading-none">{{ n.icon }}</span>
                  <span class="grow">{{ n.text }}</span>
                </a>
              }
            </div>
          } @else {
            <div class="px-3 py-8 text-center text-muted text-sm">You're all caught up 🎉</div>
          }
        </div>
      }

      <!-- mobile menu -->
      @if (mobileOpen()) {
        <nav class="md:hidden border-t border-line bg-surface px-3 py-2 flex flex-col text-sm">
          @if (user(); as u) {
            <div class="flex items-center gap-2 px-2 py-2 border-b border-line mb-1">
              <img [src]="u.avatarUrl" alt="" class="w-9 h-9 rounded-full object-cover border border-line" />
              <div>
                <div class="font-semibold">{{ u.fullName }}</div>
                <div class="text-muted text-xs">&commat;{{ u.username }}</div>
              </div>
            </div>
          }
          <a routerLink="/browse" class="px-2 py-2.5 rounded-lg hover:bg-surface-2">🔎 Browse apps</a>
          <a routerLink="/submit" class="px-2 py-2.5 rounded-lg hover:bg-surface-2">➕ Submit an app</a>
          <a routerLink="/library" class="px-2 py-2.5 rounded-lg hover:bg-surface-2">📚 My library</a>
          <a routerLink="/about" class="px-2 py-2.5 rounded-lg hover:bg-surface-2">📘 About</a>
          <button (click)="theme.toggle()" class="text-left px-2 py-2.5 rounded-lg hover:bg-surface-2">
            {{ theme.theme() === 'dark' ? '☀️ Light mode' : '🌙 Dark mode' }}
          </button>
          @if (user(); as u) {
            <a routerLink="/profile" class="px-2 py-2.5 rounded-lg hover:bg-surface-2">👤 My profile</a>
            @if (u.role === 'admin') {
              <a routerLink="/admin" class="px-2 py-2.5 rounded-lg hover:bg-surface-2 text-brand">🛡️ Admin review @if (pending() > 0) { ({{ pending() }}) }</a>
            }
            <button (click)="logout()" class="text-left px-2 py-2.5 rounded-lg hover:bg-surface-2 text-bad">Log out</button>
          } @else {
            <a routerLink="/login" class="px-2 py-2.5 rounded-lg hover:bg-surface-2 text-brand font-semibold">Log in / Sign up</a>
          }
        </nav>
      }
    </header>
  `,
  styles: [`@media (min-width: 420px) { .xs\\:block { display: block; } }`],
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private store = inject(StoreService);
  private router = inject(Router);
  theme = inject(ThemeService);

  query = signal('');
  menuOpen = signal(false);
  mobileOpen = signal(false);
  notifOpen = signal(false);

  user = this.auth.currentUser;
  pending = this.store.pendingCount;
  notifs = computed(() => {
    const u = this.user();
    return u ? this.store.notificationsFor(u.id) : [];
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.mobileOpen.set(false);
        this.menuOpen.set(false);
        this.notifOpen.set(false);
      });
  }

  search(e: Event) {
    e.preventDefault();
    this.router.navigate(['/browse'], { queryParams: { q: this.query() || null } });
  }

  logout() {
    this.mobileOpen.set(false);
    this.menuOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
