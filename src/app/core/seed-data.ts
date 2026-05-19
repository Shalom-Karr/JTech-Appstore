import { AppItem, Install, Platform, Profile, Report, Review } from './models';

/**
 * Mock seed data for the prototype. Loaded into IndexedDB on first run.
 * `u-you` is the demo developer account the dummy login signs you into.
 */

const icon = (seed: string) => `https://picsum.photos/seed/jt-icon-${seed}/512/512`;
const shot = (seed: string, n: number) => `https://picsum.photos/seed/jt-${seed}-${n}/900/560`;
const shots = (seed: string) => [shot(seed, 1), shot(seed, 2), shot(seed, 3)];
const avatar = (u: string) => `https://i.pravatar.cc/200?u=jtech-app-${u}`;

export const SEED_PROFILES: Profile[] = [
  {
    id: 'u-you',
    username: 'you',
    fullName: 'Demo Developer',
    avatarUrl: avatar('you'),
    bio: 'This is your demo account. Submit apps, download, review — it all persists in your browser.',
    website: 'https://forums.jtechforums.org',
    email: 'demo@jtechappstore.test',
    role: 'user',
    verified: true,
    createdAt: '2026-01-04T12:00:00Z',
  },
  {
    id: 'u-admin',
    username: 'jtech_admin',
    fullName: 'JTech Admin',
    avatarUrl: avatar('admin'),
    bio: 'Reviewing submissions and keeping the store kosher and clean.',
    website: 'https://forums.jtechforums.org',
    email: 'admin@jtechappstore.test',
    role: 'admin',
    verified: true,
    createdAt: '2025-12-01T09:00:00Z',
  },
  {
    id: 'u-moshe',
    username: 'moshe_codes',
    fullName: 'Moshe Feldman',
    avatarUrl: avatar('moshe'),
    bio: 'Building Torah-learning tools since the flip-phone era. Lakewood, NJ.',
    website: 'https://moshecodes.test',
    email: 'moshe@example.test',
    role: 'user',
    verified: true,
    createdAt: '2025-12-15T10:30:00Z',
  },
  {
    id: 'u-shaindy',
    username: 'shaindy_dev',
    fullName: 'Shaindy Klein',
    avatarUrl: avatar('shaindy'),
    bio: 'Front-end developer. I make davening and music apps that feel calm to use.',
    website: 'https://shaindy.test',
    email: 'shaindy@example.test',
    role: 'user',
    verified: true,
    createdAt: '2026-01-02T08:00:00Z',
  },
  {
    id: 'u-dovid',
    username: 'dovid_apps',
    fullName: 'Dovid Stern',
    avatarUrl: avatar('dovid'),
    bio: 'Zmanim, calendars, and the occasional productivity tool.',
    website: '',
    email: 'dovid@example.test',
    role: 'user',
    verified: false,
    createdAt: '2026-01-20T14:00:00Z',
  },
  {
    id: 'u-tova',
    username: 'tova_builds',
    fullName: 'Tova Reich',
    avatarUrl: avatar('tova'),
    bio: 'Chinuch software for the next generation. Monsey, NY.',
    website: 'https://tovabuilds.test',
    email: 'tova@example.test',
    role: 'user',
    verified: true,
    createdAt: '2026-02-05T11:15:00Z',
  },
];

interface SeedApp {
  id: string;
  dev: string;
  name: string;
  tagline: string;
  description: string;
  seed: string;
  category: string;
  platform: Platform;
  version: string;
  price: number;
  sizeMb: number;
  status: AppItem['status'];
  rejectionReason?: string;
  featured?: boolean;
  downloadCount: number;
  created: string;
}

