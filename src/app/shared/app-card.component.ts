import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppItem, categoryName } from '../core/models';
import { StoreService } from '../core/store.service';
import { StarsComponent } from './stars.component';
import { PricePipe, CountPipe } from './pipes';

/** App tile used across Home, Browse, Library and developer pages. */
@Component({
  selector: 'jt-app-card',
  standalone: true,
  imports: [RouterLink, StarsComponent, PricePipe, CountPipe],
  template: `
    <a
      [routerLink]="['/app', app().id]"
      class="jt-card p-4 flex gap-3 h-full hover:border-brand hover:shadow-md transition group"
    >
      <img
        [src]="app().iconUrl"
        [alt]="app().name"
        loading="lazy"
        class="w-16 h-16 rounded-2xl object-cover border border-line shrink-0 group-hover:scale-105 transition-transform"
      />
      <div class="min-w-0 flex flex-col">
        <div class="font-semibold leading-tight truncate group-hover:text-brand">
          {{ app().name }}
        </div>
        <div class="text-xs text-muted line-clamp-2 mt-0.5">{{ app().tagline }}</div>
        <div class="mt-auto pt-2 flex items-center gap-1.5 text-xs text-muted flex-wrap">
          <jt-stars [value]="rating().avg" size="0.8rem" />
          @if (rating().count) {
            <span>{{ rating().avg }}</span>
          }
          <span>·</span>
          <span class="bg-brand-light text-brand px-1.5 py-0.5 rounded font-medium">{{ catName() }}</span>
        </div>
        <div class="mt-1 flex items-center gap-2 text-xs">
          <span class="font-display font-bold text-brand">{{ app().price | price }}</span>
          <span class="text-muted">·</span>
          <span class="text-muted">⬇ {{ app().downloadCount | count }}</span>
        </div>
      </div>
    </a>
  `,
})
export class AppCardComponent {
  app = input.required<AppItem>();

  private store = inject(StoreService);

  catName = computed(() => categoryName(this.app().category));
  rating = computed(() => this.store.appRating(this.app().id));
}
