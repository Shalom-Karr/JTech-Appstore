import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../core/store.service';
import { AppCardComponent } from '../shared/app-card.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { CountPipe } from '../shared/pipes';

/** Public developer page — their published apps and stats. */
@Component({
  selector: 'jt-developer',
  standalone: true,
  imports: [AppCardComponent, EmptyStateComponent, CountPipe],
  template: `
    @if (!developer()) {
      <div class="max-w-2xl mx-auto px-4 py-12">
        <jt-empty-state icon="🤷" title="Developer not found" linkText="Browse apps" linkTo="/browse" />
      </div>
    } @else {
      @if (developer(); as d) {
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="jt-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img [src]="d.avatarUrl" alt="" class="w-24 h-24 rounded-full object-cover border border-line" />
          <div class="min-w-0">
            <h1 class="font-display text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-2">
              {{ d.fullName }}
              @if (d.verified) {
                <span class="text-xs bg-brand-light text-brand px-2 py-0.5 rounded font-medium">✓ Verified</span>
              }
            </h1>
            <div class="text-muted">&commat;{{ d.username }}</div>
            @if (d.bio) {
              <p class="mt-2 text-ink/90 max-w-xl">{{ d.bio }}</p>
            }
            @if (d.website) {
              <a [href]="d.website" target="_blank" rel="noopener" class="text-sm text-brand hover:underline">
                🔗 {{ d.website }}
              </a>
            }
          </div>
          <div class="sm:ml-auto flex gap-6 sm:gap-4 shrink-0">
            <div class="text-center">
              <div class="font-display text-2xl font-bold text-brand">{{ apps().length }}</div>
              <div class="text-xs text-muted">Apps</div>
            </div>
            <div class="text-center">
              <div class="font-display text-2xl font-bold text-brand">{{ downloads() | count }}</div>
              <div class="text-xs text-muted">Downloads</div>
            </div>
          </div>
        </div>

        <h2 class="font-display text-xl font-bold mt-8 mb-3">Published apps</h2>
        @if (apps().length) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (a of apps(); track a.id) {
              <jt-app-card [app]="a" />
            }
          </div>
        } @else {
          <p class="text-muted">This developer has no published apps yet.</p>
        }
      </div>
      }
    }
  `,
})
export class DeveloperComponent {
  private store = inject(StoreService);
  private route = inject(ActivatedRoute);

  private username = signal(this.route.snapshot.paramMap.get('username') ?? '');

  developer = computed(() => this.store.profileByUsername(this.username()));
  apps = computed(() => {
    const d = this.developer();
    return d
      ? this.store.appsByDeveloper(d.id).filter((a) => a.status === 'approved')
      : [];
  });
  downloads = computed(() => this.apps().reduce((n, a) => n + a.downloadCount, 0));
}
