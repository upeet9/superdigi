// Nama cache
const CACHE_NAME = 'superdigi-v1';
// Daftar file yang akan di-cache
const urlsToCache = [
  '/',
  '/index.html',
  'https://res.cloudinary.com/djqpz6rl8/image/upload/v1760373175/Black_and_Cream_Colorful_Retro_Vintage_Apparel_Logo_2_eid86m.png',
  'https://file.aitubo.ai/assets/doc/2024/10/ba9316fa9.jpg!w1280'
];

// Event: Install
// Saat service worker di-install, buka cache dan tambahkan file-file di atas.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Fetch
// Saat ada permintaan (fetch) ke jaringan, coba cari di cache dulu.
// Jika ada di cache, langsung berikan dari sana.
// Jika tidak ada, lanjutkan ke jaringan.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
