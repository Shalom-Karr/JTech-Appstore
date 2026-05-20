import { Component, input } from '@angular/core';

export type IconName =
  | 'search'
  | 'bell'
  | 'library'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'user'
  | 'shield'
  | 'shield-check'
  | 'compass'
  | 'info'
  | 'plus'
  | 'check'
  | 'check-circle'
  | 'alert'
  | 'alert-circle'
  | 'flag'
  | 'download'
  | 'refresh'
  | 'lock'
  | 'heart'
  | 'heart-filled'
  | 'star'
  | 'star-filled'
  | 'trash'
  | 'package'
  | 'image'
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-left'
  | 'inbox'
  | 'clock'
  | 'ban'
  | 'rocket'
  | 'link'
  | 'fire'
  | 'eye'
  | 'sparkle'
  | 'gift'
  | 'chart'
  | 'gamepad'
  | 'music'
  | 'utensils'
  | 'hands-praying'
  | 'candle'
  | 'baby'
  | 'book'
  | 'wrench'
  | 'handshake'
  | 'tag'
  | 'message'
  | 'external'
  | 'calendar'
  | 'thumbs-up'
  | 'log-in';

/**
 * Inline SVG icon component (lucide-style line icons).
 * Pick an icon with [name] and size it via [size] or font-size; the stroke
 * follows currentColor.
 */
@Component({
  selector: 'jt-icon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('search') { <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/> }
        @case ('bell') { <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/> }
        @case ('library') { <path d="M3 3h4v18H3z"/><path d="M10 3h4v18h-4z"/><path d="m17 4 3.5.7 3 16.5-3.5-.7z"/> }
        @case ('sun') { <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/> }
        @case ('moon') { <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/> }
        @case ('menu') { <path d="M3 6h18M3 12h18M3 18h18"/> }
        @case ('close') { <path d="m18 6-12 12M6 6l12 12"/> }
        @case ('user') { <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/> }
        @case ('shield') { <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> }
        @case ('shield-check') { <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/> }
        @case ('compass') { <circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/> }
        @case ('info') { <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/> }
        @case ('plus') { <path d="M12 5v14M5 12h14"/> }
        @case ('check') { <path d="M20 6 9 17l-5-5"/> }
        @case ('check-circle') { <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/> }
        @case ('alert') { <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/> }
        @case ('alert-circle') { <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/> }
        @case ('flag') { <path d="M4 22V4a1 1 0 0 1 1-1h12l-3 5 3 5H5"/> }
        @case ('download') { <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/> }
        @case ('refresh') { <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/> }
        @case ('lock') { <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/> }
        @case ('heart') { <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> }
        @case ('heart-filled') { <path fill="currentColor" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> }
        @case ('star') { <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/> }
        @case ('star-filled') { <path fill="currentColor" d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/> }
        @case ('trash') { <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/> }
        @case ('package') { <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/> }
        @case ('image') { <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-11 11"/> }
        @case ('arrow-down') { <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/> }
        @case ('arrow-right') { <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/> }
        @case ('arrow-left') { <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/> }
        @case ('inbox') { <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/> }
        @case ('clock') { <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/> }
        @case ('ban') { <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/> }
        @case ('rocket') { <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/> }
        @case ('link') { <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/> }
        @case ('fire') { <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/> }
        @case ('eye') { <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/> }
        @case ('sparkle') { <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5z"/><path d="M19 16l-.7 2L16 19l2.3 1L19 22l.7-2L22 19l-2.3-1z"/><path d="M5 4l-.5 1.5L3 6l1.5.5L5 8l.5-1.5L7 6l-1.5-.5z"/> }
        @case ('gift') { <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/> }
        @case ('chart') { <path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/> }
        @case ('gamepad') { <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/> }
        @case ('music') { <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/> }
        @case ('utensils') { <path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/> }
        @case ('hands-praying') { <path d="M11 14h.5"/><path d="M12.5 22V11l-2.5-1.5L7 11l-2.5-1.5L2 11v6a4 4 0 0 0 4 4z"/><path d="M11.5 22V11l2.5-1.5L17 11l2.5-1.5L22 11v6a4 4 0 0 1-4 4z"/> }
        @case ('candle') { <path d="M12 2s2 2 2 4-2 3-2 3-2-1-2-3 2-4 2-4z"/><rect x="8" y="9" width="8" height="13" rx="1"/> }
        @case ('baby') { <path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.5.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3"/> }
        @case ('book') { <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/> }
        @case ('wrench') { <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> }
        @case ('handshake') { <path d="m11 17 2 2a1 1 0 0 0 1.4 0l5.5-5.5a1 1 0 0 0 0-1.4L18 10"/><path d="m13 15-2-2a1 1 0 0 1 0-1.4l5.5-5.5a1 1 0 0 1 1.4 0L20 8"/><path d="m4.5 13.5 6 6"/><path d="M11 11 9 9a1 1 0 0 0-1.4 0L2 14.5a1 1 0 0 0 0 1.4L4 18"/> }
        @case ('tag') { <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/> }
        @case ('message') { <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> }
        @case ('external') { <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/> }
        @case ('calendar') { <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/> }
        @case ('thumbs-up') { <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.34-7.34A1.93 1.93 0 0 1 15 5.88z"/> }
        @case ('log-in') { <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/> }
      }
    </svg>
  `,
  host: { class: 'inline-flex items-center justify-center shrink-0' },
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<string | number>('1em');
}
