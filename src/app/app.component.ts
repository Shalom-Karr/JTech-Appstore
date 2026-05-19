import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar.component';
import { FooterComponent } from './shared/footer.component';
import { ToastHostComponent } from './shared/toast-host.component';
import { StoreService } from './core/store.service';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastHostComponent],
  template: `
    <jt-navbar />
    <main class="min-h-[70vh]">
      @if (store.ready()) {
        <router-outlet />
      } @else {
        <div class="max-w-7xl mx-auto px-4 py-10">
          <div class="jt-skeleton h-44 rounded-xl mb-8"></div>
          <div class="jt-skeleton h-7 w-52 rounded mb-4"></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (n of [1, 2, 3, 4, 5, 6]; track n) {
              <div class="jt-card p-4 flex gap-3">
                <div class="jt-skeleton w-16 h-16 rounded-2xl shrink-0"></div>
                <div class="flex-1 space-y-2 py-1">
                  <div class="jt-skeleton h-4 w-3/4 rounded"></div>
                  <div class="jt-skeleton h-3 w-full rounded"></div>
                  <div class="jt-skeleton h-3 w-1/3 rounded"></div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </main>
    <jt-footer />
    <jt-toast-host />
  `,
})
export class AppComponent {
  store = inject(StoreService);
  private theme = inject(ThemeService);
}
