import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { AppItem, Install, Profile, Report, Review, Wishlist } from './models';

/**
 * Raw IndexedDB persistence layer (via Dexie).
 *
 * There is no real backend — this in-browser database IS the data store.
 * Components never touch this directly; they go through StoreService, which
 * keeps an in-memory signal mirror and writes through to here.
 */
@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  profiles!: Table<Profile, string>;
  apps!: Table<AppItem, string>;
  reviews!: Table<Review, string>;
  installs!: Table<Install, [string, string]>;
  reports!: Table<Report, string>;
  wishlist!: Table<Wishlist, [string, string]>;

  constructor() {
    super('jtech-appstore');
    this.version(1).stores({
      profiles: 'id, username, role',
      apps: 'id, developerId, category, status, createdAt',
      reviews: 'id, appId, authorId',
      installs: '[userId+appId], userId, appId',
      reports: 'id, appId, reporterId, resolved',
    });
    // v2 — wishlist
    this.version(2).stores({
      wishlist: '[userId+appId], userId, appId',
    });
  }
}
