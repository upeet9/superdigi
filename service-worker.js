// 🚀 Versi cache unik otomatis setiap deploy
const CACHE_VERSION = new Date().getTime();
const CACHE_NAME = `superdigi-${CACHE_VERSION}`;

// 🧩 File utama yang mau di-cache (gunakan path relatif)
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://res.cloudinary.com/djqpz6rl8/image/upload/v1760373175/Black_and_Cream_Colorful_Retro_Vintage_Apparel_Logo_2_eid86m.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// 🧱 INSTALL — cache semua file inti
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching core assets...');
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting(); // Aktifkan langsung
});

// ♻️ ACTIVATE — hapus versi cache lama
self.addEventListener('activate', (event) => {
  console.log('⚙️ Activating new service worker...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🌐 FETCH — strategi "Network First, Cache Fallback"
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Simpan response baru ke cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Jika offline, ambil dari cache
        return caches.match(event.request);
      })
  );
});

// 🔁 AUTO REFRESH semua tab setelah SW baru aktif
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
