const CACHE='raw-log-v271';
const OFFLINE='./offline.html';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('raw-log-') && k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('message', event => { if(event.data && event.data.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try { return await fetch(req,{cache:'no-store'}); }
      catch(e){ const cached=await caches.match(req); return cached || new Response('RAW Log ist offline. Bitte einmal mit Internetverbindung öffnen.',{headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
    })());
    return;
  }
  event.respondWith((async()=>{
    try { return await fetch(req,{cache:'no-store'}); }
    catch(e){ return (await caches.match(req)) || Response.error(); }
  })());
});
