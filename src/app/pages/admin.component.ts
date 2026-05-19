import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { AppItem, Profile, categoryName, CATEGORIES } from '../core/models';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { DummySwitchComponent } from '../shared/dummy-switch.component';
import { TimeAgoPipe, CountPipe } from '../shared/pipes';

/** Admin review queue — approve / reject / suspend apps and handle reports. */
@Component({
  selector: 'jt-admin',
  standalone: true,
  imports: [
    RouterLink,
    EmptyStateComponent,
    StatusBadgeComponent,
    DummySwitchComponent,
    TimeAgoPipe,
    CountPipe,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      @if (!auth.isAdmin()) {
        <jt-empty-state
          icon="🛡️"
          title="Admins only"
          message="Log in as the admin account (username: jtech_admin) from the login page."
          linkText="Go to login"
          linkTo="/login"
        />
      } @else {
        <h1 class="font-display text-2xl sm:text-3xl font-bold mb-1">Admin review</h1>
        <p class="text-muted mb-6">Approve submissions, moderate published apps, and clear reports.</p>

        <!-- stats -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          @for (s of stats(); track s.label) {
            <div class="jt-card p-4">
              <div class="font-display text-2xl font-bold text-brand">{{ s.value }}</div>
              <div class="text-xs text-muted mt-0.5">{{ s.label }}</div>
            </div>
          }
        </div>

        <!-- analytics -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">📊 Analytics</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            @for (t of analyticsTiles(); track t.label) {
              <div class="jt-card p-4">
                <div class="font-display text-2xl font-bold text-brand">{{ t.value }}</div>
                <div class="text-xs text-muted mt-0.5">{{ t.label }}</div>
              </div>
            }
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <!-- apps by category -->
            <div class="jt-card p-5">
              <h3 class="font-semibold mb-3">Apps by category</h3>
              @if (categoryBars().length === 0) {
                <p class="text-sm text-muted">No apps yet.</p>
              } @else {
                <div class="flex flex-col gap-2.5">
                  @for (c of categoryBars(); track c.slug) {
                    <div>
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span class="truncate">{{ c.icon }} {{ c.name }}</span>
                        <span class="text-muted shrink-0 ml-2">{{ c.count }}</span>
                      </div>
                      <div class="h-3 rounded-full bg-surface-2 overflow-hidden">
                        <div class="h-full rounded-full bg-brand" [style.width.%]="c.pct"></div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- submissions per week -->
            <div class="jt-card p-5">
              <h3 class="font-semibold mb-3">Submissions per week</h3>
              <div class="flex items-end justify-between gap-2 h-36">
                @for (w of weekBars(); track w.label) {
                  <div class="flex-1 flex flex-col items-center justify-end h-full">
                    <span class="text-xs text-muted mb-1">{{ w.count }}</span>
                    <div
                      class="w-full rounded-t-md bg-brand min-h-[4px]"
                      [style.height.%]="w.pct"
                    ></div>
                    <span class="text-[10px] text-muted mt-1 text-center">{{ w.label }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="mt-4">
            <button class="jt-btn jt-btn-ghost text-sm" (click)="exportCsv()">⬇ Export apps (CSV)</button>
          </div>
        </section>

        <!-- review queue -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">
            ⏳ Review queue
            @if (pending().length) {
              <span class="text-bad">({{ pending().length }})</span>
            }
          </h2>
          @if (pending().length === 0) {
            <div class="jt-card p-6 text-center text-muted">🎉 The review queue is empty — nothing waiting.</div>
          } @else {
            <div class="flex flex-col gap-3">
              @for (a of pending(); track a.id) {
                <div class="jt-card p-4">
                  <div class="flex items-start gap-3">
                    <img [src]="a.iconUrl" [alt]="a.name" class="w-14 h-14 rounded-2xl object-cover border border-line shrink-0" />
                    <div class="min-w-0 flex-1">
                      <a [routerLink]="['/app', a.id]" class="font-semibold hover:text-brand">{{ a.name }}</a>
                      <div class="text-xs text-muted">{{ a.tagline }}</div>
                      <div class="text-xs text-muted mt-1">
                        {{ catName(a.category) }} · {{ a.platform }} · by &commat;{{ devName(a) }}
                        · submitted {{ a.createdAt | timeAgo }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <button class="jt-btn jt-btn-primary text-sm py-1.5" (click)="approve(a)">✓ Approve</button>
                    <button class="jt-btn jt-btn-ghost text-sm py-1.5 !text-bad" (click)="startReject(a)">✕ Reject</button>
                    <a [routerLink]="['/app', a.id]" class="jt-btn jt-btn-ghost text-sm py-1.5">Preview</a>
                  </div>
                  @if (rejectingId() === a.id) {
                    <div class="mt-3 border-t border-line pt-3">
                      <label class="jt-label">Reason for rejection (shown to the developer)</label>
                      <textarea
                        class="jt-input"
                        rows="2"
                        [value]="rejectReason()"
                        (input)="rejectReason.set($any($event.target).value)"
                      ></textarea>
                      <div class="flex gap-2 mt-2">
                        <button class="jt-btn jt-btn-primary text-sm py-1.5" (click)="confirmReject(a)">Confirm rejection</button>
                        <button class="jt-btn jt-btn-ghost text-sm py-1.5" (click)="rejectingId.set(null)">Cancel</button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>

        <!-- reports -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">
            ⚑ Open reports
            @if (openReports().length) {
              <span class="text-bad">({{ openReports().length }})</span>
            }
          </h2>
          @if (openReports().length === 0) {
            <div class="jt-card p-6 text-center text-muted">No open reports.</div>
          } @else {
            <div class="flex flex-col gap-3">
              @for (r of openReports(); track r.id) {
                <div class="jt-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div class="min-w-0 flex-1">
                    <a [routerLink]="['/app', r.appId]" class="font-semibold hover:text-brand">
                      {{ store.appById(r.appId)?.name ?? 'Unknown app' }}
                    </a>
                    <div class="text-sm text-bad">{{ r.reason }}</div>
                    @if (r.detail) {
                      <div class="text-xs text-muted mt-0.5">{{ r.detail }}</div>
                    }
                    <div class="text-xs text-muted mt-0.5">
                      by &commat;{{ store.profileById(r.reporterId)?.username }} · {{ r.createdAt | timeAgo }}
                    </div>
                  </div>
                  <button class="jt-btn jt-btn-ghost text-sm py-1.5 shrink-0" (click)="resolve(r.id)">Mark resolved</button>
                </div>
              }
            </div>
          }
        </section>

        <!-- all apps -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">All apps</h2>
          <div class="flex flex-col gap-2">
            @for (a of allApps(); track a.id) {
              <div class="jt-card p-3 flex items-center gap-3">
                <img [src]="a.iconUrl" [alt]="a.name" class="w-10 h-10 rounded-xl object-cover border border-line shrink-0" />
                <div class="min-w-0 flex-1">
                  <a [routerLink]="['/app', a.id]" class="font-medium text-sm hover:text-brand truncate block">{{ a.name }}</a>
                  <div class="text-xs text-muted">⬇ {{ a.downloadCount | count }} · {{ catName(a.category) }}</div>
                </div>
                <jt-status-badge [status]="a.status" />
                <div class="flex gap-1.5 shrink-0">
                  @if (a.status === 'approved') {
                    <button class="jt-btn jt-btn-ghost text-xs py-1 px-2" (click)="toggleFeatured(a)">
                      {{ a.featured ? '★ Unfeature' : '☆ Feature' }}
                    </button>
                    <button class="jt-btn jt-btn-ghost text-xs py-1 px-2 !text-bad" (click)="suspend(a)">Suspend</button>
                  } @else if (a.status === 'suspended' || a.status === 'rejected') {
                    <button class="jt-btn jt-btn-ghost text-xs py-1 px-2" (click)="approve(a)">Approve</button>
                  }
                  <button class="jt-btn jt-btn-ghost text-xs py-1 px-2 !text-bad" (click)="remove(a)">Delete</button>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- developers -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">Developers</h2>
          <div class="flex flex-col gap-2">
            @for (p of developers(); track p.id) {
              <div class="jt-card p-3 flex items-center gap-3">
                <img [src]="p.avatarUrl" [alt]="p.username" class="w-9 h-9 rounded-full object-cover border border-line shrink-0" />
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-sm truncate">
                    {{ p.fullName }}
                    @if (p.verified) {
                      <span class="text-brand" title="Verified developer">✔</span>
                    }
                  </div>
                  <div class="text-xs text-muted">&commat;{{ p.username }} · {{ p.role }}</div>
                </div>
                <span
                  class="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                  [class.bg-brand]="p.verified"
                  [class.bg-surface-2]="!p.verified"
                  [class.text-muted]="!p.verified"
                >
                  {{ p.verified ? 'Verified' : 'Unverified' }}
                </span>
                <button class="jt-btn jt-btn-ghost text-xs py-1 px-2 shrink-0" (click)="toggleVerified(p)">
                  {{ p.verified ? 'Unverify' : 'Verify' }}
                </button>
              </div>
            }
          </div>
        </section>

        <!-- feature flags -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">Store settings</h2>
          <div class="jt-card p-5">
            <jt-dummy-switch label="Require paid-app review by a second admin" [comingSoon]="true" [(on)]="flagDualReview" />
            <jt-dummy-switch label="Automated malware scan on upload" [comingSoon]="true" [(on)]="flagScan" />
            <jt-dummy-switch label="Email developers on approval / rejection" [comingSoon]="true" [(on)]="flagEmail" />
            <jt-dummy-switch label="Allow developer verification requests" [comingSoon]="true" [(on)]="flagVerify" />
            <p class="text-xs text-muted mt-3">These toggles are non-functional prototype switches.</p>
          </div>
        </section>

        <!-- danger zone -->
        <section>
          <h2 class="font-display text-xl font-bold mb-3">Danger zone</h2>
          <div class="jt-card border-bad p-5">
            <h3 class="font-semibold">Reset demo data</h3>
            <p class="text-sm text-muted mt-1">
              Wipes the in-browser database and reseeds it with the original mock apps, developers,
              and reviews. Any changes made this session will be lost.
            </p>
            <button class="jt-btn text-bad border-bad mt-4" (click)="resetData()">Reset demo data</button>
          </div>
        </section>
      }
    </div>
  `,
})
export class AdminComponent {
  store = inject(StoreService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  catName = categoryName;

  pending = computed(() => this.store.pendingApps());
  openReports = computed(() => this.store.openReports());
  allApps = computed(() =>
    [...this.store.apps()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  stats = computed(() => {
    const apps = this.store.apps();
    return [
      { label: 'Total apps', value: apps.length },
      { label: 'Published', value: apps.filter((a) => a.status === 'approved').length },
      { label: 'In review', value: apps.filter((a) => a.status === 'pending').length },
      { label: 'Rejected', value: apps.filter((a) => a.status === 'rejected').length },
      { label: 'Developers', value: this.store.profiles().length },
      { label: 'Open reports', value: this.openReports().length },
    ];
  });

  developers = computed(() =>
    [...this.store.profiles()].sort((a, b) => a.username.localeCompare(b.username)),
  );

  analyticsTiles = computed(() => {
    const apps = this.store.apps();
    const published = this.store.publishedApps();
    const ratings = published
      .map((a) => this.store.appRating(a.id))
      .filter((r) => r.count > 0);
    const avgRating = ratings.length
      ? ratings.reduce((s, r) => s + r.avg, 0) / ratings.length
      : 0;
    const approved = apps.filter((a) => a.status === 'approved').length;
    const rejected = apps.filter((a) => a.status === 'rejected').length;
    const decided = approved + rejected;
    const approvalRate = decided ? Math.round((approved / decided) * 100) : 0;
    return [
      { label: 'Total downloads', value: this.store.totalDownloads().toLocaleString() },
      { label: 'Avg rating', value: avgRating ? avgRating.toFixed(2) : '—' },
      { label: 'Approval rate', value: decided ? approvalRate + '%' : '—' },
      { label: 'Reviews', value: this.store.reviews().length },
    ];
  });

  categoryBars = computed(() => {
    const apps = this.store.apps();
    const rows = CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon,
      count: apps.filter((a) => a.category === c.slug).length,
    })).filter((r) => r.count > 0);
    const max = Math.max(1, ...rows.map((r) => r.count));
    return rows
      .sort((a, b) => b.count - a.count)
      .map((r) => ({ ...r, pct: (r.count / max) * 100 }));
  });

  weekBars = computed(() => {
    const now = Date.now();
    const buckets = [0, 0, 0, 0, 0, 0];
    for (const a of this.store.apps()) {
      const w = Math.floor((now - new Date(a.createdAt).getTime()) / (7 * 864e5));
      if (w >= 0 && w < 6) buckets[w]++;
    }
    const labels = ['this wk', 'wk -1', 'wk -2', 'wk -3', 'wk -4', 'wk -5'];
    const max = Math.max(1, ...buckets);
    return buckets.map((count, i) => ({
      label: labels[i],
      count,
      pct: (count / max) * 100,
    }));
  });

  rejectingId = signal<string | null>(null);
  rejectReason = signal('');

  flagDualReview = signal(false);
  flagScan = signal(false);
  flagEmail = signal(false);
  flagVerify = signal(false);

  devName(a: AppItem): string {
    return this.store.profileById(a.developerId)?.username ?? 'unknown';
  }

  async approve(a: AppItem) {
    await this.store.approveApp(a.id);
    this.toast.success(`Approved "${a.name}" — it's now live in the store.`);
  }

  startReject(a: AppItem) {
    this.rejectingId.set(a.id);
    this.rejectReason.set('');
  }
  async confirmReject(a: AppItem) {
    const reason = this.rejectReason().trim();
    if (!reason) {
      this.toast.error('Please give the developer a reason.');
      return;
    }
    await this.store.rejectApp(a.id, reason);
    this.rejectingId.set(null);
    this.toast.success(`Rejected "${a.name}".`);
  }

  async suspend(a: AppItem) {
    if (!window.confirm(`Suspend "${a.name}"? It will be removed from the store.`)) return;
    await this.store.suspendApp(a.id);
    this.toast.success(`Suspended "${a.name}".`);
  }

  async toggleFeatured(a: AppItem) {
    await this.store.setFeatured(a.id, !a.featured);
    this.toast.success(a.featured ? `Unfeatured "${a.name}"` : `Featured "${a.name}"`);
  }

  async remove(a: AppItem) {
    if (!window.confirm(`Delete "${a.name}"? This cannot be undone.`)) return;
    await this.store.deleteApp(a.id);
    this.toast.success(`Deleted "${a.name}"`);
  }

  async resolve(id: string) {
    await this.store.resolveReport(id);
    this.toast.success('Report resolved');
  }

  async toggleVerified(p: Profile) {
    await this.store.setVerified(p.id, !p.verified);
    this.toast.success(
      p.verified ? `Removed verified badge from @${p.username}` : `Verified @${p.username}`,
    );
  }

  exportCsv() {
    const esc = (v: string | number): string => {
      const s = String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const headers = [
      'name',
      'developer',
      'category',
      'platform',
      'version',
      'status',
      'downloads',
      'created',
    ];
    const rows = this.allApps().map((a) =>
      [
        a.name,
        this.devName(a),
        this.catName(a.category),
        a.platform,
        a.version,
        a.status,
        a.downloadCount,
        a.createdAt,
      ]
        .map(esc)
        .join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jtech-appstore-apps-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast.success(`Exported ${rows.length} apps to CSV`);
  }

  async resetData() {
    if (!window.confirm('Reset all demo data? This wipes the in-browser database and reseeds it.'))
      return;
    await this.store.resetData();
    this.toast.success('Demo data reset');
  }
}
