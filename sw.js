const urls = [
  '/',
  '/restaurant.html',
  '/css/main.css',
  '/css/home.css',
  '/css/restaurant.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js'
]

self.addEventListener('install', event =>
  event.waitUntil(
    caches.open('assets')
      .then(cache => cache.addAll(urls))
  )
)

self.addEventListener('fetch', event => {
  !event.request.url.startsWith('http://localhost')
    ? event.respondWith(fetch(event.request))
    : event.respondWith(
        caches.open('assets')
          .then(cache => cache.match(event.request)
          .then(hit => {
            if (hit) {
              return hit;
            } else {
              cache.add(event.request);
              return fetch(event.request);
            }
          })
        )
      )
})