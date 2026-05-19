import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { categoryIcon } from '../core/models';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { CountPipe } from '../shared/pipes';

/** The signed-in developer's profile editor and submitted apps. */
@Component({
  selector: 'jt-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, EmptyStateComponent, StatusBadgeComponent, CountPipe],
  template: `
    @if (auth.currentUser(); as u) {
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="flex items-center gap-4 mb-6">
          <img [src]="u.avatarUrl" alt="" class="w-20 h-20 rounded-full object-cover border border-line" />
          <div>
            <h1 class="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
              {{ u.fullName }}
              @if (u.verified) {
                <span class="text-xs bg-brand-light text-brand px-2 py-0.5 rounded font-medium">✓ Verified</span>
              }
            </h1>
            <div class="text-muted">&commat;{{ u.username }}</div>
            <a [routerLink]="['/developer', u.username]" class="text-sm text-brand hover:underline">
              View public developer page →
            </a>
          </div>
        </div>

        <!-- developer stats -->
        <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="jt-card p-4 text-center">
            <div class="font-display text-2xl font-bold text-brand">{{ myApps().length }}</div>
            <div class="text-xs text-muted">Apps submitted</div>
          </div>
          <div class="jt-card p-4 text-center">
            <div class="font-display text-2xl font-bold text-brand">{{ publishedCount() }}</div>
            <div class="text-xs text-muted">Published</div>
          </div>
          <div class="jt-card p-4 text-center">
            <div class="font-display text-2xl font-bold text-brand">{{ totalDownloads() | count }}</div>
            <div class="text-xs text-muted">Total downloads</div>
          </div>
        </div>

        <!-- edit profile -->
        <section class="mb-10">
          <h2 class="font-display text-xl font-bold mb-3">Developer profile</h2>
          <div class="jt-card p-5 flex flex-col gap-4">
            <div>
              <label class="jt-label" for="fullName">Full name</label>
              <input id="fullName" class="jt-input" [ngModel]="fullName()" (ngModelChange)="fullName.set($event)" />
            </div>
            <div>
              <label class="jt-label" for="bio">Bio</label>
              <textarea id="bio" rows="3" class="jt-input" [ngModel]="bio()" (ngModelChange)="bio.set($event)"></textarea>
            </div>
            <div>
              <label class="jt-label" for="website">Website</label>
              <input id="website" class="jt-input" placeholder="https://…" [ngModel]="website()" (ngModelChange)="website.set($event)" />
            </div>
            <div>
              <label class="jt-label" for="avatar">Avatar URL</label>
              <input id="avatar" class="jt-input" [ngModel]="avatarUrl()" (ngModelChange)="avatarUrl.set($event)" />
            </div>
            <button class="jt-btn jt-btn-primary self-start" (click)="save()">Save profile</button>
          </div>
        </section>

        <!-- my apps -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-display text-xl font-bold">My apps</h2>
            <a routerLink="/submit" class="jt-btn jt-btn-gold text-sm py-1.5">+ Submit app</a>
          </div>

          @if (myApps().length === 0) {
            <jt-empty-state
              icon="📦"
              title="You haven't submitted any apps"
              message="Share an app with the JTech community — it's free."
              linkText="Submit your first app"
              linkTo="/submit"
            />
          } @else {
            <div class="flex flex-col gap-3">
              @for (a of myApps(); track a.id) {
                <div class="jt-card p-4 flex items-center gap-3">
                  <a [routerLink]="['/app', a.id]" class="shrink-0">
                    <img [src]="a.iconUrl" [alt]="a.name" class="w-14 h-14 rounded-2xl object-cover border border-line" />
                  </a>
                  <div class="min-w-0 flex-1">
                    <a [routerLink]="['/app', a.id]" class="font-semibold hover:text-brand truncate block">
                      {{ categoryIcon(a.category) }} {{ a.name }}
                    </a>
                    <div class="text-xs text-muted truncate">{{ a.tagline }}</div>
                    <div class="mt-1 flex items-center gap-2 flex-wrap">
                      <jt-status-badge [status]="a.status" />
                      <span class="text-xs text-muted">⬇ {{ a.downloadCount | count }} · v{{ a.version }}</span>
                    </div>
                    @if (a.status === 'rejected' && a.rejectionReason) {
                      <p class="text-xs text-bad mt-1">Reviewer: {{ a.rejectionReason }}</p>
                    }
                  </div>
                  <a [routerLink]="['/edit', a.id]" class="jt-btn jt-btn-ghost text-sm py-1.5 px-3 shrink-0">Edit</a>
                </div>
              }
            </div>
          }
        </section>
      </div>
    } @else {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state
          icon="🔒"
          title="Log in to view your profile"
          linkText="Log in"
          linkTo="/login"
        />
      </div>
    }
  `,
})
export class ProfileComponent {
  store = inject(StoreService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  categoryIcon = categoryIcon;

  fullName = signal('');
  bio = signal('');
  website = signal('');
  avatarUrl = signal('');

  myApps = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.appsByDeveloper(u.id) : [];
  });
  publishedCount = computed(() => this.myApps().filter((a) => a.status === 'approved').length);
  totalDownloads = computed(() => this.myApps().reduce((n, a) => n + a.downloadCount, 0));

  constructor() {
    const u = this.auth.currentUser();
    if (u) {
      this.fullName.set(u.fullName);
      this.bio.set(u.bio);
      this.website.set(u.website);
      this.avatarUrl.set(u.avatarUrl);
    }
  }

  async save() {
    const u = this.auth.currentUser();
    if (!u) return;
    await this.store.updateProfile(u.id, {
      fullName: this.fullName().trim() || u.username,
      bio: this.bio().trim(),
      website: this.website().trim(),
      avatarUrl: this.avatarUrl().trim() || u.avatarUrl,
    });
    this.toast.success('Profile saved');
  }
}
