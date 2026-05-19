import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppItem, CATEGORIES, PLATFORMS, Platform } from '../core/models';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';

/** Submit a new app (/submit) or edit an existing one (/edit/:id). */
@Component({
  selector: 'jt-submit',
  standalone: true,
  imports: [FormsModule, EmptyStateComponent, StatusBadgeComponent],
  template: `
    @if (!auth.currentUser()) {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state
          icon="🔒"
          title="Log in to submit an app"
          message="You need an account to submit or edit an app on the JTech App Store."
          linkText="Log in"
          linkTo="/login"
        />
      </div>
    } @else if (editId() && !app()) {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state icon="🤷" title="App not found" linkText="Browse apps" linkTo="/browse" />
      </div>
    } @else if (editId() && !canEdit()) {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state
          icon="🚫"
          title="Not your app"
          message="You can only edit apps that you submitted."
          linkText="Browse apps"
          linkTo="/browse"
        />
      </div>
    } @else {
      <div class="max-w-2xl mx-auto px-4 py-8 sm:py-10">
        <h1 class="font-display text-2xl sm:text-3xl font-bold">
          {{ editId() ? 'Edit app' : 'Submit an app' }}
        </h1>
        <p class="text-muted mt-1 mb-5">
          {{
            editId()
              ? 'Saving changes will re-submit your app for admin review.'
              : 'Tell us about your app. A JTech admin reviews every submission before it goes live.'
          }}
        </p>

        @if (app(); as a) {
          @if (a.status === 'rejected' && a.rejectionReason) {
            <div class="jt-card border-bad p-4 mb-5">
              <div class="flex items-center gap-2 mb-1">
                <jt-status-badge status="rejected" />
                <span class="font-semibold text-sm">Reviewer feedback</span>
              </div>
              <p class="text-sm text-ink/90">{{ a.rejectionReason }}</p>
            </div>
          } @else if (a.status === 'pending') {
            <div class="jt-card p-4 mb-5 bg-gold-light">
              <jt-status-badge status="pending" />
              <span class="text-sm text-gold-dark ml-2">This app is currently in the review queue.</span>
            </div>
          }
        }

        <!-- review-process notice -->
        <div class="jt-card jt-mosaic p-4 mb-5 text-sm">
          <strong>🛡️ How review works:</strong> after you submit, your app appears in the admin
          queue with the status <em>In review</em>. An admin approves it (it goes live) or rejects
          it with feedback you'll see here.
        </div>

        <form class="jt-card p-5 sm:p-6 flex flex-col gap-5" (ngSubmit)="submit()">
          <div>
            <label class="jt-label" for="name">App name</label>
            <input id="name" name="name" class="jt-input" placeholder="e.g. Daf Companion" [(ngModel)]="name" />
          </div>

          <div>
            <label class="jt-label" for="tagline">Tagline</label>
            <input
              id="tagline"
              name="tagline"
              class="jt-input"
              placeholder="One line describing what your app does"
              [(ngModel)]="tagline"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="jt-label" for="category">Category</label>
              <select id="category" name="category" class="jt-input" [(ngModel)]="category">
                <option value="" disabled>Choose a category…</option>
                @for (c of categories; track c.slug) {
                  <option [value]="c.slug">{{ c.icon }} {{ c.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="jt-label" for="platform">Platform</label>
              <select id="platform" name="platform" class="jt-input" [(ngModel)]="platform">
                @for (p of platforms; track p) {
                  <option [value]="p">{{ p }}</option>
                }
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="jt-label" for="version">Version</label>
              <input id="version" name="version" class="jt-input" placeholder="1.0.0" [(ngModel)]="version" />
            </div>
            <div>
              <label class="jt-label" for="size">Size (MB)</label>
              <input id="size" name="size" type="number" min="0" step="1" class="jt-input" [(ngModel)]="sizeMb" />
            </div>
          </div>

          <div>
            <label class="jt-label" for="download">Download / launch URL</label>
            <input
              id="download"
              name="download"
              class="jt-input"
              placeholder="https://…"
              [(ngModel)]="downloadUrl"
            />
          </div>

          <div>
            <label class="jt-label" for="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              class="jt-input"
              placeholder="Describe your app, what it does, and who it's for."
              [(ngModel)]="description"
            ></textarea>
          </div>

          <div>
            <label class="jt-label" for="icon">App icon</label>
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 shrink-0 rounded-2xl bg-paper border border-line overflow-hidden flex items-center justify-center text-muted text-xl">
                @if (iconUrl().trim()) {
                  <img [src]="iconUrl()" alt="icon preview" class="w-full h-full object-cover" />
                } @else {
                  <span>📦</span>
                }
              </div>
              <div
                class="flex-1 rounded-xl border border-dashed border-line bg-surface-2 px-4 py-3 text-center text-sm text-muted cursor-pointer transition hover:border-ink/40 hover:bg-paper"
                [class.border-ink]="iconDragOver()"
                (click)="iconInput.click()"
                (dragover)="$event.preventDefault(); iconDragOver.set(true)"
                (dragleave)="iconDragOver.set(false)"
                (drop)="onIconDrop($event)"
              >
                Drag &amp; drop an image here, or <span class="text-ink underline">browse</span> (max 2 MB)
              </div>
              <input
                #iconInput
                type="file"
                accept="image/*"
                class="hidden"
                (change)="onIconPick($event)"
              />
            </div>
            <input
              id="icon"
              name="icon"
              class="jt-input mt-2"
              placeholder="…or paste an icon URL"
              [(ngModel)]="iconUrl"
            />
          </div>

          <div>
            <label class="jt-label">Screenshots</label>
            <div
              class="rounded-xl border border-dashed border-line bg-surface-2 px-4 py-4 text-center text-sm text-muted cursor-pointer transition hover:border-ink/40 hover:bg-paper mb-3"
              [class.border-ink]="shotDragOver()"
              (click)="shotInput.click()"
              (dragover)="$event.preventDefault(); shotDragOver.set(true)"
              (dragleave)="shotDragOver.set(false)"
              (drop)="onShotDrop($event)"
            >
              Drag &amp; drop images here, or <span class="text-ink underline">browse</span> (max 2 MB each)
            </div>
            <input
              #shotInput
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              (change)="onShotPick($event)"
            />
            <p class="text-xs text-muted mb-2">Or paste image URLs below.</p>
            <div class="flex flex-col gap-3">
              @for (url of screenshots(); track $index) {
                <div class="flex items-start gap-3">
                  <div class="w-16 h-12 shrink-0 rounded-md bg-paper border border-line overflow-hidden flex items-center justify-center text-muted">
                    @if (url.trim()) {
                      <img [src]="url" alt="preview" class="w-full h-full object-cover" />
                    } @else {
                      <span>🖼️</span>
                    }
                  </div>
                  <input
                    class="jt-input"
                    [name]="'shot-' + $index"
                    placeholder="https://…"
                    [ngModel]="url"
                    (ngModelChange)="setShot($index, $any($event))"
                  />
                  @if (screenshots().length > 1) {
                    <button type="button" class="jt-btn jt-btn-ghost shrink-0" (click)="removeShot($index)" aria-label="Remove">✕</button>
                  }
                </div>
              }
            </div>
            <button type="button" class="jt-btn jt-btn-ghost mt-3" (click)="addShot()">+ Add screenshot</button>
          </div>

          <label class="flex items-start gap-2 text-sm">
            <input type="checkbox" name="agree" [(ngModel)]="agree" class="mt-1" />
            <span>
              I confirm this app contains no inappropriate content, the download link works, and the
              details above are accurate.
            </span>
          </label>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <button type="submit" class="jt-btn jt-btn-primary" [disabled]="!valid()">
              {{ editId() ? 'Save & re-submit for review' : 'Submit for review' }}
            </button>
            @if (editId()) {
              <button type="button" class="jt-btn jt-btn-ghost ml-auto !text-bad" (click)="remove()">
                🗑️ Delete app
              </button>
            }
          </div>
        </form>
      </div>
    }
  `,
})
export class SubmitComponent {
  store = inject(StoreService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = CATEGORIES;
  platforms = PLATFORMS;

  readonly editId = signal<string | null>(this.route.snapshot.paramMap.get('id'));
  readonly app = computed<AppItem | undefined>(() => {
    const id = this.editId();
    return id ? this.store.appById(id) : undefined;
  });
  readonly canEdit = computed(() => {
    const a = this.app();
    const u = this.auth.currentUser();
    if (!a || !u) return false;
    return a.developerId === u.id || this.auth.isAdmin();
  });

  name = signal('');
  tagline = signal('');
  category = signal('');
  platform = signal<Platform>('Web');
  version = signal('1.0.0');
  sizeMb = signal(10);
  downloadUrl = signal('');
  description = signal('');
  iconUrl = signal('https://picsum.photos/seed/jt-new-app/512/512');
  screenshots = signal<string[]>(['https://picsum.photos/seed/jt-new-shot/900/560']);
  agree = signal(false);

  iconDragOver = signal(false);
  shotDragOver = signal(false);

  valid = computed(
    () =>
      this.name().trim().length > 0 &&
      this.tagline().trim().length > 0 &&
      this.category().trim().length > 0 &&
      this.description().trim().length > 0 &&
      this.downloadUrl().trim().length > 0 &&
      this.iconUrl().trim().length > 0 &&
      this.agree(),
  );

  constructor() {
    const a = this.app();
    if (a) {
      this.name.set(a.name);
      this.tagline.set(a.tagline);
      this.category.set(a.category);
      this.platform.set(a.platform);
      this.version.set(a.version);
      this.sizeMb.set(a.sizeMb);
      this.downloadUrl.set(a.downloadUrl);
      this.description.set(a.description);
      this.iconUrl.set(a.iconUrl);
      this.screenshots.set(a.screenshotUrls.length ? [...a.screenshotUrls] : ['']);
      this.agree.set(true);
    }
  }

  setShot(index: number, value: string) {
    this.screenshots.update((s) => s.map((u, i) => (i === index ? value : u)));
  }
  addShot() {
    this.screenshots.update((s) => [...s, '']);
  }
  removeShot(index: number) {
    this.screenshots.update((s) => s.filter((_, i) => i !== index));
  }

  private readFile(file: File): Promise<string> | null {
    if (!file.type.startsWith('image/')) {
      this.toast.error(`"${file.name}" is not an image.`);
      return null;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.toast.error(`"${file.name}" is larger than 2 MB.`);
      return null;
    }
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private async handleIconFile(file: File) {
    const p = this.readFile(file);
    if (!p) return;
    try {
      this.iconUrl.set(await p);
    } catch {
      this.toast.error('Could not read that image.');
    }
  }

  private async handleShotFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      const p = this.readFile(file);
      if (!p) continue;
      try {
        const url = await p;
        this.screenshots.update((s) => [...s.filter((u) => u.trim()), url]);
      } catch {
        this.toast.error('Could not read that image.');
      }
    }
  }

