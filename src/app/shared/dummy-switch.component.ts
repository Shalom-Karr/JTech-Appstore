import { Component, input, model } from '@angular/core';

/**
 * A toggle switch for the prototype. It flips visually but is wired to
 * nothing real. Pass `comingSoon` to show a badge making that explicit.
 */
@Component({
  selector: 'jt-dummy-switch',
  standalone: true,
  template: `
    <div class="flex items-center justify-between gap-4 py-2">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-sm">{{ label() }}</span>
          @if (comingSoon()) {
            <span
              class="text-[10px] font-bold uppercase tracking-wide bg-gold-light text-gold-dark px-1.5 py-0.5 rounded"
              >Coming soon</span
            >
          }
        </div>
        @if (hint()) {
          <p class="text-xs text-muted mt-0.5">{{ hint() }}</p>
        }
      </div>
      <button
        type="button"
        (click)="on.set(!on())"
        [attr.aria-pressed]="on()"
        [attr.aria-label]="label()"
        class="relative w-11 h-6 rounded-full transition-colors shrink-0"
        [class.bg-brand]="on()"
        [class.bg-line]="!on()"
      >
        <span
          class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
          [class.translate-x-5]="on()"
        ></span>
      </button>
    </div>
  `,
})
export class DummySwitchComponent {
  label = input.required<string>();
  hint = input<string>('');
  comingSoon = input<boolean>(false);
  on = model<boolean>(false);
}
