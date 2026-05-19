# Architecture

Technical overview of the JTech App Store prototype. The app is an Angular 19 single-page app with no backend — an in-browser IndexedDB database is the entire data store.

## 🧱 Data models

Defined in `src/app/core/models.ts`. Five tables, persisted via Dexie (`src/app/core/db.service.ts`).

### `Profile`

A user / developer. `id`, `username`, `fullName`, `avatarUrl`, `bio`, `website`, `email`, `role` (`'user' | 'admin'`), `verified` (trust badge), `createdAt`. Indexed by `id`, `username`, `role`.

### `AppItem`

A submitted app. `id`, `developerId`, `name`, `tagline`, `description`, `iconUrl`, `screenshotUrls[]`, `category`, `platform` (`Web | Android | iOS | Windows | macOS`), `version`, `price` (USD; `0` = free), `downloadUrl`, `sizeMb`, `status`, `rejectionReason` (set when rejected), `featured`, `downloadCount`, `createdAt`, `updatedAt`. Indexed by `id`, `developerId`, `category`, `status`, `createdAt`.

The `status` field (`AppStatus`) drives the review workflow — see the state machine below.

### `Review`

A star review. `id`, `appId`, `authorId`, `rating` (1–5), `content`, `createdAt`. Indexed by `id`, `appId`, `authorId`. A user can leave one review per app.

### `Install`

A download / library record. Composite key `[userId, appId]`, plus `installedAt`. Indexed by `userId` and `appId`. Created when a user downloads an app while signed in.

### `Report`

A flag raised on an app, feeding admin moderation. `id`, `appId`, `reporterId`, `reason`, `detail`, `resolved`, `createdAt`. Indexed by `id`, `appId`, `reporterId`, `resolved`.

## 🗄️ Persistence — `DbService`

`DbService` extends `Dexie` and declares the schema (database name `jtech-appstore`, version 1). It is the raw IndexedDB layer. **Components never touch it directly** — they go through `StoreService`.

## 🔁 `StoreService` — the signal-mirror pattern

`StoreService` (`src/app/core/store.service.ts`) is the single source of truth components interact with. It keeps an **in-memory Angular signal mirror of every Dexie table**:

- `profiles`, `apps`, `reviews`, `installs`, `reports` — one `signal<T[]>` per table.
- `ready` — a signal that flips `true` once the initial load finishes.

**Read path:** components read the signals (and derived helpers like `publishedApps()`, `pendingApps()`, `appRating()`, `pendingCount`, `totalDownloads`) and get reactive updates for free.

**Write path:** every mutation method (`submitApp`, `updateApp`, `approveApp`, `download`, `addReview`, …) follows the same pattern:

1. Update the in-memory signal optimistically (`signal.update(...)`).
2. Write through to Dexie (`db.<table>.add/update/delete`).

This keeps the UI instant while persistence happens in the background. The two never diverge because every write goes through `StoreService`.

**Bootstrapping:** on construction `init()` runs. If `db.apps` is empty it seeds all five tables from `src/app/core/seed-data.ts` inside one transaction, then loads every table into the signals and sets `ready`. `resetData()` clears all tables and re-runs `init()` — wired to the admin dashboard's "Reset demo data" button. Writes from async callbacks are wrapped in `NgZone.run()` so change detection fires.

## 🔐 `AuthService` — dummy authentication

`AuthService` (`src/app/core/auth.service.ts`) simulates auth — **there are no passwords and no server**.

- The active user `id` is stored in `localStorage` (`jtech-appstore-session`) so the session survives a refresh.
- `currentUser` is a `computed` signal resolving the stored id against `StoreService.profiles()`; `isLoggedIn` and `isAdmin` derive from it.
- `login(identifier)` matches a profile by username **or** email — the password field is ignored.
- `loginAsDemo()` logs in as the bundled `you` developer (the instant-demo-login button).
- `signup(...)` creates a new `Profile` (validates only username length and uniqueness) and starts a session.
- `logout()` clears the stored id.

## 🧭 Routing

`src/app/app.routes.ts` — all routes are **lazy-loaded standalone components** under `src/app/pages/`.

| Path | Page |
| --- | --- |
| `` | Home |
| `browse` | Browse (search + filters) |
| `app/:id` | App detail |
| `submit` | Submit a new app |
| `edit/:id` | Edit an app (reuses `SubmitComponent`) |
| `library` | My Library |
| `profile` | My developer profile + my apps |
| `developer/:username` | Public developer page |
| `login` / `signup` | Dummy auth |
| `admin` | Admin review queue + dashboard |
| `about` | About |
| `**` | Redirect to `` |

There are no route guards — the admin page simply renders differently (or is gated in-component) based on `AuthService.isAdmin`.

## ⚙️ App review workflow — state machine

An `AppItem.status` (`AppStatus`) is one of: `pending`, `approved`, `rejected`, `suspended`. All transitions go through `StoreService` methods.

```
                 submitApp()
   (new app) ─────────────────▶ pending
                                  │
              approveApp()        │        rejectApp(reason)
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         │                         ▼
    approved ◀────────────────────┘                      rejected
        │  ▲                                                │
        │  │ approveApp()                      approveApp()  │
        │  └──────────────── suspended ◀───┐                 │
        │                      ▲           │                 │
        │      suspendApp()    │           └─────────────────┘
        └──────────────────────┘
```

Transition table:

| From | Event / method | To |
| --- | --- | --- |
| *(none)* | `submitApp()` | `pending` |
| `pending` | `approveApp()` | `approved` |
| `pending` | `rejectApp(reason)` | `rejected` (records `rejectionReason`) |
| `approved` | `suspendApp()` | `suspended` |
| `suspended` | `approveApp()` | `approved` |
| `rejected` | `approveApp()` | `approved` |
| *any* | `resubmitApp()` (developer edits the app) | `pending` (clears `rejectionReason`) |

Notes:

- `resubmitApp()` is called whenever a developer edits an app's content — any edit sends it back to the review queue.
- `approveApp()` and `resubmitApp()` clear `rejectionReason`; `rejectApp()` sets it.
- Only `approved` apps are returned by `publishedApps()` / `featuredApps()` and are therefore visible and downloadable by the community.
- `pendingApps()` feeds the admin review queue; `pendingCount` is a derived signal for the badge.
- `featured` is an independent boolean toggled by `setFeatured()` — it is orthogonal to `status` (only approved apps surface on the home page).
