import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { categoryIcon, categoryName, REPORT_REASONS } from '../core/models';
import { AppCardComponent } from '../shared/app-card.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { IconComponent } from '../shared/icon.component';

/** Full app page: gallery, info, download, and reporting. */
@Component({
  selector: 'jt-app-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AppCardComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    IconComponent,
  ],
  template: `
    @if (!app()) {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state
          icon="search"
          title="App not found"
          message="We couldn't find that app. It may have been removed."
          linkText="Browse apps"
          linkTo="/browse"
        />
      </div>
    } @else {
      @if (app(); as a) {
      <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <a routerLink="/browse" class="text-sm text-brand hover:underline inline-flex items-center gap-1"><jt-icon name="arrow-left" size="0.9em" /> Back to browse</a>

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
                <span class="text-xs bg-brand-light text-brand px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-0.5" title="Verified developer"><jt-icon name="check" size="0.85em" /> Verified</span>
              }
              @if (canFollow()) {
                <button
                  type="button"
                  class="jt-btn jt-btn-ghost text-xs py-0.5 px-2"
                  (click)="toggleFollow()"
                >
                  @if (following()) {
                    <jt-icon name="check" size="0.9em" /> Following
                  } @else {
                    <jt-icon name="plus" size="0.9em" /> Follow
                  }
                </button>
              }
            </div>
            @if (store.wishlistCount(id) > 0) {
              <div class="mt-3 text-sm text-muted inline-flex items-center gap-1">
                <jt-icon name="heart-filled" size="0.9em" /> {{ store.wishlistCount(id) }} wishlisted
              </div>
            }
          </div>
          <div class="flex flex-col items-stretch sm:items-end gap-2 sm:w-44">
            <button class="jt-btn jt-btn-primary w-full" (click)="download()">
              @if (installed()) {
                <jt-icon name="refresh" size="1em" /> Download again
              } @else {
                <jt-icon name="download" size="1em" /> Get app
              }
            </button>
            @if (installed()) {
              <span class="text-xs text-good text-center sm:text-right inline-flex items-center gap-1 sm:justify-end"><jt-icon name="check" size="0.9em" /> In your library</span>
            }
            <button class="jt-btn jt-btn-ghost w-full" (click)="toggleWishlist()">
              @if (wishlisted()) {
                <jt-icon name="heart-filled" size="1em" /> Wishlisted
              } @else {
                <jt-icon name="heart" size="1em" /> Wishlist
              }
            </button>
            @if (a.forumPostUrl) {
              <a
                [href]="a.forumPostUrl"
                target="_blank"
                rel="noopener"
                class="jt-btn jt-btn-ghost w-full"
              >
                <jt-icon name="message" size="1em" /> View forum post
              </a>
            }
            <button class="jt-btn jt-btn-ghost w-full" (click)="toggleReport()"><jt-icon name="flag" size="1em" /> Report</button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          @for (m of meta(); track m.label) {
            <div class="jt-card p-3 text-center">
              <div class="text-xs text-muted">{{ m.label }}</div>
              <div class="font-semibold mt-0.5">{{ m.value }}</div>
            </div>
          }
        </div>

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

        <section class="mt-6">
          <h2 class="font-display text-xl font-bold mb-2">About this app</h2>
          <p class="text-ink/90 whitespace-pre-line leading-relaxed">{{ a.description }}</p>
          @if (a.forumPostUrl) {
            <p class="mt-4 text-sm">
              <a
                [href]="a.forumPostUrl"
                target="_blank"
                rel="noopener"
                class="text-brand font-medium hover:underline inline-flex items-center gap-1.5"
              >
                <jt-icon name="message" size="1em" /> Discuss this app on JTech Forums
                <jt-icon name="external" size="0.9em" />
              </a>
            </p>
          }
        </section>

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

      @if (lightbox(); as url) {
        <div
          class="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4"
          (click)="lightbox.set(null)"
        >
          <img [src]="url" alt="" class="max-h-full max-w-full rounded-xl" />
          <button class="absolute top-4 right-4 text-white" aria-label="Close"><jt-icon name="close" size="2rem" /></button>
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
  get id() {
    return this.appId();
  }

  app = computed(() => this.store.appById(this.appId()));
  developer = computed(() => this.store.profileById(this.app()?.developerId));

  installed = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.isInstalled(u.id, this.appId()) : false;
  });
  wishlisted = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.isWishlisted(u.id, this.appId()) : false;
  });
  isDeveloper = computed(() => {
    const u = this.auth.currentUser();
    return !!u && this.app()?.developerId === u.id;
  });
  canFollow = computed(() => {
    const a = this.app();
    if (!a) return false;
    const u = this.auth.currentUser();
    return !u || u.id !== a.developerId;
  });
  following = computed(() => {
    const a = this.app();
    return a ? this.store.isFollowing(a.developerId) : false;
  });

  meta = computed(() => {
    const a = this.app();
    if (!a) return [];
    return [
      { label: 'Category', value: categoryName(a.category) },
      { label: 'Platform', value: a.platform },
      { label: 'Version', value: a.version },
      { label: 'Size', value: `${a.sizeMb} MB` },
    ];
  });

  categoryIcon = categoryIcon;

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

  constructor() {
    if (this.appId()) this.store.trackView(this.appId());
  }

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

  async toggleWishlist() {
    const u = this.auth.currentUser();
    if (!u) {
      this.toast.error('Log in to use your wishlist.');
      return;
    }
    const a = this.app();
    if (!a) return;
    const wasWishlisted = this.wishlisted();
    await this.store.toggleWishlist(u.id, a.id);
    this.toast.success(
      wasWishlisted ? `Removed "${a.name}" from your wishlist` : `Added "${a.name}" to your wishlist`,
    );
  }

  toggleFollow() {
    const a = this.app();
    if (!a) return;
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Log in to follow developers.');
      return;
    }
    const wasFollowing = this.following();
    this.store.toggleFollow(a.developerId);
    const name = this.developer()?.fullName ?? 'developer';
    this.toast.success(wasFollowing ? `Unfollowed ${name}` : `Now following ${name}`);
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
    this.toast.success('Thanks. The moderators have been notified.');
  }
}
