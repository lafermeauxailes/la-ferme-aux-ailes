const CACHE_NAME = 'english-kids-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Les fichiers audio seront mis en cache à la demande
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des fichiers essentiels');
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors de la mise en cache', error);
      })
  );
  
  // Forcer l'activation immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Prendre le contrôle immédiatement
  return self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie différente pour les fichiers audio
  if (url.pathname.includes('/audios/')) {
    // Stratégie Cache First pour les audios (économie de bande passante)
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Audio trouvé dans le cache', url.pathname);
            return cachedResponse;
          }
          
          console.log('Service Worker: Téléchargement et mise en cache de l\'audio', url.pathname);
          return fetch(request)
            .then((response) => {
              // Vérifier si la réponse est valide
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Cloner la réponse car elle ne peut être consommée qu'une fois
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch((error) => {
              console.error('Service Worker: Erreur lors du téléchargement de l\'audio', error);
              // Retourner une réponse d'erreur appropriée
              return new Response('Audio non disponible hors ligne', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  } else {
    // Stratégie Network First pour les autres fichiers
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Cloner et mettre en cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essayer le cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Service Worker: Fichier trouvé dans le cache', url.pathname);
                return cachedResponse;
              }
              
              // Si rien n'est trouvé, retourner une page d'erreur
              if (request.destination === 'document') {
                return caches.match('/index.html');
              }
              
              return new Response('Fichier non disponible hors ligne', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  }
});

// Message du Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Préchargement des audios à la demande
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const audioUrl = event.data.url;
    
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.add(audioUrl);
      })
      .then(() => {
        console.log('Service Worker: Audio préchargé', audioUrl);
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors du préchargement', error);
      });
  }
  
  // Vider le cache si demandé
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('Service Worker: Cache vidé');
      });
  }
});

console.log('Service Worker: Script chargé');