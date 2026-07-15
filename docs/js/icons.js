// ════════════════════════════════════════════════════════════
// icons.js — Bộ icon SVG nội tuyến (nét mảnh, hợp tông trầm)
// Không phụ thuộc CDN: điều hướng luôn hiện kể cả khi mạng chậm.
// ════════════════════════════════════════════════════════════

const P = 'stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const S = (inner) => `<svg viewBox="0 0 24 24" ${P}>${inner}</svg>`;

const ICONS = {
  eye:     S('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>'),
  lotus:   S('<path d="M12 21c-4 0-7-2.5-7-6 2 0 3.5.8 4.5 2M12 21c4 0 7-2.5 7-6-2 0-3.5.8-4.5 2M12 21c0-4 1.5-7 0-11-1.5 4 0 7 0 11ZM7.5 17C6 14 7 10 9 8M16.5 17C18 14 17 10 15 8"/>'),
  car:     S('<path d="M5 11l1.5-4h11L19 11M4 11h16v5H4zM7 16v2M17 16v2"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/>'),
  factory: S('<path d="M3 21V9l6 4V9l6 4V5l6 0v16zM7 17h2M13 17h2M19 17h0"/>'),
  trend:   S('<path d="M3 17l6-6 4 4 8-8M21 7h-5M21 7v5"/>'),
  chart:   S('<path d="M4 20V4M4 20h16M8 16l3-4 3 2 4-6"/>'),
  seal:    S('<path d="M12 2l2.4 1.8 3-.2.8 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.8 2.9-3-.2L12 22l-2.4-1.8-3 .2-.8-2.9L3.3 16l1-2.8-1-2.8 2.5-1.7.8-2.9 3 .2zM9 12l2 2 4-4"/>'),
  target:  S('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/>'),
  users:   S('<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M21 20c0-2.5-1.5-4.6-3.5-5.5"/>'),
  cycle:   S('<path d="M4 12a8 8 0 0 1 13.6-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.6 5.7L4 16M4 20v-4h4"/>'),
  compass: S('<circle cx="12" cy="12" r="9"/><path d="M16 8l-2.5 5.5L8 16l2.5-5.5z"/>'),
  truck:   S('<path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>'),
  list:    S('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  mindmap: S('<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h4M11 12l6-5M11 12l6 5"/>'),
  image:   S('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 16l-5-5L5 20"/>'),
  expand:  S('<path d="M8 3H3v5M16 3h5v5M16 21h5v-5M8 21H3v-5"/>'),
  feather: S('<path d="M20 4C12 4 6 10 6 18l-2 2M20 4c0 6-4 11-10 12M20 4l-7 7M11 13H8"/>'),
  search:  S('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  home:    S('<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/>'),
  book: S('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/>'),

};

export function icon(name) {
  return ICONS[name] || ICONS.list;
}
