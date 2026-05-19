import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar.component';
import { FooterComponent } from './shared/footer.component';
import { ToastHostComponent } from './shared/toast-host.component';
import { MobileNavComponent } from './shared/mobile-nav.component';
import { StoreService } from './core/store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastHostComponent, MobileNavComponent],
  template: `
    <jt-navbar />
    <main class="min-h-[70vh] pb-16 md:pb-0">
      @if (store.ready()) {
        <router-outlet />
      } @else {
        <div class="max-w-7xl mx-auto px-4 py-32 text-center text-muted">
          <div class="text-4xl mb-3 animate-pulse">📦</div>
          Loading the app store…
        </div>
      }
    </main>
    <jt-footer />
    <jt-mobile-nav />
    <jt-toast-host />
  `,
})
export class AppComponent {
  store = inject(StoreService);
}
