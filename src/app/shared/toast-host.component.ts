import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';
import { IconComponent, IconName } from './icon.component';

/** Fixed-position stack that renders active toasts. Mounted once in AppComponent. */
@Component({
  selector: 'jt-toast-host',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-72 max-w-[calc(100vw-2rem)]">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="jt-card px-4 py-3 shadow-lg flex items-start gap-2 text-sm border-l-4 animate-[fade_.2s_ease]"
          [style.border-left-color]="color(t.kind)"
        >
          <span [style.color]="color(t.kind)"><jt-icon [name]="icon(t.kind)" size="1.1em" /></span>
          <span class="grow">{{ t.text }}</span>
          <button (click)="toast.dismiss(t.id)" class="text-muted hover:text-ink" aria-label="Dismiss"><jt-icon name="close" size="1em" /></button>
        </div>
      }
    </div>
  `,
  styles: [`@keyframes fade { from { opacity: 0; transform: translateY(8px); } }`],
})
export class ToastHostComponent {
  toast = inject(ToastService);

  icon(k: string): IconName {
    return k === 'success' ? 'check-circle' : k === 'error' ? 'alert-circle' : 'info';
  }
  color(k: string) {
    return k === 'success'
      ? 'var(--color-good)'
      : k === 'error'
        ? 'var(--color-bad)'
        : 'var(--color-brand)';
  }
}
