import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { DbService } from './db.service';
import { AppItem, AppStatus, Install, Platform, Profile, Report, Review, uid } from './models';
import { SEED_APPS, SEED_INSTALLS, SEED_PROFILES, SEED_REPORTS, SEED_REVIEWS } from './seed-data';

/**
 * The app-store data store.
 *
 * Keeps an in-memory signal mirror of every table and writes changes through
 * to IndexedDB (DbService). Components read the signals and call the mutation
 * methods — they never talk to Dexie directly. On first run the database is
 * seeded with mock data; clearing browser storage re-seeds it.
 */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private db = inject(DbService);
  private zone = inject(NgZone);

  readonly ready = signal(false);
  readonly profiles = signal<Profile[]>([]);
  readonly apps = signal<AppItem[]>([]);
  readonly reviews = signal<Review[]>([]);
  readonly installs = signal<Install[]>([]);
  readonly reports = signal<Report[]>([]);

  constructor() {
    this.init();
  }

  private async init() {
    try {
      if ((await this.db.apps.count()) === 0) {
        await this.db.transaction(
          'rw',
          [this.db.profiles, this.db.apps, this.db.reviews, this.db.installs, this.db.reports],
          async () => {
            await this.db.profiles.bulkAdd(SEED_PROFILES);
            await this.db.apps.bulkAdd(SEED_APPS);
            await this.db.reviews.bulkAdd(SEED_REVIEWS);
            await this.db.installs.bulkAdd(SEED_INSTALLS);
            await this.db.reports.bulkAdd(SEED_REPORTS);
          },
        );
      }
      const [profiles, apps, reviews, installs, reports] = await Promise.all([
        this.db.profiles.toArray(),
        this.db.apps.toArray(),
        this.db.reviews.toArray(),
        this.db.installs.toArray(),
        this.db.reports.toArray(),
      ]);
      this.zone.run(() => {
        this.profiles.set(profiles);
        this.apps.set(apps);
        this.reviews.set(reviews);
        this.installs.set(installs);
        this.reports.set(reports);
        this.ready.set(true);
      });
    } catch (e) {
      console.error('Store init failed', e);
      this.zone.run(() => this.ready.set(true));
    }
  }

  /* ── profiles ─────────────────────────────────────────────────────────── */
  profileById(id: string | null | undefined): Profile | undefined {
    return this.profiles().find((p) => p.id === id);
  }
  profileByUsername(username: string): Profile | undefined {
    return this.profiles().find((p) => p.username === username);
  }
  async addProfile(p: Profile) {
    this.profiles.update((all) => [...all, p]);
    await this.db.profiles.add(p);
  }
  async updateProfile(id: string, patch: Partial<Profile>) {
    this.profiles.update((all) => all.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    await this.db.profiles.update(id, patch);
  }

  /* ── apps: reads ──────────────────────────────────────────────────────── */
  appById(id: string): AppItem | undefined {
    return this.apps().find((a) => a.id === id);
  }
  appsByDeveloper(developerId: string): AppItem[] {
    return this.apps()
      .filter((a) => a.developerId === developerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  /** Apps shoppers can see and download — approved only. */
  publishedApps(): AppItem[] {
    return this.apps().filter((a) => a.status === 'approved');
  }
  /** Submissions still waiting for an admin decision. */
  pendingApps(): AppItem[] {
    return this.apps()
      .filter((a) => a.status === 'pending')
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  featuredApps(): AppItem[] {
    return this.publishedApps().filter((a) => a.featured);
  }

  /* ── apps: developer mutations ────────────────────────────────────────── */
  async submitApp(input: {
    developerId: string;
    name: string;
    tagline: string;
    description: string;
    iconUrl: string;
    screenshotUrls: string[];
    category: string;
    platform: Platform;
    version: string;
    price: number;
    downloadUrl: string;
    sizeMb: number;
  }): Promise<AppItem> {
    const now = new Date().toISOString();
    const app: AppItem = {
      id: uid('app-'),
      status: 'pending',
      rejectionReason: '',
      featured: false,
      downloadCount: 0,
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    this.apps.update((all) => [app, ...all]);
    await this.db.apps.add(app);
    return app;
  }

  async updateApp(id: string, patch: Partial<AppItem>) {
    const full = { ...patch, updatedAt: new Date().toISOString() };
    this.apps.update((all) => all.map((a) => (a.id === id ? { ...a, ...full } : a)));
    await this.db.apps.update(id, full);
  }

  /** Editing an app's content re-submits it for review. */
  async resubmitApp(id: string, patch: Partial<AppItem>) {
    await this.updateApp(id, { ...patch, status: 'pending', rejectionReason: '' });
  }

  async deleteApp(id: string) {
    this.apps.update((all) => all.filter((a) => a.id !== id));
    this.reviews.update((all) => all.filter((r) => r.appId !== id));
    this.installs.update((all) => all.filter((i) => i.appId !== id));
    await this.db.apps.delete(id);
    await this.db.reviews.where('appId').equals(id).delete();
    await this.db.installs.where('appId').equals(id).delete();
  }

  /* ── apps: admin moderation ───────────────────────────────────────────── */
  async approveApp(id: string) {
    await this.updateApp(id, { status: 'approved', rejectionReason: '' });
  }
  async rejectApp(id: string, reason: string) {
    await this.updateApp(id, { status: 'rejected', rejectionReason: reason });
  }
  async suspendApp(id: string) {
    await this.updateApp(id, { status: 'suspended' });
  }
  async setFeatured(id: string, featured: boolean) {
    await this.updateApp(id, { featured });
  }

  /* ── downloads / library ──────────────────────────────────────────────── */
  isInstalled(userId: string, appId: string): boolean {
    return this.installs().some((i) => i.userId === userId && i.appId === appId);
  }
  installedApps(userId: string): AppItem[] {
    const ids = new Set(
      this.installs()
        .filter((i) => i.userId === userId)
        .map((i) => i.appId),
    );
    return this.apps().filter((a) => ids.has(a.id));
  }
  installedAt(userId: string, appId: string): string {
    return this.installs().find((i) => i.userId === userId && i.appId === appId)?.installedAt ?? '';
  }

  /**
   * Record a download: bumps the app's counter and, when a user is signed in,
   * adds the app to their library.
   */
  async download(appId: string, userId: string | null) {
    const app = this.appById(appId);
    if (!app) return;
    await this.updateApp(appId, { downloadCount: app.downloadCount + 1 });
    if (userId && !this.isInstalled(userId, appId)) {
      const install: Install = {
        userId,
        appId,
        installedAt: new Date().toISOString(),
      };
      this.installs.update((all) => [...all, install]);
      await this.db.installs.add(install);
    }
  }

  async uninstall(userId: string, appId: string) {
    this.installs.update((all) => all.filter((i) => !(i.userId === userId && i.appId === appId)));
    await this.db.installs.delete([userId, appId]);
  }

  /* ── reviews & ratings ────────────────────────────────────────────────── */
  reviewsForApp(appId: string): Review[] {
    return this.reviews()
      .filter((r) => r.appId === appId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  /** Average star rating and review count for an app. */
  appRating(appId: string): { avg: number; count: number } {
    const rs = this.reviews().filter((r) => r.appId === appId);
    if (!rs.length) return { avg: 0, count: 0 };
    const avg = rs.reduce((s, r) => s + r.rating, 0) / rs.length;
    return { avg: Math.round(avg * 10) / 10, count: rs.length };
  }
  hasReviewed(appId: string, authorId: string): boolean {
    return this.reviews().some((r) => r.appId === appId && r.authorId === authorId);
  }
  async addReview(input: { appId: string; authorId: string; rating: number; content: string }) {
    const review: Review = { id: uid('rv-'), createdAt: new Date().toISOString(), ...input };
    this.reviews.update((all) => [review, ...all]);
    await this.db.reviews.add(review);
  }
  async deleteReview(id: string) {
    this.reviews.update((all) => all.filter((r) => r.id !== id));
    await this.db.reviews.delete(id);
  }

  /* ── reports (moderation) ─────────────────────────────────────────────── */
  allReports(): Report[] {
    return [...this.reports()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  openReports(): Report[] {
    return this.allReports().filter((r) => !r.resolved);
  }
  async addReport(input: { appId: string; reporterId: string; reason: string; detail: string }) {
    const report: Report = {
      id: uid('rp-'),
      resolved: false,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.reports.update((all) => [report, ...all]);
    await this.db.reports.add(report);
  }
  async resolveReport(id: string) {
    this.reports.update((all) => all.map((r) => (r.id === id ? { ...r, resolved: true } : r)));
    await this.db.reports.update(id, { resolved: true });
  }

  /* ── derived totals ───────────────────────────────────────────────────── */
  readonly pendingCount = computed(() => this.apps().filter((a) => a.status === 'pending').length);
  readonly totalDownloads = computed(() =>
    this.apps().reduce((n, a) => n + a.downloadCount, 0),
  );

  /** Wipe the in-browser database and re-seed (used by the admin page). */
  async resetData() {
    await Promise.all([
      this.db.profiles.clear(),
      this.db.apps.clear(),
      this.db.reviews.clear(),
      this.db.installs.clear(),
      this.db.reports.clear(),
    ]);
    this.ready.set(false);
    await this.init();
  }
}
