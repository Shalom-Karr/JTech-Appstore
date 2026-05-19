import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { StoreService } from '../core/store.service';
import { ToastService } from '../core/toast.service';

/** Dummy login — pick a seed account or use the instant demo login. */
@Component({
  selector: 'jt-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-md mx-auto px-4 py-10 sm:py-14">
      <div class="jt-card p-6 sm:p-8">
        <h1 class="font-display text-2xl font-bold text-center">Log in</h1>
        <p class="text-muted text-sm text-center mt-1">
          Prototype login — no password needed.
        </p>

        <button class="jt-btn jt-btn-gold w-full mt-5" (click)="demoLogin()">
          ✨ Instant demo login
        </button>

        <div class="flex items-center gap-3 my-5 text-xs text-muted">
          <span class="flex-1 h-px bg-line"></span>OR<span class="flex-1 h-px bg-line"></span>
        </div>

        <form (ngSubmit)="login()" class="flex flex-col gap-3">
          <div>
            <label class="jt-label" for="id">Username or email</label>
            <input id="id" class="jt-input" placeholder="you" [ngModel]="identifier()" (ngModelChange)="identifier.set($event)" name="id" />
          </div>
          <div>
            <label class="jt-label" for="pw">Password</label>
            <input id="pw" type="password" class="jt-input" placeholder="(ignored in prototype)" name="pw" />
          </div>
          @if (error()) {
            <p class="text-bad text-sm">{{ error() }}</p>
          }
          <button type="submit" class="jt-btn jt-btn-primary w-full">Log in</button>
        </form>

        <p class="text-sm text-center mt-4 text-muted">
          No account? <a routerLink="/signup" class="text-brand font-medium hover:underline">Sign up</a>
        </p>
      </div>

      <div class="jt-card p-4 mt-4 text-sm">
        <div class="font-semibold mb-1">Demo accounts</div>
        <p class="text-muted text-xs mb-2">Click a username to log in as them — no password.</p>
        <div class="flex flex-wrap gap-2">
          @for (p of accounts(); track p.id) {
            <button
              (click)="loginAs(p.username)"
              class="text-xs bg-paper border border-line rounded px-2 py-1 hover:border-brand"
            >
              {{ p.username }}@if (p.role === 'admin') { <span class="text-gold-dark"> (admin)</span> }
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private store = inject(StoreService);
  private toast = inject(ToastService);
  private router = inject(Router);

  identifier = signal('');
  error = signal('');

  accounts = () => this.store.profiles();

  login() {
    const p = this.auth.login(this.identifier());
    if (p) {
      this.toast.success(`Welcome back, ${p.fullName}`);
      this.router.navigate(['/']);
    } else {
      this.error.set('No account found with that username or email.');
    }
  }

  loginAs(username: string) {
    this.identifier.set(username);
    this.login();
  }

  demoLogin() {
    const p = this.auth.loginAsDemo();
    if (p) {
      this.toast.success('Logged in as the demo developer');
      this.router.navigate(['/']);
    }
  }
}
