import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Site footer with cross-links and a prototype disclaimer. */
@Component({
  selector: 'jt-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-brand text-white/85 mt-16">
      <div class="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="font-display font-extrabold text-xl text-white mb-2">
            JTech<span class="text-gold">AppStore</span>
          </div>
          <p class="text-sm">
            The community app store for JTech — discover, submit, and download kosher apps built by
            the community.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-2">Store</h4>
          <ul class="space-y-1 text-sm">
            <li><a routerLink="/browse" class="hover:text-gold">Browse apps</a></li>
            <li><a routerLink="/library" class="hover:text-gold">My library</a></li>
            <li><a routerLink="/submit" class="hover:text-gold">Submit an app</a></li>
            <li><a routerLink="/about" class="hover:text-gold">About & guidelines</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-2">Account</h4>
          <ul class="space-y-1 text-sm">
            <li><a routerLink="/login" class="hover:text-gold">Log in</a></li>
            <li><a routerLink="/signup" class="hover:text-gold">Sign up</a></li>
            <li><a routerLink="/profile" class="hover:text-gold">My developer profile</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-2">Moderation</h4>
          <ul class="space-y-1 text-sm">
            <li><a routerLink="/admin" class="hover:text-gold">Admin review queue</a></li>
            <li><a routerLink="/about" class="hover:text-gold">Submission guidelines</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/15">
        <div class="max-w-7xl mx-auto px-4 py-4 text-xs flex flex-col sm:flex-row justify-between gap-2">
          <span>
            © 2026 JTech App Store · Built by
            <a href="https://shalomkarr.pages.dev" target="_blank" rel="noopener" class="text-gold hover:underline font-medium">Shalom Karr</a>
          </span>
          <span class="text-gold">⚠️ Prototype only — no real downloads or accounts. Data lives in your browser.</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
