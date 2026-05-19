# JTech App Store

A prototype community app marketplace for the frum / kosher-tech community — built for [JTech](https://jtechforums.org). Developers submit apps, a JTech admin reviews them, and the community browses, downloads, and reviews the approved ones.

> ⚠️ **Prototype only.** This is a front-end demo. There is **no real backend** — no real accounts, downloads, payments, or server. All data lives in your browser (IndexedDB) and is seeded with mock content. "Downloading" an app only bumps a counter and adds it to a local library.

## 🔗 Live demo

**https://shalom-karr.github.io/JTech-Appstore/**

## 🚀 Try it

Authentication is fully simulated — there are no passwords. Log in by entering one of the demo usernames below, or just press the **Instant demo login** button to sign in as `you`.

| Account | Role | Notes |
| --- | --- | --- |
| `you` | Developer | The bundled demo developer — used by the instant-login button |
| `jtech_admin` | Admin | Access to the review queue and admin dashboard |
| `moshe_codes` | Developer | Sample community developer |
| `shaindy_dev` | Developer | Sample community developer |
| `dovid_apps` | Developer | Sample community developer |
| `tova_builds` | Developer | Sample community developer |

You can also create a new account from the sign-up page — it just makes another local profile. Use **Reset demo data** on the admin dashboard to wipe the in-browser database and re-seed it.

## ✨ Features

- **Home** — featured apps, category tiles, and store stats.
- **Browse** — full-text search plus filters for category, platform, and price (free / paid), with sorting.
- **App detail** — screenshots with a lightbox, star reviews, download button, and a report form.
- **Submit / Edit app** — developers submit a new app or edit an existing one (editing re-submits it for review).
- **My Library** — apps the signed-in user has downloaded.
- **Profile** — the developer's own profile plus the apps they've submitted, with per-app status.
- **Developer page** — a public page for any developer and their published apps.
- **Admin review queue** — pending submissions to approve or reject (with written feedback), plus suspend / feature controls, open reports, and a data reset.
- **Login / Signup** — dummy auth with an instant demo-login shortcut.
- **About** — what the project is.
- 10 community-oriented categories: Torah & Learning, Tefilla & Davening, Zmanim & Luach, Kids & Chinuch, Tzedakah & Chesed, Kosher & Kashrus, Jewish Music, Productivity, Community, Games & Fun.
- **Responsive** layout with a bottom tab navigation bar on small screens.

## 🔄 The review workflow

Every app moves through a **submission → review → publish** lifecycle:

1. A developer submits an app. It is created with status **`pending`** and enters the admin review queue.
2. A JTech admin reviews it and either:
   - **Approves** it → status **`approved`**. The app goes live in the store and is downloadable.
   - **Rejects** it → status **`rejected`**, with a written `rejectionReason` shown to the developer.
3. An admin can **suspend** a live app → status **`suspended`** (pulled from the store), or **feature** an approved app on the home page.
4. Editing an app's content **re-submits** it: the status goes back to **`pending`** and it returns to the queue.

Only `approved` apps are visible to shoppers and downloadable.

## 🛠️ Tech stack

- **Angular 19** — standalone components, signals, lazy-loaded routes.
- **TypeScript**.
- **TailwindCSS v4** (via PostCSS) — JTech-branded theme: tekhelet blue `#1d3a8a`, gold `#d4a017`, Frank Ruhl Libre display font.
- **Dexie / IndexedDB** — in-browser persistence; the database *is* the data store.
- No backend, no server, no frameworks beyond Angular.

## 💻 Local development

```bash
npm install      # install dependencies
npm start        # dev server at http://localhost:4200/
npm run build    # production build → dist/jtech-appstore/browser
```

## 📁 Project structure

```
src/app/
  core/        models, db.service, store.service, auth.service, toast.service, seed-data
  shared/      navbar, footer, mobile-nav, app-card, status-badge, stars,
               empty-state, toast-host, dummy-switch, pipes
  pages/       home, browse, app-detail, submit, library, profile,
               developer, login, signup, admin, about
  app.routes.ts   lazy-loaded route table
  app.config.ts   application providers
```

- `core/models.ts` — domain types (`Profile`, `AppItem`, `Review`, `Install`, `Report`) and the category catalog.
- `core/db.service.ts` — the Dexie/IndexedDB layer.
- `core/store.service.ts` — signal-mirror store over Dexie; the only thing components read and mutate.
- `core/auth.service.ts` — dummy authentication.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a technical breakdown.

## 🌐 Deployment

The site is hosted on **GitHub Pages**. A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the app and deploys it automatically on every push to the `main` branch — no manual steps required.

## 📜 Changelog

See [`CHANGELOG.md`](CHANGELOG.md).

---

Built by Shalom Karr (https://shalomkarr.pages.dev)
