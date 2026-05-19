/**
 * Domain models for the JTech App Store.
 *
 * The store is built around a submission → review → publish workflow:
 * developers submit apps, admins approve or reject them, and approved apps
 * become downloadable by the community.
 */

export type UserRole = 'user' | 'admin';

/** Lifecycle of a submitted app. */
export type AppStatus =
  | 'pending' // submitted, waiting in the admin review queue
  | 'approved' // reviewed and live in the store
  | 'rejected' // reviewed and turned down (see rejectionReason)
  | 'suspended'; // was live, pulled by an admin

export type Platform = 'Web' | 'Android' | 'iOS' | 'Windows' | 'macOS';

export interface Profile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  /** Developer homepage / portfolio link. */
  website: string;
  email: string;
  role: UserRole;
  /** "Verified developer" trust badge. */
  verified: boolean;
  createdAt: string;
}

export interface AppItem {
  id: string;
  developerId: string;
  name: string;
  /** One-line pitch shown on cards. */
  tagline: string;
  description: string;
  iconUrl: string;
  screenshotUrls: string[];
  category: string;
  platform: Platform;
  version: string;
  /** Where the app is downloaded from (or launched, for web apps). */
  downloadUrl: string;
  sizeMb: number;
  status: AppStatus;
  /** Admin's note when status is 'rejected'. */
  rejectionReason: string;
  /** Hand-picked for the home page. */
  featured: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

/** A star review left on an app. */
export interface Review {
  id: string;
  appId: string;
  authorId: string;
  rating: number; // 1–5
  content: string;
  createdAt: string;
  /** The developer's public response to this review (empty if none). */
  developerReply: string;
  /** When the developer replied (empty if no reply). */
  replyAt: string;
}

/** A user's wishlist entry — apps they want to install later. */
export interface Wishlist {
  userId: string;
  appId: string;
  createdAt: string;
}

/** A record that a user downloaded / added an app to their library. */
export interface Install {
  userId: string;
  appId: string;
  installedAt: string;
  /** The app version the user has — compared against the live app to flag updates. */
  version: string;
}

/** A flag raised on an app — feeds the admin moderation queue. */
export interface Report {
  id: string;
  appId: string;
  reporterId: string;
  reason: string;
  detail: string;
  resolved: boolean;
  createdAt: string;
}

/** A derived, actionable alert shown in the navbar notifications dropdown. */
export interface Notification {
  icon: string;
  text: string;
  link: string;
}

/* ── catalog ─────────────────────────────────────────────────────────────── */
export interface Category {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'torah', name: 'Torah & Learning', icon: '📖', blurb: 'Gemara, Chumash & shiur tools' },
  { slug: 'tefilla', name: 'Tefilla & Davening', icon: '🙏', blurb: 'Siddurim, tehillim & brachos' },
  { slug: 'zmanim', name: 'Zmanim & Luach', icon: '🕯️', blurb: 'Zmanim, the Jewish calendar' },
  { slug: 'kids', name: 'Kids & Chinuch', icon: '🧒', blurb: 'Learning apps for children' },
  { slug: 'chesed', name: 'Tzedakah & Chesed', icon: '💝', blurb: 'Giving, gemachim & volunteering' },
  { slug: 'kosher', name: 'Kosher & Kashrus', icon: '🍽️', blurb: 'Hechsherim, recipes & Pesach' },
  { slug: 'music', name: 'Jewish Music', icon: '🎵', blurb: 'Niggunim, simcha & playlists' },
  { slug: 'productivity', name: 'Productivity', icon: '🛠️', blurb: 'Tools for home & work' },
  { slug: 'community', name: 'Community', icon: '🤝', blurb: 'Shul, neighborhood & news' },
  { slug: 'games', name: 'Games & Fun', icon: '🎮', blurb: 'Kosher games and trivia' },
];

export const PLATFORMS: Platform[] = ['Web', 'Android', 'iOS', 'Windows', 'macOS'];

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
export function categoryIcon(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.icon ?? '📦';
}

export const REPORT_REASONS = [
  'Inappropriate or non-kosher content',
  'Broken or malicious download',
  'Misleading description',
  'Wrong category',
  'Spam or duplicate',
  'Other',
];

/** Short random id — fine for a prototype with no real backend. */
export function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
