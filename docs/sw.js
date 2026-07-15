const CACHE = 'opex-hub-v2';

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
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Gộp sự kiện fetch thành một luồng duy nhất để tránh lỗi "already been responded to"
self.addEventListener('fetch', e => {
  const req = e.request;
  
  // Chỉ can thiệp vào các phương thức GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. LOẠI TRỪ Cache: Các đường dẫn API
  // Để trình duyệt gọi thẳng server, không dùng cache, chặn đứng tiến trình SW tại đây.
  if (url.pathname.startsWith('/api/')) {
    return; 
  }

  // 2. NETWORK-FIRST (Ưu tiên mạng): Dành cho nội dung cập nhật thường xuyên (như .md)
  // Lấy dữ liệu mới nhất từ mạng. Nếu mất mạng, lấy từ cache dự phòng.
  if (url.pathname.endsWith('.md')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 3. CACHE-FIRST (Ưu tiên cache): Dành cho Vỏ (SHELL) + Thư viện tĩnh (Font, JS, CSS)
  e.respondWith(
    caches.match(req).then(hit => 
      hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit)
    )
  );
});