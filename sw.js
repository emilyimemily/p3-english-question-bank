/* P3 English Question Bank - offline cache */
const CACHE = 'p3-english-bank-v4';
const CORE = [
  './', './index.html', './offline.html',
  './data/question_bank.json', './data/vocab.json',
  './api/papers.json', './api/questions.json', './api/stats.json',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(req).then(function(hit){
    const network = fetch(req).then(function(res){
      if (res && res.ok){
        const copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function(){ return hit; });
    return hit || network;
  }));
});
