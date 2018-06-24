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

self.importScripts('/js/idb.js')

const dbPromise = idb.open('app', 1, (upgradeDb) => {
  let store = upgradeDb.createObjectStore('restaurants', {
    keyPath: 'id'
  })
})

const cachePromise = caches.open('assets')
  .then(cache => cache.addAll(urls))

self.addEventListener('install', event =>
  event.waitUntil(
    Promise.all([dbPromise, cachePromise])
  )
)

self.addEventListener('fetch', event => {
  if (event.request.url === 'http://localhost:1337/restaurants/') {
    event.respondWith(dbPromise.then(db => {
      return db.transaction('restaurants').objectStore('restaurants').getAll()
        .then(restaurants => {
          if (restaurants.length === 0) {
            return fetch(event.request)
              .then(res => res.json())
              .then(restaurants => {
                const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
                restaurants.forEach(restaurant => store.put(restaurant));
                return new Response(JSON.stringify(restaurants));
              })
          } else {
            return new Response(JSON.stringify(restaurants));
          }
        });
    }))
  } else {
    event.respondWith(
      caches.open('assets')
        .then(cache => cache.match(event.request)
          .then(hit => {
            if (hit) {
              return hit;
            } else {
              cache.add(event.request).catch(err => console.log(err))
                return fetch(event.request).catch(err => console.log(err))
            }
          })
        )
    )
  }
})