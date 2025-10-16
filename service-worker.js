// Versi cache — ubah versi di sini setiap kali deploy kalau mau kontrol manual
const CACHE_NAME = 'superdigi-v2'; 

// File yang mau di-cache
const urlsToCache = [
  '/',
  '/index.html',
  'https://res.cloudinary.com/djqpz6rl8/image/upload/v1760373175/Black_and_Cream_Colorful_Retro_Vintage_Apparel_Logo_2_eid86m.png',
  'https://file.aitubo.ai/assets/doc/2024/10/ba9316fa9.jpg!w1280'
];

// INSTALL — cache file dan langsung aktifkan versi baru
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Langsung aktif tanpa tunggu versi lama berhenti
});

// ACTIVATE — hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim(); // Segera kendalikan semua tab aktif
});

// FETCH — coba ambil dari jaringan dulu, kalau gagal baru pakai cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Simpan salinan respon ke cache (jika bisa)
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
