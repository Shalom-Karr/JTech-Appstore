import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent, IconName } from './icon.component';

/** Friendly placeholder for empty lists / not-found states. */
@Component({
  selector: 'jt-empty-state',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="jt-card jt-mosaic text-center py-14 px-6">
      <div class="text-brand mb-3 flex justify-center">
        <jt-icon [name]="icon()" size="3rem" />
      </div>
      <h3 class="font-display text-xl font-bold">{{ title() }}</h3>
      @if (message()) {
        <p class="text-muted mt-1 max-w-sm mx-auto">{{ message() }}</p>
      }
      @if (linkText() && linkTo()) {
        <a [routerLink]="linkTo()" class="jt-btn jt-btn-primary mt-5">{{ linkText() }}</a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  icon = input<IconName>('search');
  title = input.required<string>();
  message = input<string>('');
  linkText = input<string>('');
  linkTo = input<string>('');
}
