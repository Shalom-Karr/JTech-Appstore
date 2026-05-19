import { Component, computed, input } from '@angular/core';

/** Read-only star rating display. Pass a 0–5 value. */
@Component({
  selector: 'jt-stars',
  standalone: true,
  template: `
    <span class="inline-flex items-center" [attr.aria-label]="value() + ' out of 5 stars'">
      @for (s of slots(); track $index) {
        <span [class.text-gold]="s" [class.text-line]="!s" [style.font-size]="size()">★</span>
      }
    </span>
  `,
})
export class StarsComponent {
  value = input<number>(0);
  size = input<string>('1rem');

  slots = computed(() => {
    const rounded = Math.round(this.value());
    return [1, 2, 3, 4, 5].map((n) => n <= rounded);
  });
}
