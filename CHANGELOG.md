# Changelog

All notable changes to the JTech App Store prototype are documented here.

## [0.1.0] — 2026-05-19

Initial prototype release.

### Added

- Angular 19 single-page app with standalone components, signals, and lazy-loaded routes.
- JTech-branded TailwindCSS v4 theme (tekhelet blue, gold, Frank Ruhl Libre display font), responsive with a bottom tab bar on mobile.
- Dexie/IndexedDB persistence with a `StoreService` signal-mirror over the database, seeded with mock profiles, apps, reviews, installs, and reports.
- Dummy authentication: log in by username/email (no passwords), sign up to create a local profile, and an instant demo-login shortcut. Six demo accounts including `you` and `jtech_admin`.
- Submission → review → publish workflow: developers submit apps (`pending`), an admin approves (`approved`) or rejects (`rejected`, with written feedback), and editing an app re-submits it for review.
- Admin review queue and dashboard: approve/reject submissions, suspend live apps, feature apps, view open reports, and reset demo data.
- Community features: browse with search and category/platform/price filters and sorting, app detail pages with a screenshot lightbox, star reviews, downloads (counter + personal library), and app reporting.
- Pages: Home, Browse, App detail, Submit/Edit, My Library, Profile, Developer public page, Login, Signup, Admin, About.
- 10 community categories: Torah & Learning, Tefilla & Davening, Zmanim & Luach, Kids & Chinuch, Tzedakah & Chesed, Kosher & Kashrus, Jewish Music, Productivity, Community, Games & Fun.
- Automatic deployment to GitHub Pages via GitHub Actions on every push to `main`.

### Notes

- This is a **prototype only** — there is no real backend, accounts, downloads, or payments. All data lives in the browser and "downloads" only update a counter and library.