const RAW: SeedApp[] = [
  {
    id: 'app-dafconnect',
    dev: 'u-moshe',
    name: 'DafConnect',
    tagline: 'Daf Yomi with synced audio shiurim and notes',
    description:
      'Follow the daily Daf with a clean, distraction-free reader. DafConnect syncs the text to a library of audio shiurim, lets you bookmark and annotate each amud, and keeps a streak of every daf you complete. Built for the JTech community — no ads, no tracking, fully offline-capable.',
    seed: 'dafconnect',
    category: 'torah',
    platform: 'Android',
    version: '3.2.0',
    price: 0,
    sizeMb: 28,
    status: 'approved',
    featured: true,
    downloadCount: 4120,
    created: '2026-01-22T09:00:00Z',
  },
  {
    id: 'app-siddurplus',
    dev: 'u-shaindy',
    name: 'Siddur Plus',
    tagline: 'A calm, beautiful siddur for every tefilla',
    description:
      'Siddur Plus brings Nusach Ashkenaz, Sefard, and Edot Hamizrach into one elegant app. Large, readable type, automatic zmanim-aware tefilla selection, and a night mode for Maariv. Tehillim, brachos, and bentching included.',
    seed: 'siddurplus',
    category: 'tefilla',
    platform: 'iOS',
    version: '2.1.4',
    price: 0,
    sizeMb: 41,
    status: 'approved',
    featured: true,
    downloadCount: 8730,
    created: '2026-01-28T13:30:00Z',
  },
  {
    id: 'app-zmanimlive',
    dev: 'u-dovid',
    name: 'Zmanim Live',
    tagline: 'Accurate zmanim for your exact location',
    description:
      'Zmanim Live calculates alos, neitz, sof zman krias shema, mincha, shkia, and tzeis for wherever you are — down to your street. Add multiple cities, get a candle-lighting reminder before Shabbos, and share zmanim with one tap.',
    seed: 'zmanimlive',
    category: 'zmanim',
    platform: 'Web',
    version: '4.0.1',
    price: 0,
    sizeMb: 6,
    status: 'approved',
    featured: true,
    downloadCount: 12450,
    created: '2026-02-03T10:00:00Z',
  },
  {
    id: 'app-alephbais',
    dev: 'u-tova',
    name: 'Aleph Bais Kids',
    tagline: 'Playful Hebrew reading for ages 3–7',
    description:
      'Aleph Bais Kids turns learning the letters into a game. Trace each os, hear its sound, and build first words with friendly characters. Parent-controlled, screen-time aware, and entirely kosher — no third-party ads or links.',
    seed: 'alephbais',
    category: 'kids',
    platform: 'Android',
    version: '1.5.0',
    price: 4,
    sizeMb: 64,
    status: 'approved',
    downloadCount: 2310,
    created: '2026-02-12T08:45:00Z',
  },
  {
    id: 'app-tzedakah',
    dev: 'u-you',
    name: 'Tzedakah Tracker',
    tagline: 'Give maaser with intention and keep a record',
    description:
      'Tzedakah Tracker helps you calculate maaser kesafim, log every donation, and set aside giving automatically. Year-end summaries make tax time simple, and a goals view keeps your giving on track all year.',
    seed: 'tzedakah',
    category: 'chesed',
    platform: 'Web',
    version: '1.2.0',
    price: 0,
    sizeMb: 5,
    status: 'approved',
    downloadCount: 1890,
    created: '2026-02-18T16:20:00Z',
  },
  {
    id: 'app-koshercheck',
    dev: 'u-moshe',
    name: 'KosherCheck',
    tagline: 'Scan a hechsher, know in a second',
    description:
      'Point your camera at a product and KosherCheck identifies the hechsher and shows its certifying agency, reliability notes, and any community alerts. Includes a searchable directory of hundreds of symbols.',
    seed: 'koshercheck',
    category: 'kosher',
    platform: 'iOS',
    version: '2.0.0',
    price: 2,
    sizeMb: 33,
    status: 'approved',
    downloadCount: 5640,
    created: '2026-02-24T12:00:00Z',
  },
  {
    id: 'app-niggunbox',
    dev: 'u-shaindy',
    name: 'Niggun Box',
    tagline: 'A library of niggunim for every moment',
    description:
      'Niggun Box collects hundreds of niggunim — slow, lively, and Yom Tov — into curated playlists. Download for offline listening, build a simcha set, and discover new music from Jewish artists every week.',
    seed: 'niggunbox',
    category: 'music',
    platform: 'Android',
    version: '1.8.2',
    price: 0,
    sizeMb: 22,
    status: 'approved',
    downloadCount: 3470,
    created: '2026-03-01T09:30:00Z',
  },
  {
    id: 'app-sederflow',
    dev: 'u-dovid',
    name: 'SederFlow',
    tagline: 'Plan your day around tefilla and learning',
    description:
      'SederFlow is a planner built for a yeshiva and working schedule. Block sedarim, set learning goals, and let the app shift your tasks around minyan times automatically.',
    seed: 'sederflow',
    category: 'productivity',
    platform: 'Windows',
    version: '0.9.6',
    price: 0,
    sizeMb: 48,
    status: 'approved',
    downloadCount: 980,
    created: '2026-03-09T11:00:00Z',
  },
  {
    id: 'app-shulboard',
    dev: 'u-tova',
    name: 'ShulBoard',
    tagline: 'Your shul’s minyanim, shiurim and news',
    description:
      'ShulBoard puts the whole shul calendar in one place: minyan times, shiurim, simcha announcements, and the weekly bulletin. Gabbaim post updates; members get a notification.',
    seed: 'shulboard',
    category: 'community',
    platform: 'Web',
    version: '2.3.0',
    price: 0,
    sizeMb: 7,
    status: 'approved',
    downloadCount: 2740,
    created: '2026-03-15T14:45:00Z',
  },
  {
    id: 'app-parshaquiz',
    dev: 'u-you',
    name: 'Parsha Quiz',
    tagline: 'Test your parsha knowledge at the Shabbos table',
    description:
      'A friendly trivia game on the weekly parsha. Play solo or pass-and-play with the whole family, choose your difficulty, and learn a new pshat with every question.',
    seed: 'parshaquiz',
    category: 'games',
    platform: 'Android',
    version: '1.1.0',
    price: 0,
    sizeMb: 19,
    status: 'approved',
    downloadCount: 4060,
    created: '2026-03-22T10:10:00Z',
  },
  {
    id: 'app-tehillim',
    dev: 'u-moshe',
    name: 'Tehillim Together',
    tagline: 'Split a sefer Tehillim with your group',
    description:
      'Tehillim Together coordinates group Tehillim for a refuah or any occasion. Create a group, claim your perakim, and watch the sefer complete in real time.',
    seed: 'tehillim',
    category: 'tefilla',
    platform: 'Web',
    version: '1.4.1',
    price: 0,
    sizeMb: 4,
    status: 'approved',
    downloadCount: 6210,
    created: '2026-03-30T08:00:00Z',
  },
  {
    id: 'app-luachwidget',
    dev: 'u-shaindy',
    name: 'Luach Widget',
    tagline: 'The Jewish date and zmanim on your home screen',
    description:
      'A beautiful home-screen widget showing today’s Hebrew date, the parsha, the daf, and the next zman. Several sizes and themes to match your device.',
    seed: 'luachwidget',
    category: 'zmanim',
    platform: 'iOS',
    version: '1.0.3',
    price: 1,
    sizeMb: 12,
    status: 'approved',
    downloadCount: 1530,
    created: '2026-04-06T13:00:00Z',
  },
  {
    id: 'app-mishnayomi',
    dev: 'u-dovid',
    name: 'Mishna Yomi',
    tagline: 'Two mishnayos a day, beautifully presented',
    description:
      'Mishna Yomi follows the daily cycle with the text, a clear English explanation, and an optional audio reading. Keep a streak and review past days.',
    seed: 'mishnayomi',
    category: 'torah',
    platform: 'Android',
    version: '1.0.0',
    price: 0,
    sizeMb: 26,
    status: 'pending',
    downloadCount: 0,
    created: '2026-05-12T09:20:00Z',
  },
  {
    id: 'app-cholhamoed',
    dev: 'u-tova',
    name: 'Chol Hamoed Planner',
    tagline: 'Find kosher trips and outings for Yom Tov',
    description:
      'Plan a Chol Hamoed everyone will enjoy: a directory of family-friendly trips, opening times, kosher food nearby, and a shareable itinerary.',
    seed: 'cholhamoed',
    category: 'productivity',
    platform: 'Web',
    version: '0.8.0',
    price: 0,
    sizeMb: 9,
    status: 'pending',
    downloadCount: 0,
    created: '2026-05-15T15:40:00Z',
  },
  {
    id: 'app-gemachfinder',
    dev: 'u-you',
    name: 'Gemach Finder',
    tagline: 'Locate the gemach you need, right now',
    description:
      'A community directory of gemachim — from medical equipment to simcha supplies. Search by category and neighborhood, see hours, and get directions.',
    seed: 'gemachfinder',
    category: 'chesed',
    platform: 'Android',
    version: '1.0.0',
    price: 0,
    sizeMb: 15,
    status: 'pending',
    downloadCount: 0,
    created: '2026-05-17T11:05:00Z',
  },
  {
    id: 'app-coinflip',
    dev: 'u-dovid',
    name: 'CoinFlip Arcade',
    tagline: 'Spin, bet, and win big!',
    description:
      'A casino-style arcade with slots and card games and in-app coin purchases.',
    seed: 'coinflip',
    category: 'games',
    platform: 'Android',
    version: '1.0.0',
    price: 0,
    sizeMb: 55,
    status: 'rejected',
    rejectionReason:
      'Simulated gambling and in-app purchase mechanics are not a fit for the JTech App Store. We would welcome a resubmission with the gambling elements removed.',
    downloadCount: 0,
    created: '2026-05-08T10:00:00Z',
  },
  {
    id: 'app-oldbentcher',
    dev: 'u-dovid',
    name: 'Pocket Bentcher (legacy)',
    tagline: 'Bentching and zemiros for Shabbos',
    description:
      'A simple bentcher with Birkas Hamazon, Shabbos zemiros, and Sheva Brachos.',
    seed: 'oldbentcher',
    category: 'tefilla',
    platform: 'Android',
    version: '0.4.0',
    price: 0,
    sizeMb: 11,
    status: 'suspended',
    downloadCount: 740,
    created: '2026-01-10T09:00:00Z',
  },
];

