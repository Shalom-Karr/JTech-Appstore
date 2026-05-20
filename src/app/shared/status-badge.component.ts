import { Component, computed, input } from '@angular/core';
import { AppStatus } from '../core/models';
import { IconComponent, IconName } from './icon.component';

/** Colored pill for an app's review status. */
@Component({
  selector: 'jt-status-badge',
  standalone: true,
  imports: [IconComponent],
  template: `
    <span class="jt-pill" [style.background]="meta().bg" [style.color]="meta().fg">
      <jt-icon [name]="meta().icon" size="0.85em" /> {{ meta().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<AppStatus>();

  meta = computed<{ label: string; icon: IconName; bg: string; fg: string }>(() => {
    switch (this.status()) {
      case 'approved':
        return { label: 'Published', icon: 'check', bg: '#dcfce7', fg: '#15803d' };
      case 'pending':
        return { label: 'In review', icon: 'clock', bg: '#faf3df', fg: '#a87d0c' };
      case 'rejected':
        return { label: 'Rejected', icon: 'close', bg: '#fee2e2', fg: '#b91c1c' };
      case 'suspended':
        return { label: 'Suspended', icon: 'ban', bg: '#f1f0ec', fg: '#6b7280' };
    }
  });
}
