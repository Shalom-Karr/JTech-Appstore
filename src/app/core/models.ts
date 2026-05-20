import type { IconName } from '../shared/icon.component';

/**
 * Domain models for the JTech App Store.
 *
 * The store is built around a submission, review, publish workflow:
 * developers submit apps, admins approve or reject them, and approved apps
 * become downloadable by the community.
 */

export type UserRole = 'user' | 'admin';

/** Lifecycle of a submitted app. */
export type AppStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type Platform = 'Web' | 'Android' | 'iOS' | 'Windows' | 'macOS';

export interface Profile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  website: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}

export interface AppItem {
  id: string;
  developerId: string;
  name: string;
  tagline: string;
  description: string;
  iconUrl: string;
  screenshotUrls: string[];
  category: string;
  platform: Platform;
  version: string;
  downloadUrl: string;
  /** Link back to the app's discussion post on jtechforums.org. */
  forumPostUrl: string;
  sizeMb: number;
  status: AppStatus;
  rejectionReason: string;
  featured: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  userId: string;
  appId: string;
  createdAt: string;
}

export interface Install {
  userId: string;
  appId: string;
  installedAt: string;
  version: string;
}

export interface Report {
  id: string;
  appId: string;
  reporterId: string;
  reason: string;
  detail: string;
  resolved: boolean;
  createdAt: string;
}

export interface Notification {
  icon: IconName;
  text: string;
  link: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: IconName;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'torah', name: 'Torah & Learning', icon: 'book', blurb: 'Gemara, Chumash & shiur tools' },
  { slug: 'tefilla', name: 'Tefilla & Davening', icon: 'hands-praying', blurb: 'Siddurim, tehillim & brachos' },
  { slug: 'zmanim', name: 'Zmanim & Luach', icon: 'candle', blurb: 'Zmanim, the Jewish calendar' },
  { slug: 'kids', name: 'Kids & Chinuch', icon: 'baby', blurb: 'Learning apps for children' },
  { slug: 'chesed', name: 'Tzedakah & Chesed', icon: 'gift', blurb: 'Giving, gemachim & volunteering' },
  { slug: 'kosher', name: 'Kosher & Kashrus', icon: 'utensils', blurb: 'Hechsherim, recipes & Pesach' },
  { slug: 'music', name: 'Jewish Music', icon: 'music', blurb: 'Niggunim, simcha & playlists' },
  { slug: 'productivity', name: 'Productivity', icon: 'wrench', blurb: 'Tools for home & work' },
  { slug: 'community', name: 'Community', icon: 'handshake', blurb: 'Shul, neighborhood & news' },
  { slug: 'games', name: 'Games & Fun', icon: 'gamepad', blurb: 'Kosher games and trivia' },
];

export const PLATFORMS: Platform[] = ['Web', 'Android', 'iOS', 'Windows', 'macOS'];

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
export function categoryIcon(slug: string): IconName {
  return CATEGORIES.find((c) => c.slug === slug)?.icon ?? 'package';
}

export const REPORT_REASONS = [
  'Inappropriate or non-kosher content',
  'Broken or malicious download',
  'Misleading description',
  'Wrong category',
  'Spam or duplicate',
  'Other',
];

export function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
