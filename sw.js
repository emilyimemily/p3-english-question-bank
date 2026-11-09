/* P3 English Question Bank - offline cache */
const CACHE = 'p3-english-bank-v11';
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
  }).then(function(){ return self.clients.claim(); }).then(function(){
    /* Releases before v6 used a cache-first worker with no reload hook, so an
       already-open tab could keep showing an obsolete interface forever.
       Force those tabs to load the fresh HTML once when this worker takes over.
       Activate runs once per worker version, so this cannot loop. */
    return self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
      return Promise.all(list.map(function(c){
        if (!c || !c.url || c.url.indexOf(self.registration.scope) !== 0) return null;
        if (typeof c.navigate !== 'function') return null;
        try { return c.navigate(c.url).catch(function(){ return null; }); }
        catch (err) { return null; }
      }));
    });
  }).catch(function(){ /* never let a failed reload break activation */ }));
});
function put(req, res){
  if (!res || !res.ok) return res;
  const copy = res.clone();
  caches.open(CACHE).then(function(c){ c.put(req, copy); });
  return res;
}
self.addEventListener('fetch', function(e){
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  /* HTML and data must be FRESH: a cache-first policy kept showing an old
     interface for days after a publish.  Images stay cache-first (large). */
  const fresh = req.mode === 'navigate' || /\.(html|json|webmanifest)$/i.test(url.pathname);
  if (fresh){
    e.respondWith(fetch(req).then(function(res){
      return put(req, res);
    }).catch(function(){
      return caches.match(req).then(function(hit){ return hit || Response.error(); });
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function(hit){
    const network = fetch(req).then(function(res){ return put(req, res); }).catch(function(){ return hit; });
    return hit || network;
  }));
});
