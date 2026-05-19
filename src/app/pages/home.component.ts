import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../core/store.service';
import { CATEGORIES } from '../core/models';
import { AppCardComponent } from '../shared/app-card.component';
import { CountPipe } from '../shared/pipes';

/** Landing page — hero, category grid, featured & top apps. */
@Component({
  selector: 'jt-home',
  standalone: true,
  imports: [RouterLink, AppCardComponent, CountPipe],
  template: `
    <!-- hero -->
    <section class="bg-brand text-white">
      <div class="max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <span
          class="inline-block bg-gold text-[#2a1f00] text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded mb-4"
        >
          JTech community · prototype
        </span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
          Kosher apps, built by the <span class="text-gold">JTech</span> community.
        </h1>
        <p class="mt-4 text-white/90 text-base sm:text-lg max-w-xl">
          Discover apps for Torah, tefilla, zmanim, chinuch and more. Every app is reviewed before
          it reaches the store — submit your own and reach the whole community.
        </p>

        <form
          class="mt-7 flex items-center bg-white rounded-xl p-1.5 max-w-lg shadow-lg"
          (submit)="search($event)"
        >
          <span class="px-2 text-muted">🔍</span>
          <input
            [value]="q()"
            (input)="q.set($any($event.target).value)"
            placeholder="Search apps…"
            class="flex-1 px-1 py-2 outline-none text-ink min-w-0"
            aria-label="Search apps"
          />
          <button class="jt-btn jt-btn-primary">Search</button>
        </form>

        <div class="mt-5 flex flex-wrap gap-3">
          <a routerLink="/browse" class="jt-btn jt-btn-gold">Browse all apps</a>
          <a
            routerLink="/submit"
            class="jt-btn jt-btn-ghost !bg-white/10 !text-white !border-white/30"
          >
            + Submit your app
          </a>
        </div>

        <div class="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/80">
          <span><strong class="text-white">{{ stats().apps }}</strong> apps published</span>
          <span><strong class="text-white">{{ stats().devs }}</strong> developers</span>
          <span><strong class="text-white">{{ stats().downloads | count }}</strong> downloads</span>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4">
      <!-- categories -->
      <section class="py-10 sm:py-12">
        <h2 class="font-display text-2xl font-bold mb-1">Browse by category</h2>
        <p class="text-muted mb-6">Find the right app for every part of the day.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          @for (cat of categories; track cat.slug) {
            <a
              [routerLink]="['/browse']"
              [queryParams]="{ category: cat.slug }"
              class="jt-card p-4 hover:border-brand hover:shadow-md transition group"
            >
              <div class="text-3xl mb-2 group-hover:scale-110 transition-transform">{{ cat.icon }}</div>
              <div class="font-semibold leading-tight">{{ cat.name }}</div>
              <div class="text-xs text-muted mt-0.5">{{ cat.blurb }}</div>
            </a>
          }
        </div>
      </section>

      <!-- featured -->
      @if (featured().length) {
        <section class="pb-10">
          <div class="flex items-end justify-between mb-5 gap-3">
            <div>
              <h2 class="font-display text-2xl font-bold">⭐ Featured apps</h2>
              <p class="text-muted">Hand-picked by the JTech editors.</p>
            </div>
            <a routerLink="/browse" class="text-brand font-semibold hover:underline shrink-0">See all →</a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (app of featured(); track app.id) {
              <jt-app-card [app]="app" />
            }
          </div>
        </section>
      }

      <!-- top downloaded -->
      <section class="pb-10">
        <h2 class="font-display text-2xl font-bold mb-5">🔥 Most downloaded</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (app of topApps(); track app.id) {
            <jt-app-card [app]="app" />
          }
        </div>
      </section>

      <!-- new -->
      <section class="pb-12">
        <h2 class="font-display text-2xl font-bold mb-5">🆕 New in the store</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (app of newApps(); track app.id) {
            <jt-app-card [app]="app" />
          }
        </div>
      </section>

      <!-- developer CTA -->
      <section class="pb-16">
        <div class="jt-card bg-brand text-white p-8 text-center">
          <h2 class="font-display text-2xl font-bold">Built an app for the community?</h2>
          <p class="text-white/85 mt-2 max-w-lg mx-auto">
            Submit it to the JTech App Store. Our reviewers check every app before it goes live —
            free for the community.
          </p>
          <a routerLink="/submit" class="jt-btn jt-btn-gold mt-5">Submit your app</a>
        </div>
      </section>

      <!-- how it works -->
      <section class="pb-16">
        <div class="jt-card p-8 grid sm:grid-cols-3 gap-6 text-center">
          @for (step of steps; track step.title) {
            <div>
              <div class="text-3xl mb-2">{{ step.icon }}</div>
              <div class="font-semibold">{{ step.title }}</div>
              <p class="text-sm text-muted mt-1">{{ step.text }}</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {
  private store = inject(StoreService);
  private router = inject(Router);

  categories = CATEGORIES;
  q = signal('');

  steps = [
    { icon: '🔎', title: 'Discover', text: 'Browse community apps by category, rating, and platform.' },
    { icon: '🛡️', title: 'Reviewed', text: 'Every app is checked by a JTech admin before it is published.' },
    { icon: '⬇️', title: 'Download', text: 'Add apps to your library and download them in one tap.' },
  ];

  private published = computed(() => this.store.publishedApps());

  featured = computed(() => this.store.featuredApps());
  topApps = computed(() =>
    [...this.published()].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 6),
  );
  newApps = computed(() =>
    [...this.published()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3),
  );

  stats = computed(() => {
    const apps = this.published();
    return {
      apps: apps.length,
      devs: new Set(apps.map((a) => a.developerId)).size,
      downloads: apps.reduce((n, a) => n + a.downloadCount, 0),
    };
  });

  search(e: Event) {
    e.preventDefault();
    this.router.navigate(['/browse'], { queryParams: { q: this.q() || null } });
  }
}
