import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

/** Fixed-position stack that renders active toasts. Mounted once in AppComponent. */
@Component({
  selector: 'jt-toast-host',
  standalone: true,
  template: `
    <div class="fixed bottom-20 md:bottom-4 right-4 z-50 flex flex-col gap-2 w-72 max-w-[calc(100vw-2rem)]">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="jt-card px-4 py-3 shadow-lg flex items-start gap-2 text-sm border-l-4 animate-[fade_.2s_ease]"
          [style.border-left-color]="color(t.kind)"
        >
          <span>{{ icon(t.kind) }}</span>
          <span class="grow">{{ t.text }}</span>
          <button (click)="toast.dismiss(t.id)" class="text-muted hover:text-ink" aria-label="Dismiss">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`@keyframes fade { from { opacity: 0; transform: translateY(8px); } }`],
})
export class ToastHostComponent {
  toast = inject(ToastService);

  icon(k: string) {
    return k === 'success' ? '✅' : k === 'error' ? '⚠️' : 'ℹ️';
  }
  color(k: string) {
    return k === 'success' ? '#15803d' : k === 'error' ? '#b91c1c' : '#1d3a8a';
  }
}