export const SEED_APPS: AppItem[] = RAW.map((a) => ({
  id: a.id,
  developerId: a.dev,
  name: a.name,
  tagline: a.tagline,
  description: a.description,
  iconUrl: icon(a.seed),
  screenshotUrls: shots(a.seed),
  category: a.category,
  platform: a.platform,
  version: a.version,
  price: a.price,
  downloadUrl: `https://downloads.jtechappstore.test/${a.seed}`,
  sizeMb: a.sizeMb,
  status: a.status,
  rejectionReason: a.rejectionReason ?? '',
  featured: a.featured ?? false,
  downloadCount: a.downloadCount,
  createdAt: a.created,
  updatedAt: a.created,
}));

const review = (
  id: string,
  appId: string,
  authorId: string,
  rating: number,
  content: string,
  createdAt: string,
): Review => ({ id, appId, authorId, rating, content, createdAt });

export const SEED_REVIEWS: Review[] = [
  review('rv-1', 'app-dafconnect', 'u-you', 5, 'The synced shiurim are a game-changer for my commute. My streak is at 90 daf!', '2026-03-02T08:00:00Z'),
  review('rv-2', 'app-dafconnect', 'u-tova', 4, 'Beautiful reader. Would love a tablet layout.', '2026-03-18T19:30:00Z'),
  review('rv-3', 'app-siddurplus', 'u-moshe', 5, 'Finally a siddur that picks the right tefilla automatically. The night mode is perfect for Maariv.', '2026-02-10T21:00:00Z'),
  review('rv-4', 'app-siddurplus', 'u-dovid', 5, 'Clean and fast. Nusach Sefard is spot on.', '2026-03-05T07:15:00Z'),
  review('rv-5', 'app-zmanimlive', 'u-shaindy', 5, 'The most accurate zmanim app I have used. Candle-lighting reminder never misses.', '2026-02-20T16:00:00Z'),
  review('rv-6', 'app-zmanimlive', 'u-you', 4, 'Great app. Multi-city view is very handy for traveling.', '2026-04-01T11:30:00Z'),
  review('rv-7', 'app-koshercheck', 'u-tova', 4, 'Scanning works well in the supermarket. Saved me more than once.', '2026-03-12T14:00:00Z'),
  review('rv-8', 'app-alephbais', 'u-moshe', 5, 'My 4-year-old asks to play it. The parent controls are reassuring.', '2026-03-20T18:45:00Z'),
  review('rv-9', 'app-niggunbox', 'u-you', 5, 'Offline playlists made our trip. Great Yom Tov set.', '2026-03-25T20:10:00Z'),
  review('rv-10', 'app-parshaquiz', 'u-shaindy', 4, 'A hit at our Shabbos table. More questions please!', '2026-04-04T22:00:00Z'),
  review('rv-11', 'app-tehillim', 'u-tova', 5, 'Organized a whole-neighborhood Tehillim in minutes. Wonderful chesed tool.', '2026-04-10T09:00:00Z'),
];

export const SEED_INSTALLS: Install[] = [
  { userId: 'u-you', appId: 'app-dafconnect', installedAt: '2026-03-01T08:00:00Z' },
  { userId: 'u-you', appId: 'app-zmanimlive', installedAt: '2026-03-28T10:00:00Z' },
  { userId: 'u-you', appId: 'app-niggunbox', installedAt: '2026-03-24T19:00:00Z' },
  { userId: 'u-you', appId: 'app-koshercheck', installedAt: '2026-04-02T12:30:00Z' },
];

export const SEED_REPORTS: Report[] = [
  {
    id: 'rp-1',
    appId: 'app-sederflow',
    reporterId: 'u-moshe',
    reason: 'Broken or malicious download',
    detail: 'The Windows download link returns a 404 for me.',
    resolved: false,
    createdAt: '2026-04-22T13:00:00Z',
  },
];
