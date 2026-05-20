import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

/** Site footer with cross-links and a prototype disclaimer. */
@Component({
  selector: 'jt-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <footer class="bg-surface border-t border-line text-muted mt-16">
      <div class="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <img src="jtech-mark.png" alt="" class="w-8 h-8 rounded-lg" />
            <span class="font-display font-extrabold text-xl text-ink">
              JTech<span class="text-brand">AppStore</span>
            </span>
          </div>
          <p class="text-sm">
            The community app store for JTech. Discover, submit, and download kosher apps built by
            the community.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-ink mb-2">Store</h4>
          <ul class="space-y-1 text-sm">
            <li><a routerLink="/browse" class="hover:text-brand">Browse apps</a></li>
            <li><a routerLink="/library" class="hover:text-brand">My library</a></li>
            <li><a routerLink="/submit" class="hover:text-brand">Submit an app</a></li>
            <li><a routerLink="/about" class="hover:text-brand">About &amp; guidelines</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-ink mb-2">Account</h4>
          <ul class="space-y-1 text-sm">
            <li><a routerLink="/login" class="hover:text-brand">Log in</a></li>
            <li><a routerLink="/signup" class="hover:text-brand">Sign up</a></li>
            <li><a routerLink="/profile" class="hover:text-brand">My profile</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-ink mb-2">Moderation</h4>
          <ul class="space-y-1 text-sm">
            <li><a routerLink="/admin" class="hover:text-brand">Admin review queue</a></li>
            <li><a routerLink="/about" class="hover:text-brand">Submission guidelines</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-line">
        <div class="max-w-7xl mx-auto px-4 py-4 text-xs flex flex-col sm:flex-row justify-between gap-2">
          <span>
            © 2026 JTech App Store · Prototype · Built by
            <a
              href="https://shalomkarr.pages.dev"
              target="_blank"
              rel="noopener"
              class="text-brand font-semibold hover:underline"
              >Shalom Karr</a
            >
          </span>
          <span class="text-brand inline-flex items-center gap-1.5">
            <jt-icon name="alert" size="1em" /> Prototype only. No real downloads or accounts. Data lives in your browser.
          </span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
