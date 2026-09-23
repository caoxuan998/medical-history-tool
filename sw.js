/* 消化内科病史采集工具 - Service Worker (离线缓存) */
const CACHE = 'gi-history-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './splash/640x1136.png',
  './splash/750x1334.png',
  './splash/1242x2208.png',
  './splash/1125x2436.png',
  './splash/828x1792.png',
  './splash/1242x2688.png',
  './splash/1170x2532.png',
  './splash/1284x2778.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // 网络优先：模板更新后能立即看到最新版；断网时回退缓存，保证离线可用
  event.respondWith(
    fetch(event.request).then(res => {
      try{ const copy = res.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); }catch(e){}
      return res;
    }).catch(() => caches.match(event.request).then(c => c || caches.match('./index.html')))
  );
});
