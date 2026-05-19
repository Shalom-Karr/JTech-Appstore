# Changelog

All notable changes to the JTech App Store prototype are documented here.

## [0.3.0] — 2026-05-19

Re-themed to match the JTech Marketplace design system.

### Added

- **Light / dark mode** — a `ThemeService` toggles a `.dark` class on `<html>`; the choice persists to localStorage. Toggle in the navbar (desktop and mobile).
- **Notifications** — a navbar bell with an unread-count badge and dropdown. `store.notificationsFor()` derives actionable alerts: apps needing changes, apps in review, new reviews on your apps, available library updates, and (for admins) the review-queue and report counts.
- **Skeleton loaders** — the initial load now shows shimmer placeholders instead of plain text.

### Changed

- Re-themed with the JTech identity: cyan brand accent, indigo secondary, card shadows, and surface tokens that re-point under dark mode.
- Navbar rebuilt to match the marketplace: desktop search, theme toggle, notifications bell, account menu, and a mobile hamburger menu with an inline search bar (replaces the bottom tab bar).
- App cards lift on hover and fall back to a placeholder when an icon fails to load.

## [0.2.0] — 2026-05-19

### Added

- **Update available** — installs now record the app version. My Library flags apps with a newer published version, shows the version delta, and offers per-app "Update" and "Update all" actions.
- **Today strip** — the home page shows the current Hebrew date alongside the Gregorian date (via the built-in `Intl` Hebrew calendar — no dependencies).

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
