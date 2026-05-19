import { Injectable, computed, inject, signal } from '@angular/core';
import { StoreService } from './store.service';
import { Profile, uid } from './models';

const SESSION_KEY = 'jtech-appstore-session';

/**
 * Dummy authentication.
 *
 * There is no real auth — "log in" simply selects a profile and "sign up"
 * creates one. The active user id is kept in localStorage so the session
 * survives a refresh. No passwords are ever checked.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(StoreService);

  private readonly userId = signal<string | null>(localStorage.getItem(SESSION_KEY));

  /** The signed-in profile, or null. Recomputes once the store has loaded. */
  readonly currentUser = computed<Profile | null>(() => {
    const id = this.userId();
    if (!id) return null;
    return this.store.profileById(id) ?? null;
  });
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  /** Dummy login — matches by username or email, password ignored. */
  login(identifier: string): Profile | null {
    const id = identifier.trim().toLowerCase();
    const profile =
      this.store.profileByUsername(id) ??
      this.store.profiles().find((p) => p.email.toLowerCase() === id) ??
      null;
    if (profile) this.setSession(profile.id);
    return profile;
  }

  /** Quick demo login as the bundled `you` developer account. */
  loginAsDemo(): Profile | null {
    return this.login('you');
  }

  /** Dummy signup — creates a new profile, no validation beyond uniqueness. */
  async signup(input: {
    username: string;
    fullName: string;
    email: string;
  }): Promise<{ ok: boolean; error?: string; profile?: Profile }> {
    const username = input.username.trim().toLowerCase();
    if (username.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
    if (this.store.profileByUsername(username))
      return { ok: false, error: 'That username is taken.' };
    const profile: Profile = {
      id: uid('u-'),
      username,
      fullName: input.fullName.trim() || username,
      avatarUrl: `https://i.pravatar.cc/200?u=jtech-app-${username}`,
      bio: '',
      website: '',
      email: input.email.trim(),
      role: 'user',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    await this.store.addProfile(profile);
    this.setSession(profile.id);
    return { ok: true, profile };
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
    this.userId.set(null);
  }

  private setSession(id: string) {
    localStorage.setItem(SESSION_KEY, id);
    this.userId.set(id);
  }
}
