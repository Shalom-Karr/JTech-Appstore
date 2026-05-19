import { Pipe, PipeTransform } from '@angular/core';

/** Compact count formatting — 1234 → "1.2k". */
@Pipe({ name: 'count', standalone: true })
export class CountPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    const n = value ?? 0;
    if (n < 1000) return String(n);
    if (n < 1_000_000) return (n / 1000).toFixed(n < 10_000 ? 1 : 0) + 'k';
    return (n / 1_000_000).toFixed(1) + 'm';
  }
}

/** Relative "time ago" formatting for ISO timestamps. */
@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(iso: string | null | undefined): string {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.round(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.round(hr / 24);
    if (day < 30) return `${day}d ago`;
    const mon = Math.round(day / 30);
    if (mon < 12) return `${mon}mo ago`;
    return `${Math.round(mon / 12)}y ago`;
  }
}
