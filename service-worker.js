var CACHE="matematika20-offline-stable-20261006-1";
var CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];

self.addEventListener("install",function(event){
 event.waitUntil(
  caches.open(CACHE).then(function(cache){return cache.addAll(CORE)})
  .then(function(){return self.skipWaiting()})
 );
});

self.addEventListener("activate",function(event){
 event.waitUntil(
  caches.keys().then(function(keys){
   return Promise.all(keys.map(function(key){
    if(key!==CACHE && key.indexOf("matematika")!==-1) return caches.delete(key);
   }));
  }).then(function(){return self.clients.claim()})
 );
});

self.addEventListener("fetch",function(event){
 if(event.request.method!=="GET") return;
 var url=new URL(event.request.url);
 if(url.origin!==self.location.origin) return;

 if(event.request.mode==="navigate"){
  event.respondWith(
   fetch(event.request).then(function(response){
    var copy=response.clone();
    caches.open(CACHE).then(function(cache){cache.put("./index.html",copy)});
    return response;
   }).catch(function(){
    return caches.match("./index.html");
   })
  );
  return;
 }

 event.respondWith(
  caches.match(event.request).then(function(cached){
   if(cached) return cached;
   return fetch(event.request).then(function(response){
    var copy=response.clone();
    caches.open(CACHE).then(function(cache){cache.put(event.request,copy)});
    return response;
   });
  })
 );
});
