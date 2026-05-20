import { Component, computed, inject } from '@angular/core';
import { StoreService } from '../core/store.service';
import { AuthService } from '../core/auth.service';
import { AppCardComponent } from '../shared/app-card.component';
import { EmptyStateComponent } from '../shared/empty-state.component';

/** The signed-in user's wishlisted apps. */
@Component({
  selector: 'jt-wishlist',
  standalone: true,
  imports: [AppCardComponent, EmptyStateComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="font-display text-2xl sm:text-3xl font-bold mb-1">My wishlist</h1>
      <p class="text-muted mb-4">Apps you've saved to install later.</p>

      @if (!auth.currentUser()) {
        <jt-empty-state
          icon="lock"
          title="Log in to see your wishlist"
          message="Your saved apps are kept with your account."
          linkText="Log in"
          linkTo="/login"
        />
      } @else if (apps().length === 0) {
        <jt-empty-state
          icon="heart"
          title="Your wishlist is empty"
          message="Browse the store and tap the heart on any app to save it here."
          linkText="Browse apps"
          linkTo="/browse"
        />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (app of apps(); track app.id) {
            <jt-app-card [app]="app" />
          }
        </div>
      }
    </div>
  `,
})
export class WishlistComponent {
  store = inject(StoreService);
  auth = inject(AuthService);

  apps = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.store.wishlistedApps(u.id) : [];
  });
}
