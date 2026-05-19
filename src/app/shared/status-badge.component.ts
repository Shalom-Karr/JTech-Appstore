import { Component, computed, input } from '@angular/core';
import { AppStatus } from '../core/models';

/** Colored pill for an app's review status. */
@Component({
  selector: 'jt-status-badge',
  standalone: true,
  template: `
    <span class="jt-pill" [style.background]="meta().bg" [style.color]="meta().fg">
      {{ meta().icon }} {{ meta().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<AppStatus>();

  meta = computed(() => {
    switch (this.status()) {
      case 'approved':
        return { label: 'Published', icon: '✓', bg: '#dcfce7', fg: '#15803d' };
      case 'pending':
        return { label: 'In review', icon: '⏳', bg: '#faf3df', fg: '#a87d0c' };
      case 'rejected':
        return { label: 'Rejected', icon: '✕', bg: '#fee2e2', fg: '#b91c1c' };
      case 'suspended':
        return { label: 'Suspended', icon: '⛔', bg: '#f1f0ec', fg: '#6b7280' };
    }
  });
}
