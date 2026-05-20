import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';

/** About page: what the store is, the review process, and guidelines. */
@Component({
  selector: 'jt-about',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <h1 class="font-display text-3xl font-bold">About the JTech App Store</h1>
      <p class="text-muted mt-2">
        A prototype community app store for the JTech community
        (<a href="https://forums.jtechforums.org" target="_blank" rel="noopener" class="text-brand hover:underline">jtechforums.org</a>),
        the frum, kosher-tech crowd. Discover, submit, and download apps built by and for the
        community.
      </p>

      <div class="jt-card jt-mosaic p-4 mt-5 text-sm flex items-start gap-2">
        <span class="text-brand mt-0.5"><jt-icon name="alert" /></span>
        <span>
          <strong>Prototype, "Figma level".</strong> There is no real backend, no real downloads,
          and no real accounts. Everything runs in your browser; data is stored in IndexedDB and
          seeded with mock apps. "Downloads" only update a counter and your library.
        </span>
      </div>

      <h2 class="font-display text-2xl font-bold mt-8 mb-2">How review works</h2>
      <ol class="list-decimal pl-5 space-y-2 text-ink/90">
        <li><strong>Submit.</strong> A developer fills in the submission form. The app is created with the status <em>In review</em>.</li>
        <li><strong>Review.</strong> The app appears in the admin review queue. An admin previews it and either approves it or rejects it with written feedback.</li>
        <li><strong>Publish.</strong> Approved apps go live in the store and become downloadable by the whole community.</li>
        <li><strong>Moderate.</strong> Anyone can report a live app. Admins can suspend an app or act on reports at any time.</li>
        <li><strong>Update.</strong> Editing an app re-submits it for review, so changes are checked before they reach users.</li>
      </ol>

      <h2 class="font-display text-2xl font-bold mt-8 mb-2">Submission guidelines</h2>
      <ul class="list-disc pl-5 space-y-1.5 text-ink/90">
        <li>Apps must be appropriate for the frum community. No inappropriate or non-kosher content.</li>
        <li>The download or launch link must work and point to the real app.</li>
        <li>Link to the app's discussion thread on JTech Forums so users can talk to you.</li>
        <li>Describe your app accurately and pick the right category.</li>
        <li>No simulated gambling, deceptive ads, or mechanics designed to exploit users.</li>
        <li>Respect users' privacy. Don't collect more than your app needs.</li>
      </ul>

      <h2 class="font-display text-2xl font-bold mt-8 mb-2">Tech stack</h2>
      <ul class="list-disc pl-5 space-y-1.5 text-ink/90">
        <li><strong>Angular 19</strong>: standalone components, signals, lazy-loaded routes.</li>
        <li><strong>TypeScript</strong>: no backend.</li>
        <li><strong>TailwindCSS v4</strong>: JTech-branded theme (tekhelet blue + gold).</li>
        <li><strong>Dexie / IndexedDB</strong>: in-browser persistence, seeded with mock data.</li>
      </ul>

      <div class="flex flex-wrap gap-3 mt-8">
        <a routerLink="/browse" class="jt-btn jt-btn-primary">Browse apps</a>
        <a routerLink="/submit" class="jt-btn jt-btn-gold">Submit an app</a>
      </div>
    </div>
  `,
})
export class AboutComponent {}
