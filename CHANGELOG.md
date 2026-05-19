# Changelog

All notable changes to the JTech App Store prototype are documented here.

## [0.4.0] — 2026-05-19

A free app store, plus a wave of community features.

### Changed

- **Removed all pricing** — the JTech App Store is free. The `price` field, the price filter, the submit-form price input, and the `PricePipe` are all gone; cards show platform instead.

### Added

- **Wishlist** — save apps for later (Dexie-backed); heart toggle on the app page, a "N wishlisted" social-proof count, and a dedicated `/wishlist` page.
- **Follow developers** — follow a developer from their app or profile page; followed-developer activity feeds the notifications bell. A "Developers I follow" list on your profile.
- **Review replies** — developers can publicly respond to reviews on their apps.
- **Recently viewed** — visited apps are tracked and surfaced in a home-page row.
- **Search autocomplete & saved searches** — name suggestions as you type on Browse, plus re-applyable saved filter chips.
- **Developer dashboard** — the profile page now shows average rating, reviews across your apps, and your follow list.
- **Admin analytics** — summary tiles, "apps by category" and "submissions per week" bar charts, CSV export, and a Verify/Unverify developer action.
- **Auto-moderation** — an app is automatically suspended once it collects 3 open reports, pending an admin decision.
- **Image upload** — drag-and-drop / file-picker upload for the app icon and screenshots on the submit form.
- **Home trust sections** — "Why JTech App Store" value props and community testimonials.

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