  onIconPick(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleIconFile(file);
    input.value = '';
  }
  onIconDrop(event: DragEvent) {
    event.preventDefault();
    this.iconDragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleIconFile(file);
  }
  onShotPick(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.handleShotFiles(input.files);
    input.value = '';
  }
  onShotDrop(event: DragEvent) {
    event.preventDefault();
    this.shotDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (files?.length) this.handleShotFiles(files);
  }

  private cleanShots(): string[] {
    return this.screenshots()
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
  }

  async submit() {
    if (!this.valid()) return;
    const user = this.auth.currentUser();
    if (!user) return;

    const fields = {
      name: this.name().trim(),
      tagline: this.tagline().trim(),
      description: this.description().trim(),
      iconUrl: this.iconUrl().trim(),
      screenshotUrls: this.cleanShots(),
      category: this.category(),
      platform: this.platform(),
      version: this.version().trim() || '1.0.0',
      downloadUrl: this.downloadUrl().trim(),
      sizeMb: Number(this.sizeMb()),
    };

    const id = this.editId();
    if (id && this.app()) {
      await this.store.resubmitApp(id, fields);
      this.toast.success('Saved — your app is back in the review queue.');
      this.router.navigate(['/profile']);
    } else {
      await this.store.submitApp({ developerId: user.id, ...fields });
      this.toast.success('Submitted! An admin will review your app shortly.');
      this.router.navigate(['/profile']);
    }
  }

  async remove() {
    const id = this.editId();
    if (!id) return;
    if (!window.confirm('Delete this app? This cannot be undone.')) return;
    await this.store.deleteApp(id);
    this.toast.success('App deleted');
    this.router.navigate(['/profile']);
  }
}
