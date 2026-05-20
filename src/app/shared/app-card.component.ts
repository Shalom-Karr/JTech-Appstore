import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppItem, categoryName } from '../core/models';
import { StoreService } from '../core/store.service';
import { CountPipe } from './pipes';
import { IconComponent } from './icon.component';

/** App tile used across Home, Browse, Library and developer pages. */
@Component({
  selector: 'jt-app-card',
  standalone: true,
  imports: [RouterLink, CountPipe, IconComponent],
  template: `
    <a
      [routerLink]="['/app', app().id]"
      class="jt-card p-4 flex gap-3 h-full transition hover:border-brand hover:-translate-y-0.5 group"
    >
      <img
        [src]="app().iconUrl"
        [alt]="app().name"
        loading="lazy"
        (error)="onImgError($event)"
        class="w-16 h-16 rounded-2xl object-cover border border-line shrink-0 bg-surface-2 group-hover:scale-105 transition-transform"
      />
      <div class="min-w-0 flex flex-col">
        <div class="font-semibold leading-tight truncate group-hover:text-brand">
          {{ app().name }}
        </div>
        <div class="text-xs text-muted line-clamp-2 mt-0.5">{{ app().tagline }}</div>
        <div class="mt-auto pt-2 flex items-center gap-1.5 text-xs text-muted flex-wrap">
          <span class="bg-brand-light text-brand px-1.5 py-0.5 rounded font-medium">{{ catName() }}</span>
          <span>·</span>
          <span>{{ app().platform }}</span>
          <span>·</span>
          <span class="inline-flex items-center gap-1"><jt-icon name="download" size="0.85em" /> {{ app().downloadCount | count }}</span>
        </div>
      </div>
    </a>
  `,
})
export class AppCardComponent {
  app = input.required<AppItem>();

  private store = inject(StoreService);

  catName = computed(() => categoryName(this.app().category));

  onImgError(e: Event) {
    const el = e.target as HTMLImageElement;
    if (!el.src.includes('placehold')) {
      el.src = 'https://placehold.co/256x256/eef0f6/5b6573?text=App';
    }
  }
}
