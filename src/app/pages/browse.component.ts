import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../core/store.service';
import { CATEGORIES, PLATFORMS, Platform } from '../core/models';
import { AppCardComponent } from '../shared/app-card.component';
import { EmptyStateComponent } from '../shared/empty-state.component';

type Sort = 'popular' | 'rating' | 'recent' | 'name';
type PriceFilter = 'all' | 'free' | 'paid';

/** Browse & search published apps with category / platform / price filters. */
@Component({
  selector: 'jt-browse',
  standalone: true,
  imports: [FormsModule, AppCardComponent, EmptyStateComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <h1 class="font-display text-2xl sm:text-3xl font-bold mb-4">Browse apps</h1>

      <!-- search -->
      <div class="flex items-center bg-surface border border-line rounded-lg px-3 mb-4">
        <span class="text-muted">🔍</span>
        <input
          [ngModel]="q()"
          (ngModelChange)="q.set($event)"
          placeholder="Search apps by name or description…"
          class="flex-1 bg-transparent px-2 py-2.5 outline-none text-sm"
          aria-label="Search apps"
        />
        @if (q()) {
          <button (click)="q.set('')" class="text-muted hover:text-ink" aria-label="Clear search">✕</button>
        }
      </div>

      <!-- filters -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
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
          <label class="jt-label" for="price">Price</label>
          <select id="price" class="jt-input" [ngModel]="price()" (ngModelChange)="price.set($event)">
            <option value="all">Any price</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
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
  price = signal<PriceFilter>('all');
  sort = signal<Sort>('popular');

  constructor() {
    const p = this.route.snapshot.queryParamMap;
    this.q.set(p.get('q') ?? '');
    this.category.set(p.get('category') ?? '');
  }

  hasFilters = computed(
    () => !!this.q() || !!this.category() || !!this.platform() || this.price() !== 'all',
  );

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
    if (this.price() === 'free') apps = apps.filter((a) => a.price === 0);
    if (this.price() === 'paid') apps = apps.filter((a) => a.price > 0);

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

  clearFilters() {
    this.q.set('');
    this.category.set('');
    this.platform.set('');
    this.price.set('all');
    this.router.navigate(['/browse']);
  }
}
