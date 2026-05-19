import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { AppItem } from '../core/models';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { TimeAgoPipe } from '../shared/pipes';

/** The signed-in user's downloaded apps. */
@Component({
  selector: 'jt-library',
  standalone: true,
  imports: [RouterLink, EmptyStateComponent, StatusBadgeComponent, TimeAgoPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="font-display text-2xl sm:text-3xl font-bold mb-1">My library</h1>
      <p class="text-muted mb-6">Apps you've downloaded from the JTech App Store.</p>

      @if (!auth.isLoggedIn()) {
        <jt-empty-state
          icon="🔒"
          title="Log in to see your library"
          message="Your downloaded apps are saved to your account."
          linkText="Log in"
          linkTo="/login"
        />
      } @else if (apps().length === 0) {
        <jt-empty-state
          icon="📚"
          title="Your library is empty"
          message="Browse the store and download an app to add it here."
          linkText="Browse apps"
          linkTo="/browse"
        />
      } @else {
        <div class="flex flex-col gap-3">
          @for (a of apps(); track a.id) {
            <div class="jt-card p-4 flex items-center gap-3">
              <a [routerLink]="['/app', a.id]" class="shrink-0">
                <img
                  [src]="a.iconUrl"
                  [alt]="a.name"
                  class="w-14 h-14 rounded-2xl object-cover border border-line"
                />
              </a>
              <div class="min-w-0 flex-1">
                <a [routerLink]="['/app', a.id]" class="font-semibold hover:text-brand truncate block">
                  {{ a.name }}
                </a>
                <div class="text-xs text-muted truncate">{{ a.tagline }}</div>
                <div class="text-xs text-muted mt-0.5">
                  v{{ a.version }} · added {{ installedAt(a) | timeAgo }}
                  @if (a.status !== 'approved') {
                    · <jt-status-badge [status]="a.status" />
                  }
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 shrink-0">
                <a [href]="a.downloadUrl" target="_blank" rel="noopener" class="jt-btn jt-btn-primary text-sm py-1.5 px-3">
                  Open
                </a>
                <button class="jt-btn jt-btn-ghost text-sm py-1.5 px-3" (click)="remove(a)">Remove</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class LibraryComponent {
  store = inject(StoreService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  apps = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.installedApps(u.id) : [];
  });

  installedAt(a: AppItem): string {
    const u = this.auth.currentUser();
    return u ? this.store.installedAt(u.id, a.id) : '';
  }

  async remove(a: AppItem) {
    const u = this.auth.currentUser();
    if (!u) return;
    await this.store.uninstall(u.id, a.id);
    this.toast.success(`Removed "${a.name}" from your library`);
  }
}
