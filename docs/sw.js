// ════════════════════════════════════════════════════════════
// sw.js — Service Worker: cache để lần sau yếu/mất mạng vẫn vào được
// Lần đầu cần mạng (tải thư viện + font); sau đó dùng bản đã lưu.
// ════════════════════════════════════════════════════════════

const CACHE = 'opex-hub-v2'; // Đổi v1 thành v2 để ép clear cache

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // KHÔNG cache các đường dẫn bắt đầu bằng /api/
  if (url.pathname.startsWith('/api/')) {
    return; // Để trình duyệt gọi thẳng server, không dùng cache
  }
  
  // Các file tĩnh khác thì cache bình thường
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});

// Vỏ ứng dụng (luôn cache trước)
const SHELL = [
  './',
  './index.html',
  './css/theme.css',
  './css/layout.css',
  './js/app.js',
  './js/views.js',
  './js/parser.js',
  './js/mindmap.js',
  './js/journal.js',
  './js/icons.js',
  './_vendor/MindElixir.js',
  './_vendor/MindElixir.css',
  './_vendor/d3.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Nội dung .md và API: ưu tiên mạng để luôn mới, mạng hỏng thì lấy bản cache.
  if (url.pathname.endsWith('.md') || url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Vỏ + thư viện ngoài (font, html2canvas, mind-elixir): cache-first.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      // Cache cả tài nguyên bên thứ ba (opaque cũng lưu được).
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
