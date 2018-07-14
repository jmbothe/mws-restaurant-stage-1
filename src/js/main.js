import L from 'leaflet';
import DBHelper from './dbhelper.js';
import '../css/leaflet.css';
import '../css/main.css';
import '../css/home.css';
import '../css/images/marker-shadow.png';
import '../css/images/marker-icon-2x.png';

require('offline-plugin/runtime').install();

let newMap;
let markers = [];

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js');
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
  fetchNeighborhoods();
  fetchCuisines();
  document.getElementById('neighborhoods-select').addEventListener('change', () => updateRestaurants());
  document.getElementById('cuisines-select').addEventListener('change', () => updateRestaurants());
  document.getElementById('restaurants-list').addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
      DBHelper.toggleRestaurantFavorite(e.target.id);
    }
  });
});

window.addEventListener('online', () => navigator.serviceWorker.controller.postMessage('online'));

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      fillNeighborhoodsHTML(neighborhoods);
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach((neighborhood) => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      fillCuisinesHTML(cuisines);
    }
  });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach((cuisine) => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
const initMap = () => {
  newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false,
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1Ijoiam1ib3RoZSIsImEiOiJjamlyaTk4ZXcxNnFrM3dwZW51dHVnY2hiIn0._ETEQMJTUHwEofEokA1V2A',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, '
      + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
      + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
    crossOrigin: true,
  }).addTo(newMap);

  updateRestaurants();
};


/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants();
      fillRestaurantsHTML(restaurants);
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = () => {
  // Remove all restaurants
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (markers) {
    markers.forEach(marker => marker.remove());
  }
  markers = [];
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach((restaurant) => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap(restaurants);
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
  let imageUrl = DBHelper.imageUrlForRestaurant(restaurant).split('.')[0];
  imageUrl = imageUrl == '/img/undefined' ? '/img/none' : imageUrl;
  const li = document.createElement('li');

  const picture = document.createElement('picture');

  const webpSource = document.createElement('source');
  webpSource.type = 'image/webp';
  webpSource.srcset = `${imageUrl}.webp`;
  picture.append(webpSource);

  [
    {
      media: '(max-width: 320px)',
      srcset: {
        '1x': 'small',
        '2x': 'medium',
      },
    }, {
      media: '(max-width: 1023px)',
      srcset: {
        '1x': 'medium',
        '2x': 'large',
      },
    }, {
      media: '(min-width: 1024px)',
      srcset: {
        '1x': 'small',
        '2x': 'medium',
      },
    },
  ].forEach((item) => {
    const source = document.createElement('source');
    source.media = item.media;
    source.srcset = `${imageUrl}-${item.srcset['1x']}.jpg 1x,${imageUrl}-${item.srcset['2x']}.jpg 2x`;
    picture.append(source);
  });

  const image = document.createElement('img');
  image.src = `${imageUrl}-large.jpg`;
  image.className = 'restaurant-img';
  image.alt = restaurant.name;

  picture.append(image);
  li.append(picture);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('h3');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('h3');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  const favLabel = document.createElement('label');
  favLabel.for = restaurant.id;
  favLabel.className = 'fav-label';

  const favInput = document.createElement('input');
  favInput.id = restaurant.id;
  favInput.type = 'checkbox';
  favInput.checked = restaurant.is_favorite === 'true';

  const icon1 = document.createElement('i');
  icon1.className = 'heart unchecked';

  const icon2 = document.createElement('i');
  icon2.className = 'heart checked';

  favLabel.append(favInput);
  favLabel.append(icon1);
  favLabel.append(icon2);

  li.append(favLabel);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants) => {
  restaurants.forEach((restaurant) => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, newMap);
    marker.on('click', onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    markers.push(marker);
  });
};
