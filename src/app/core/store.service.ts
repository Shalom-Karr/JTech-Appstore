import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { DbService } from './db.service';
import {
  AppItem,
  Install,
  Notification,
  Platform,
  Profile,
  Report,
  Wishlist,
  uid,
} from './models';
import {
  SEED_APPS,
  SEED_INSTALLS,
  SEED_PROFILES,
  SEED_REPORTS,
  SEED_WISHLIST,
} from './seed-data';

/** An app collects this many open reports before it is auto-suspended. */
const AUTO_SUSPEND_REPORTS = 3;
const FOLLOWS_KEY = 'jtech-appstore-follows';
const RECENT_KEY = 'jtech-appstore-recent';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private db = inject(DbService);
  private zone = inject(NgZone);

  readonly ready = signal(false);
  readonly profiles = signal<Profile[]>([]);
  readonly apps = signal<AppItem[]>([]);
  readonly installs = signal<Install[]>([]);
  readonly reports = signal<Report[]>([]);
  readonly wishlist = signal<Wishlist[]>([]);
  readonly followedDeveloperIds = signal<string[]>(this.loadList(FOLLOWS_KEY));
  readonly recentlyViewedIds = signal<string[]>(this.loadList(RECENT_KEY));

  constructor() {
    this.init();
  }

  private loadList(key: string): string[] {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]');
    } catch {
      return [];
    }
  }

  private async init() {
    try {
      if ((await this.db.apps.count()) === 0) {
        await this.db.transaction(
          'rw',
          [this.db.profiles, this.db.apps, this.db.installs, this.db.reports],
          async () => {
            await this.db.profiles.bulkAdd(SEED_PROFILES);
            await this.db.apps.bulkAdd(SEED_APPS);
            await this.db.installs.bulkAdd(SEED_INSTALLS);
            await this.db.reports.bulkAdd(SEED_REPORTS);
          },
        );
      }
      if ((await this.db.wishlist.count()) === 0) {
        await this.db.wishlist.bulkAdd(SEED_WISHLIST);
      }
      const [profiles, apps, installs, reports, wishlist] = await Promise.all([
        this.db.profiles.toArray(),
        this.db.apps.toArray(),
        this.db.installs.toArray(),
        this.db.reports.toArray(),
        this.db.wishlist.toArray(),
      ]);
      this.zone.run(() => {
        this.profiles.set(profiles);
        this.apps.set(apps);
        this.installs.set(installs);
        this.reports.set(reports);
        this.wishlist.set(wishlist);
        this.ready.set(true);
      });
    } catch (e) {
      console.error('Store init failed', e);
      this.zone.run(() => this.ready.set(true));
    }
  }

  /* profiles */
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
  async setVerified(id: string, verified: boolean) {
    await this.updateProfile(id, { verified });
  }

  /* apps: reads */
  appById(id: string): AppItem | undefined {
    return this.apps().find((a) => a.id === id);
  }
  appsByDeveloper(developerId: string): AppItem[] {
    return this.apps()
      .filter((a) => a.developerId === developerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  publishedApps(): AppItem[] {
    return this.apps().filter((a) => a.status === 'approved');
  }
  pendingApps(): AppItem[] {
    return this.apps()
      .filter((a) => a.status === 'pending')
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  featuredApps(): AppItem[] {
    return this.publishedApps().filter((a) => a.featured);
  }

  /* apps: developer mutations */
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
    downloadUrl: string;
    forumPostUrl: string;
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

  async resubmitApp(id: string, patch: Partial<AppItem>) {
    await this.updateApp(id, { ...patch, status: 'pending', rejectionReason: '' });
  }

  async deleteApp(id: string) {
    this.apps.update((all) => all.filter((a) => a.id !== id));
    this.installs.update((all) => all.filter((i) => i.appId !== id));
    this.wishlist.update((all) => all.filter((w) => w.appId !== id));
    await this.db.apps.delete(id);
    await this.db.installs.where('appId').equals(id).delete();
    await this.db.wishlist.where('appId').equals(id).delete();
  }

  /* apps: admin moderation */
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

  /* downloads / library */
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
  installedVersion(userId: string, appId: string): string {
    return this.installs().find((i) => i.userId === userId && i.appId === appId)?.version ?? '';
  }
  hasUpdate(userId: string, appId: string): boolean {
    const app = this.appById(appId);
    const installed = this.installs().find((i) => i.userId === userId && i.appId === appId);
    return !!app && !!installed && installed.version !== app.version;
  }

  async download(appId: string, userId: string | null) {
    const app = this.appById(appId);
    if (!app) return;
    await this.updateApp(appId, { downloadCount: app.downloadCount + 1 });
    if (!userId) return;
    const now = new Date().toISOString();
    if (this.isInstalled(userId, appId)) {
      this.installs.update((all) =>
        all.map((i) =>
          i.userId === userId && i.appId === appId
            ? { ...i, version: app.version, installedAt: now }
            : i,
        ),
      );
      await this.db.installs.update([userId, appId], { version: app.version, installedAt: now });
    } else {
      const install: Install = { userId, appId, installedAt: now, version: app.version };
      this.installs.update((all) => [...all, install]);
      await this.db.installs.add(install);
    }
  }

  async uninstall(userId: string, appId: string) {
    this.installs.update((all) => all.filter((i) => !(i.userId === userId && i.appId === appId)));
    await this.db.installs.delete([userId, appId]);
  }

  /* wishlist */
  isWishlisted(userId: string, appId: string): boolean {
    return this.wishlist().some((w) => w.userId === userId && w.appId === appId);
  }
  wishlistedApps(userId: string): AppItem[] {
    const ids = new Set(
      this.wishlist()
        .filter((w) => w.userId === userId)
        .map((w) => w.appId),
    );
    return this.apps().filter((a) => ids.has(a.id));
  }
  wishlistCount(appId: string): number {
    return this.wishlist().filter((w) => w.appId === appId).length;
  }
  async toggleWishlist(userId: string, appId: string) {
    if (this.isWishlisted(userId, appId)) {
      this.wishlist.update((all) => all.filter((w) => !(w.userId === userId && w.appId === appId)));
      await this.db.wishlist.delete([userId, appId]);
    } else {
      const entry: Wishlist = { userId, appId, createdAt: new Date().toISOString() };
      this.wishlist.update((all) => [...all, entry]);
      await this.db.wishlist.add(entry);
    }
  }

  /* follow developers (localStorage) */
  isFollowing(developerId: string): boolean {
    return this.followedDeveloperIds().includes(developerId);
  }
  followedDevelopers(): Profile[] {
    const ids = new Set(this.followedDeveloperIds());
    return this.profiles().filter((p) => ids.has(p.id));
  }
  toggleFollow(developerId: string) {
    const next = this.isFollowing(developerId)
      ? this.followedDeveloperIds().filter((id) => id !== developerId)
      : [...this.followedDeveloperIds(), developerId];
    this.followedDeveloperIds.set(next);
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(next));
  }

  /* recently viewed (localStorage) */
  trackView(appId: string) {
    const next = [appId, ...this.recentlyViewedIds().filter((id) => id !== appId)].slice(0, 12);
    this.recentlyViewedIds.set(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }
  recentlyViewedApps(): AppItem[] {
    return this.recentlyViewedIds()
      .map((id) => this.appById(id))
      .filter((a): a is AppItem => !!a && a.status === 'approved');
  }

  /* reports (moderation) */
  allReports(): Report[] {
    return [...this.reports()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  openReports(): Report[] {
    return this.allReports().filter((r) => !r.resolved);
  }
  openReportsFor(appId: string): Report[] {
    return this.openReports().filter((r) => r.appId === appId);
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
    const app = this.appById(input.appId);
    if (app && app.status === 'approved' && this.openReportsFor(input.appId).length >= AUTO_SUSPEND_REPORTS) {
      await this.suspendApp(input.appId);
    }
  }
  async resolveReport(id: string) {
    this.reports.update((all) => all.map((r) => (r.id === id ? { ...r, resolved: true } : r)));
    await this.db.reports.update(id, { resolved: true });
  }

  /* notifications (derived) */
  notificationsFor(userId: string): Notification[] {
    const out: Notification[] = [];
    const profile = this.profileById(userId);
    const myApps = this.appsByDeveloper(userId);
    const weekAgo = Date.now() - 7 * 864e5;

    for (const a of myApps) {
      if (a.status === 'rejected') {
        out.push({ icon: 'close', text: `"${a.name}" needs changes before it can go live.`, link: `/edit/${a.id}` });
      } else if (a.status === 'pending') {
        out.push({ icon: 'clock', text: `"${a.name}" is waiting in the review queue.`, link: `/app/${a.id}` });
      } else if (a.status === 'suspended') {
        out.push({ icon: 'ban', text: `"${a.name}" was suspended by an admin.`, link: `/app/${a.id}` });
      }
    }

    for (const dev of this.followedDevelopers()) {
      for (const a of this.appsByDeveloper(dev.id)) {
        if (a.status === 'approved' && new Date(a.createdAt).getTime() > weekAgo) {
          out.push({ icon: 'rocket', text: `${dev.fullName} published "${a.name}".`, link: `/app/${a.id}` });
        }
      }
    }

    const updates = this.installs().filter((i) => i.userId === userId && this.hasUpdate(userId, i.appId));
    if (updates.length) {
      out.push({
        icon: 'refresh',
        text: `${updates.length} app${updates.length === 1 ? '' : 's'} in your library can be updated.`,
        link: '/library',
      });
    }

    if (profile?.role === 'admin') {
      const pending = this.pendingApps().length;
      if (pending) {
        out.push({ icon: 'inbox', text: `${pending} app${pending === 1 ? '' : 's'} awaiting review.`, link: '/admin' });
      }
      const reports = this.openReports().length;
      if (reports) {
        out.push({ icon: 'flag', text: `${reports} open report${reports === 1 ? '' : 's'} to review.`, link: '/admin' });
      }
    }

    return out;
  }

  /* derived totals */
  readonly pendingCount = computed(() => this.apps().filter((a) => a.status === 'pending').length);
  readonly totalDownloads = computed(() =>
    this.apps().reduce((n, a) => n + a.downloadCount, 0),
  );

  async resetData() {
    await Promise.all([
      this.db.profiles.clear(),
      this.db.apps.clear(),
      this.db.installs.clear(),
      this.db.reports.clear(),
      this.db.wishlist.clear(),
    ]);
    localStorage.removeItem(FOLLOWS_KEY);
    localStorage.removeItem(RECENT_KEY);
    this.followedDeveloperIds.set([]);
    this.recentlyViewedIds.set([]);
    this.ready.set(false);
    await this.init();
  }
}
