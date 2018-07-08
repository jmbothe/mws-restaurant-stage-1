const idb = require('idb');

const dbPromise = idb.open('app', 1, (upgradeDb) => {
  upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
});

self.addEventListener('install', event => event.waitUntil(dbPromise));

self.addEventListener('fetch', (event) => {
  // handle GET all restaurants request
  if (event.request.url === 'http://localhost:1337/restaurants/') {
    event.respondWith(dbPromise.then(db => db.transaction('restaurants')
      .objectStore('restaurants').getAll()
      .then((restaurants) => {
        if (restaurants.length === 0) {
          return fetch(event.request)
            .then(res => res.json())
            .then((restaurants) => {
              const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
              restaurants.forEach(restaurant => store.put(restaurant));
              return new Response(JSON.stringify(restaurants));
            });
        }
        return new Response(JSON.stringify(restaurants));
      })));
  // handle PUT toggle favorite restaurant request
  } else if (event.request.url.includes('is_favorite') && event.request.method === 'PUT') {
    event.respondWith(
      fetch(event.request)
        .then(res => res.json())
        .then(body => dbPromise.then((db) => {
          const tx = db.transaction('restaurants', 'readwrite')
            .objectStore('restaurants').put(body);
          return tx.complete;
        }).then(() => new Response(JSON.stringify(body)))),
    );
  // handle requests to other origins
  } else if (!event.request.url.startsWith('http://localhost')) {
    event.respondWith(
      caches.open('assets')
        .then(cache => cache.match(event.request)
          .then((hit) => {
            if (hit) {
              return hit;
            }
            cache.add(event.request).catch(err => console.log(err));
            return fetch(event.request).catch(err => console.log(err));
          })),
    );
  }
});
