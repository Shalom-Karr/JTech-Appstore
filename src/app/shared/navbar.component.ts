import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { StoreService } from '../core/store.service';

/** Top navigation bar — search, submit, library, account. */
@Component({
  selector: 'jt-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-surface border-b border-line sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        <a routerLink="/" class="flex items-center gap-2 shrink-0">
          <img src="favicon.svg" alt="" class="w-9 h-9" />
          <span class="font-display font-extrabold text-xl text-brand leading-none hidden sm:block">
            JTech<span class="text-gold">AppStore</span>
          </span>
        </a>

        <form
          class="flex-1 max-w-xl flex items-center bg-paper border border-line rounded-lg px-3"
          (submit)="search($event)"
        >
          <span class="text-muted">🔍</span>
          <input
            name="q"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            placeholder="Search apps…"
            class="flex-1 bg-transparent px-2 py-2 outline-none text-sm"
            aria-label="Search apps"
          />
        </form>

        <nav class="flex items-center gap-1 shrink-0">
          <a routerLink="/browse" routerLinkActive="text-brand" class="hidden md:inline-flex p-2 rounded-lg hover:bg-paper text-sm font-medium">Browse</a>
          <a routerLink="/submit" class="jt-btn jt-btn-gold hidden md:inline-flex">+ Submit app</a>

          <a
            routerLink="/library"
            routerLinkActive="text-brand"
            class="p-2 rounded-lg hover:bg-paper text-xl"
            title="My library"
            aria-label="My library"
            >📚</a
          >

          @if (user(); as u) {
            <div class="relative">
              <button
                (click)="menuOpen.set(!menuOpen())"
                class="flex items-center gap-1 p-1 rounded-lg hover:bg-paper relative"
                aria-label="Account menu"
              >
                <img [src]="u.avatarUrl" alt="" class="w-8 h-8 rounded-full object-cover border border-line" />
                @if (u.role === 'admin' && pending() > 0) {
                  <span
                    class="absolute -top-0.5 -right-0.5 bg-bad text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center"
                    >{{ pending() }}</span
                  >
                }
              </button>
              @if (menuOpen()) {
                <div
                  class="absolute right-0 mt-1 w-56 jt-card shadow-lg py-1 text-sm"
                  (mouseleave)="menuOpen.set(false)"
                >
                  <div class="px-3 py-2 border-b border-line">
                    <div class="font-semibold">{{ u.fullName }}</div>
                    <div class="text-muted text-xs">&commat;{{ u.username }}</div>
                  </div>
                  <a routerLink="/profile" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-paper">My profile & apps</a>
                  <a routerLink="/library" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-paper">My library</a>
                  <a routerLink="/submit" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-paper">Submit an app</a>
                  @if (u.role === 'admin') {
                    <a routerLink="/admin" (click)="menuOpen.set(false)" class="block px-3 py-2 hover:bg-paper text-brand font-medium">
                      Admin review @if (pending() > 0) { <span class="text-bad">({{ pending() }})</span> }
                    </a>
                  }
                  <button (click)="logout()" class="w-full text-left px-3 py-2 hover:bg-paper text-bad border-t border-line">
                    Log out
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="jt-btn jt-btn-ghost ml-1">Log in</a>
          }
        </nav>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private store = inject(StoreService);
  private router = inject(Router);

  query = signal('');
  menuOpen = signal(false);

  user = this.auth.currentUser;
  pending = this.store.pendingCount;

  search(e: Event) {
    e.preventDefault();
    this.router.navigate(['/browse'], { queryParams: { q: this.query() || null } });
  }

  logout() {
    this.menuOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
