import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../core/store.service';
import { CATEGORIES, PLATFORMS, Platform } from '../core/models';
import { AppCardComponent } from '../shared/app-card.component';
import { EmptyStateComponent } from '../shared/empty-state.component';

type Sort = 'popular' | 'rating' | 'recent' | 'name';

interface SavedSearch {
  q: string;
  category: string;
  platform: Platform | '';
  sort: Sort;
}

const SAVED_SEARCHES_KEY = 'jtech-appstore-saved-searches';

/** Browse & search published apps with category / platform filters. */
@Component({
  selector: 'jt-browse',
  standalone: true,
  imports: [FormsModule, AppCardComponent, EmptyStateComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <h1 class="font-display text-2xl sm:text-3xl font-bold mb-4">Browse apps</h1>

      <!-- search -->
      <div class="relative mb-4">
        <div class="flex items-center bg-surface border border-line rounded-lg px-3">
          <span class="text-muted">🔍</span>
          <input
            [ngModel]="q()"
            (ngModelChange)="onQueryInput($event)"
            (focus)="showSuggestions.set(true)"
            (blur)="onSearchBlur()"
            placeholder="Search apps by name or description…"
            class="flex-1 bg-transparent px-2 py-2.5 outline-none text-sm"
            aria-label="Search apps"
            autocomplete="off"
          />
          @if (q()) {
            <button (click)="q.set('')" class="text-muted hover:text-ink" aria-label="Clear search">✕</button>
          }
        </div>

        @if (showSuggestions() && suggestions().length) {
          <ul
            class="absolute z-20 left-0 right-0 mt-1 jt-card p-1 max-h-72 overflow-auto"
            role="listbox"
          >
            @for (s of suggestions(); track s) {
              <li>
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-surface-2"
                  (mousedown)="pickSuggestion(s)"
                >
                  <span class="text-muted">🔍</span>
                  <span class="ml-2">{{ s }}</span>
                </button>
              </li>
            }
          </ul>
        }
      </div>

      <!-- filters -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div>
          <label class="jt-label" for="cat">Category</label>
          <select id="cat" class="jt-input" [ngModel]="category()" (ngModelChange)="category.set($event)">
            <option value="">All categories</option>
            @for (c of categories; track c.slug) {
              <option [value]="c.slug">{{ c.icon }} {{ c.name }}</option>
            }
          </select>
        </div>
        <div>
          <label class="jt-label" for="plat">Platform</label>
          <select id="plat" class="jt-input" [ngModel]="platform()" (ngModelChange)="platform.set($event)">
            <option value="">All platforms</option>
            @for (p of platforms; track p) {
              <option [value]="p">{{ p }}</option>
            }
          </select>
        </div>
        <div>
          <label class="jt-label" for="sort">Sort by</label>
          <select id="sort" class="jt-input" [ngModel]="sort()" (ngModelChange)="sort.set($event)">
            <option value="popular">Most downloaded</option>
            <option value="rating">Highest rated</option>
            <option value="recent">Newest</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <!-- saved searches -->
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <button
          (click)="saveSearch()"
          class="jt-btn jt-btn-ghost text-sm py-1 px-3"
        >
          ⭐ Save this search
        </button>
        @for (s of savedSearches(); track $index) {
          <span class="jt-pill bg-surface-2 border border-line flex items-center gap-1.5">
            <button
              type="button"
              class="text-brand font-medium hover:underline"
              (click)="applySearch(s)"
            >
              {{ searchLabel(s) }}
            </button>
            <button
              type="button"
              class="text-muted hover:text-ink"
              aria-label="Delete saved search"
              (click)="deleteSearch($index)"
            >
              ✕
            </button>
          </span>
        }
      </div>

      <div class="flex items-center justify-between mb-4 text-sm text-muted">
        <span>{{ results().length }} app{{ results().length === 1 ? '' : 's' }}</span>
        @if (hasFilters()) {
          <button (click)="clearFilters()" class="text-brand font-medium hover:underline">Clear filters</button>
        }
      </div>

      @if (results().length) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (app of results(); track app.id) {
            <jt-app-card [app]="app" />
          }
        </div>
      } @else {
        <jt-empty-state
          icon="🔍"
          title="No apps found"
          message="Try a different search or clear the filters."
          linkText="Submit an app"
          linkTo="/submit"
        />
      }
    </div>
  `,
})
export class BrowseComponent {
  private store = inject(StoreService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = CATEGORIES;
  platforms = PLATFORMS;

  q = signal('');
  category = signal('');
  platform = signal<Platform | ''>('');
  sort = signal<Sort>('popular');

  showSuggestions = signal(false);
  savedSearches = signal<SavedSearch[]>(this.loadSavedSearches());

  constructor() {
    const p = this.route.snapshot.queryParamMap;
    this.q.set(p.get('q') ?? '');
    this.category.set(p.get('category') ?? '');
  }

  hasFilters = computed(
    () => !!this.q() || !!this.category() || !!this.platform(),
  );

  suggestions = computed(() => {
    const term = this.q().trim().toLowerCase();
    if (!term) return [];
    const names = [...new Set(this.store.publishedApps().map((a) => a.name))];
    const prefix = names.filter((n) => n.toLowerCase().startsWith(term));
    const substring = names.filter(
      (n) => !n.toLowerCase().startsWith(term) && n.toLowerCase().includes(term),
    );
    return [...prefix, ...substring].slice(0, 6);
  });

  results = computed(() => {
    const term = this.q().trim().toLowerCase();
    let apps = this.store.publishedApps();

    if (term) {
      apps = apps.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          a.tagline.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term),
      );
    }
    if (this.category()) apps = apps.filter((a) => a.category === this.category());
    if (this.platform()) apps = apps.filter((a) => a.platform === this.platform());

    const sorted = [...apps];
    switch (this.sort()) {
      case 'popular':
        sorted.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'rating':
        sorted.sort((a, b) => this.store.appRating(b.id).avg - this.store.appRating(a.id).avg);
        break;
      case 'recent':
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  });

  onQueryInput(value: string) {
    this.q.set(value);
    this.showSuggestions.set(true);
  }

  onSearchBlur() {
    // delay so a suggestion mousedown can register first
    setTimeout(() => this.showSuggestions.set(false), 120);
  }

  pickSuggestion(name: string) {
    this.q.set(name);
    this.showSuggestions.set(false);
  }

  private loadSavedSearches(): SavedSearch[] {
    try {
      const raw = localStorage.getItem(SAVED_SEARCHES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
    } catch {
      return [];
    }
  }

  private persistSavedSearches(list: SavedSearch[]) {
    this.savedSearches.set(list);
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(list));
    } catch {
      // ignore storage failures
    }
  }

  saveSearch() {
    const snapshot: SavedSearch = {
      q: this.q(),
      category: this.category(),
      platform: this.platform(),
      sort: this.sort(),
    };
    const existing = this.savedSearches().filter(
      (s) =>
        !(
          s.q === snapshot.q &&
          s.category === snapshot.category &&
          s.platform === snapshot.platform &&
          s.sort === snapshot.sort
        ),
    );
    this.persistSavedSearches([snapshot, ...existing].slice(0, 6));
  }

  applySearch(s: SavedSearch) {
    this.q.set(s.q);
    this.category.set(s.category);
    this.platform.set(s.platform);
    this.sort.set(s.sort);
    this.showSuggestions.set(false);
  }

  deleteSearch(index: number) {
    const list = this.savedSearches().filter((_, i) => i !== index);
    this.persistSavedSearches(list);
  }

  searchLabel(s: SavedSearch): string {
    const parts: string[] = [];
    if (s.q) parts.push(`"${s.q}"`);
    if (s.category) parts.push(CATEGORIES.find((c) => c.slug === s.category)?.name ?? s.category);
    if (s.platform) parts.push(s.platform);
    if (!parts.length) parts.push('All apps');
    return parts.join(' · ');
  }

  clearFilters() {
    this.q.set('');
    this.category.set('');
    this.platform.set('');
    this.router.navigate(['/browse']);
  }
}
