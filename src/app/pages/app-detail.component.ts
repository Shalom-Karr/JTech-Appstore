import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { categoryIcon, categoryName, REPORT_REASONS } from '../core/models';
import { AppCardComponent } from '../shared/app-card.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { StarsComponent } from '../shared/stars.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { PricePipe, TimeAgoPipe } from '../shared/pipes';

/** Full app page — gallery, info, reviews, download, and reporting. */
@Component({
  selector: 'jt-app-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AppCardComponent,
    EmptyStateComponent,
    StarsComponent,
    StatusBadgeComponent,
    PricePipe,
    TimeAgoPipe,
  ],
  template: `
    @if (!app()) {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state
          icon="🤷"
          title="App not found"
          message="We couldn't find that app — it may have been removed."
          linkText="Browse apps"
          linkTo="/browse"
        />
      </div>
    } @else {
      @if (app(); as a) {
      <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <a routerLink="/browse" class="text-sm text-brand hover:underline">← Back to browse</a>

        @if (a.status !== 'approved') {
          <div class="jt-card mt-3 p-3 text-sm flex items-center gap-2 bg-gold-light">
            <jt-status-badge [status]="a.status" />
            <span class="text-gold-dark">
              @if (a.status === 'pending') { This app is awaiting admin review and isn't public yet. }
              @if (a.status === 'rejected') { This submission was rejected. }
              @if (a.status === 'suspended') { This app is temporarily unavailable. }
            </span>
          </div>
        }

        <!-- header -->
        <div class="jt-card p-5 sm:p-6 mt-3 flex flex-col sm:flex-row gap-5">
          <img
            [src]="a.iconUrl"
            [alt]="a.name"
            class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border border-line shrink-0 mx-auto sm:mx-0"
          />
          <div class="min-w-0 flex-1 text-center sm:text-left">
            <h1 class="font-display text-2xl sm:text-3xl font-bold">{{ a.name }}</h1>
            <p class="text-muted mt-0.5">{{ a.tagline }}</p>
            <div class="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm">
              <a
                [routerLink]="['/developer', developer()?.username]"
                class="text-brand font-medium hover:underline"
              >
                {{ developer()?.fullName }}
              </a>
              @if (developer()?.verified) {
                <span class="text-xs bg-brand-light text-brand px-1.5 py-0.5 rounded font-medium" title="Verified developer">✓ Verified</span>
              }
            </div>
            <div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <jt-stars [value]="rating().avg" />
              <span class="text-sm text-muted">
                {{ rating().avg || '—' }}
                ({{ rating().count }} review{{ rating().count === 1 ? '' : 's' }})
              </span>
            </div>
          </div>
          <div class="flex flex-col items-stretch sm:items-end gap-2 sm:w-44">
            <div class="font-display text-2xl font-bold text-brand text-center sm:text-right">
              {{ a.price | price }}
            </div>
            <button class="jt-btn jt-btn-primary w-full" (click)="download()">
              {{ installed() ? '↻ Download again' : '⬇ Get app' }}
            </button>
            @if (installed()) {
              <span class="text-xs text-good text-center sm:text-right">✓ In your library</span>
            }
            <button class="jt-btn jt-btn-ghost w-full" (click)="toggleReport()">⚑ Report</button>
          </div>
        </div>

        <!-- meta strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          @for (m of meta(); track m.label) {
            <div class="jt-card p-3 text-center">
              <div class="text-xs text-muted">{{ m.label }}</div>
              <div class="font-semibold mt-0.5">{{ m.value }}</div>
            </div>
          }
        </div>

        <!-- report form -->
        @if (reportOpen()) {
          <div class="jt-card p-5 mt-4 border-bad">
            <h3 class="font-semibold mb-2">Report this app</h3>
            <select class="jt-input mb-2" [ngModel]="reportReason()" (ngModelChange)="reportReason.set($event)">
              @for (r of reportReasons; track r) {
                <option [value]="r">{{ r }}</option>
              }
            </select>
            <textarea
              class="jt-input"
              rows="3"
              placeholder="Add any detail for the moderators…"
              [ngModel]="reportDetail()"
              (ngModelChange)="reportDetail.set($event)"
            ></textarea>
            <div class="flex gap-2 mt-3">
              <button class="jt-btn jt-btn-primary" (click)="submitReport()">Send report</button>
              <button class="jt-btn jt-btn-ghost" (click)="toggleReport()">Cancel</button>
            </div>
          </div>
        }

        <!-- screenshots -->
        <section class="mt-6">
          <h2 class="font-display text-xl font-bold mb-3">Screenshots</h2>
          <div class="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            @for (url of a.screenshotUrls; track $index) {
              <button type="button" (click)="lightbox.set(url)" class="shrink-0">
                <img
                  [src]="url"
                  [alt]="a.name + ' screenshot'"
                  loading="lazy"
                  class="h-56 sm:h-72 rounded-xl border border-line object-cover"
                />
              </button>
            }
          </div>
        </section>

        <!-- description -->
        <section class="mt-6">
          <h2 class="font-display text-xl font-bold mb-2">About this app</h2>
          <p class="text-ink/90 whitespace-pre-line leading-relaxed">{{ a.description }}</p>
        </section>

        <!-- reviews -->
        <section class="mt-8">
          <h2 class="font-display text-xl font-bold mb-3">
            Ratings & reviews ({{ rating().count }})
          </h2>

          @if (auth.isLoggedIn() && a.status === 'approved' && !alreadyReviewed()) {
            <div class="jt-card p-4 mb-4">
              <h3 class="font-semibold text-sm mb-2">Write a review</h3>
              <div class="flex items-center gap-1 mb-2">
                @for (n of [1, 2, 3, 4, 5]; track n) {
                  <button
                    type="button"
                    (click)="myRating.set(n)"
                    class="text-2xl"
                    [class.text-gold]="n <= myRating()"
                    [class.text-line]="n > myRating()"
                    [attr.aria-label]="n + ' stars'"
                  >
                    ★
                  </button>
                }
              </div>
              <textarea
                class="jt-input"
                rows="3"
                placeholder="Share what you think of this app…"
                [ngModel]="myReview()"
                (ngModelChange)="myReview.set($event)"
              ></textarea>
              <button class="jt-btn jt-btn-primary mt-3" (click)="submitReview()">Post review</button>
            </div>
          } @else if (alreadyReviewed()) {
            <p class="text-sm text-muted mb-4">✓ You've already reviewed this app.</p>
          }

          @if (reviews().length) {
            <div class="flex flex-col gap-3">
              @for (r of reviews(); track r.id) {
                <div class="jt-card p-4">
                  <div class="flex items-center gap-2">
                    <img
                      [src]="store.profileById(r.authorId)?.avatarUrl"
                      alt=""
                      class="w-8 h-8 rounded-full object-cover border border-line"
                    />
                    <div class="min-w-0">
                      <div class="font-medium text-sm truncate">
                        {{ store.profileById(r.authorId)?.fullName }}
                      </div>
                      <div class="text-xs text-muted">{{ r.createdAt | timeAgo }}</div>
                    </div>
                    <div class="ml-auto"><jt-stars [value]="r.rating" size="0.85rem" /></div>
                  </div>
                  <p class="text-sm mt-2 text-ink/90">{{ r.content }}</p>
                </div>
              }
            </div>
          } @else {
            <p class="text-muted text-sm">No reviews yet — be the first to review this app.</p>
          }
        </section>

        <!-- more from developer / similar -->
        @if (moreApps().length) {
          <section class="mt-10">
            <h2 class="font-display text-xl font-bold mb-3">More to discover</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (m of moreApps(); track m.id) {
                <jt-app-card [app]="m" />
              }
            </div>
          </section>
        }
      </div>

      <!-- lightbox -->
      @if (lightbox(); as url) {
        <div
          class="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4"
          (click)="lightbox.set(null)"
        >
          <img [src]="url" alt="" class="max-h-full max-w-full rounded-xl" />
          <button class="absolute top-4 right-4 text-white text-3xl" aria-label="Close">✕</button>
        </div>
      }
      }
    }
  `,
})
export class AppDetailComponent {
  store = inject(StoreService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  reportReasons = REPORT_REASONS;

  private appId = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

  app = computed(() => this.store.appById(this.appId()));
  developer = computed(() => this.store.profileById(this.app()?.developerId));
  rating = computed(() => this.store.appRating(this.appId()));
  reviews = computed(() => this.store.reviewsForApp(this.appId()));

  installed = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.isInstalled(u.id, this.appId()) : false;
  });
  alreadyReviewed = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.hasReviewed(this.appId(), u.id) : false;
  });

  meta = computed(() => {
    const a = this.app();
    if (!a) return [];
    return [
      { label: 'Category', value: `${categoryIcon(a.category)} ${categoryName(a.category)}` },
      { label: 'Platform', value: a.platform },
      { label: 'Version', value: a.version },
      { label: 'Size', value: `${a.sizeMb} MB` },
    ];
  });

  moreApps = computed(() => {
    const a = this.app();
    if (!a) return [];
    const sameDev = this.store
      .appsByDeveloper(a.developerId)
      .filter((x) => x.id !== a.id && x.status === 'approved');
    const sameCat = this.store
      .publishedApps()
      .filter((x) => x.id !== a.id && x.category === a.category);
    const seen = new Set<string>();
    return [...sameDev, ...sameCat].filter((x) => !seen.has(x.id) && seen.add(x.id)).slice(0, 3);
  });

  lightbox = signal<string | null>(null);

  reportOpen = signal(false);
  reportReason = signal(REPORT_REASONS[0]);
  reportDetail = signal('');

  myRating = signal(5);
  myReview = signal('');

  download() {
    const a = this.app();
    if (!a) return;
    if (a.status !== 'approved') {
      this.toast.error('This app is not available for download.');
      return;
    }
    const u = this.auth.currentUser();
    this.store.download(a.id, u?.id ?? null);
    this.toast.success(u ? `Added "${a.name}" to your library` : `Downloading "${a.name}"…`);
  }

  toggleReport() {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Log in to report an app.');
      return;
    }
    this.reportOpen.set(!this.reportOpen());
  }

  async submitReport() {
    const u = this.auth.currentUser();
    const a = this.app();
    if (!u || !a) return;
    await this.store.addReport({
      appId: a.id,
      reporterId: u.id,
      reason: this.reportReason(),
      detail: this.reportDetail().trim(),
    });
    this.reportOpen.set(false);
    this.reportDetail.set('');
    this.toast.success('Thanks — the moderators have been notified.');
  }

  async submitReview() {
    const u = this.auth.currentUser();
    const a = this.app();
    if (!u || !a) return;
    if (!this.myReview().trim()) {
      this.toast.error('Please write a few words for your review.');
      return;
    }
    await this.store.addReview({
      appId: a.id,
      authorId: u.id,
      rating: this.myRating(),
      content: this.myReview().trim(),
    });
    this.myReview.set('');
    this.toast.success('Your review has been posted. Yasher koach!');
  }
}
