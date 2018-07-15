const idb = require('idb');

const dbPromise = idb.open('app', 4, (upgradeDb) => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
    case 1:
      upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
    case 2:
      upgradeDb.createObjectStore('reviewPosts', { autoIncrement: true });
    case 3:
      upgradeDb.createObjectStore('favPuts', { autoIncrement: true });
  }
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
      dbPromise.then((db) => {
        db.transaction('favPuts', 'readwrite')
          .objectStore('favPuts').put(event.request.url);

        return fetch(event.request)
          .then(res => dbPromise.then((db) => {
            db.transaction('favPuts', 'readwrite').objectStore('favPuts').clear();
            return res;
          }))
          .then(res => res.json())
          .then(body => dbPromise.then((db) => {
            const tx = db.transaction('restaurants', 'readwrite')
              .objectStore('restaurants').put(body);
            return tx.complete;
          }).then(() => new Response(JSON.stringify(body))))
          .catch(err => new Response(JSON.stringify({ message: 'PUT stored offline' })));
      }),
    );

    // handle GET reviews by ID
  } else if (event.request.url.includes('http://localhost:1337/reviews/?restaurant_id')) {
    event.respondWith(
      fetch(event.request)
        .then(res => res.json())
        .then(reviews => dbPromise.then((db) => {
          const store = db.transaction('reviews', 'readwrite').objectStore('reviews');
          reviews.forEach(review => store.put(review));
          return new Response(JSON.stringify(reviews));
        }))
        .catch(err => dbPromise.then(db => db.transaction('reviews')
          .objectStore('reviews').getAll()
          .then((reviews) => {
            reviews = reviews
              .filter(review => review.restaurant_id == event.request.url[event.request.url.length - 1]);
            return new Response(JSON.stringify(reviews));
          }))),
    );

  // handle POST new review
  } else if (event.request.url === 'http://localhost:1337/reviews/' && event.request.method === 'POST') {
    event.respondWith(
      event.request.json().then(body => dbPromise.then((db) => {
        const store = db.transaction('reviewPosts', 'readwrite')
          .objectStore('reviewPosts');

        store.put(body);
        return fetch('http://localhost:1337/reviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then(res => dbPromise.then((db) => {
            console.log(res);
            db.transaction('reviewPosts', 'readwrite').objectStore('reviewPosts').clear();
            return res;
          }))
          .catch(err => new Response(JSON.stringify({ message: 'POST stored offline' })));
      })),
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

/**
 * POST reviews when back online
 */
self.addEventListener('message', (e) => {
  if (e.data === 'online') {
    dbPromise.then((db) => {
      db.transaction('reviewPosts')
        .objectStore('reviewPosts').getAll()
        .then((reviewPosts) => {
          if (reviewPosts.length > 0) {
            const postsArray = reviewPosts
              .map(post => fetch('http://localhost:1337/reviews/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
              }));

            Promise.all(postsArray).then(() => {
              db.transaction('reviewPosts', 'readwrite').objectStore('reviewPosts').clear();
              const channel = new BroadcastChannel('sw-messages');
              channel.postMessage('Cached POSTs completed');
            })
              .catch(err => console.log(err));
          }
        });
    });

    dbPromise.then((db) => {
      db.transaction('favPuts')
        .objectStore('favPuts').getAll()
        .then((favPuts) => {
          if (favPuts.length > 0) {
            const putsArray = favPuts
              .map(putUrl => fetch(putUrl, {
                method: 'PUT',
              }));
            Promise.all(putsArray).then((responses) => {
              db.transaction('favPuts', 'readwrite').objectStore('favPuts').clear();
              Promise.all(responses.map(res => res.json())).then((bodies) => {
                bodies.forEach((body) => {
                  db.transaction('restaurants', 'readwrite')
                    .objectStore('restaurants').put(body);
                });
                const channel = new BroadcastChannel('sw-messages');
                channel.postMessage('Cached PUTs completed');
              });
            })
              .catch(err => console.log(err));
          }
        });
    });
  }
});
