import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';

/** Dummy signup: creates a profile, no real validation. */
@Component({
  selector: 'jt-signup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-md mx-auto px-4 py-10 sm:py-14">
      <div class="jt-card p-6 sm:p-8">
        <h1 class="font-display text-2xl font-bold text-center">Create an account</h1>
        <p class="text-muted text-sm text-center mt-1">
          Join the JTech App Store to download and submit apps.
        </p>

        <form (ngSubmit)="signup()" class="flex flex-col gap-3 mt-5">
          <div>
            <label class="jt-label" for="username">Username</label>
            <input id="username" name="username" class="jt-input" placeholder="at least 3 characters"
              [ngModel]="username()" (ngModelChange)="username.set($event)" />
          </div>
          <div>
            <label class="jt-label" for="fullName">Full name</label>
            <input id="fullName" name="fullName" class="jt-input" placeholder="Your name"
              [ngModel]="fullName()" (ngModelChange)="fullName.set($event)" />
          </div>
          <div>
            <label class="jt-label" for="email">Email</label>
            <input id="email" name="email" type="email" class="jt-input" placeholder="you@example.com"
              [ngModel]="email()" (ngModelChange)="email.set($event)" />
          </div>
          <div>
            <label class="jt-label" for="pw">Password</label>
            <input id="pw" name="pw" type="password" class="jt-input" placeholder="(ignored in prototype)" />
          </div>
          @if (error()) {
            <p class="text-bad text-sm">{{ error() }}</p>
          }
          <button type="submit" class="jt-btn jt-btn-primary w-full">Sign up</button>
        </form>

        <p class="text-sm text-center mt-4 text-muted">
          Already have an account?
          <a routerLink="/login" class="text-brand font-medium hover:underline">Log in</a>
        </p>
      </div>
    </div>
  `,
})
export class SignupComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  username = signal('');
  fullName = signal('');
  email = signal('');
  error = signal('');

  async signup() {
    this.error.set('');
    const res = await this.auth.signup({
      username: this.username(),
      fullName: this.fullName(),
      email: this.email(),
    });
    if (res.ok) {
      this.toast.success(`Welcome to the JTech App Store, ${res.profile!.fullName}!`);
      this.router.navigate(['/']);
    } else {
      this.error.set(res.error ?? 'Could not create the account.');
    }
  }
}
