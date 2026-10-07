const CACHE='sp-rock-trip-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const COVER_ASSETS=[
  "https://coverartarchive.org/release/127116d4-5724-444b-b385-049fb1bdaebc/front-1200",
  "https://is1-ssl.mzstatic.com/image/thumb/Music/d2/db/21/mzi.kihcrutv.jpg/1200x1200bb.jpg",
  "https://www.nacionrock.com/wp-content/uploads/1342151305_bad_brains_-_1982_bad_brains.jpg",
  "https://media1.jpc.de/image/w1155/front/0/3760053842985.jpg",
  "https://i.scdn.co/image/ab67616d0000b273edefe7d1e022703293c382ac",
  "https://coverartarchive.org/release/55ddf8e9-aa31-4a43-a1a0-8a6c9641a61e/front-1200",
  "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/80/a8/9a/80a89a18-88bd-4d3a-34cb-5c1748d24f0c/5099969444555.jpg/1200x1200bf-60.jpg",
  "https://muzikercdn.com/uploads/products/3728/372882/thumb_large_d_gallery_99118693.jpg",
  "https://i.scdn.co/image/ab67616d0000b273962e9ac8243100b876e81699",
  "https://us.rarevinyl.com/cdn/shop/products/the-cure-disintegration-vg-uk-vinyl-lp-album-record-fixh14-755023_1024x1024.jpg?v=1764073393"
];

async function cacheCovers(cache){
  await Promise.allSettled(COVER_ASSETS.map(async url=>{
    const req=new Request(url,{mode:'no-cors',cache:'reload'});
    const resp=await fetch(req);
    await cache.put(req,resp);
  }));
}
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(ASSETS);
  await cacheCovers(cache);
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.startsWith('sp-rock-trip-')).map(k=>caches.delete(k)))),
  self.clients.claim()
])));
self.addEventListener('fetch',e=>e.respondWith((async()=>{
  const cached=await caches.match(e.request);
  if(cached)return cached;
  try{
    const resp=await fetch(e.request);
    const copy=resp.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
    return resp;
  }catch(err){
    if(e.request.mode==='navigate')return caches.match('./index.html');
    throw err;
  }
})()));
