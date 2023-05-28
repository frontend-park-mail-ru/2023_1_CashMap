// Кеш для статики
const staticCacheName = 'static-cache-v1';
let staticFilesToCache = [
    'static/',
];

// Кеш для запросов
const dynamicCacheName = 'dynamic-cache-v1';

self.addEventListener('install', async (event) => {
    await fetch('/static/build/assets.json')
        .then(response => response.json())
        .then(data => {
            data.files.forEach((url) => {
                url = url.replace('public/', '');
                staticFilesToCache.push(url);
            });
        });

    await caches.open(dynamicCacheName);
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticFilesToCache);
});

self.addEventListener('fetch', event => {
    const { request } = event;

    const isStaticRequest = staticFilesToCache.some(staticFile => request.url.includes(staticFile));

    if (isStaticRequest) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    return response || fetch(request)
                        .then(networkResponse => {
                            const clonedResponse = networkResponse.clone();

                            caches.open(staticCacheName)
                                .then(cache => {
                                    cache.put(request, clonedResponse);
                                });

                            return networkResponse;
                        });
                })
        );
    } else {
        event.respondWith(
            caches.open(dynamicCacheName)
                .then(cache => {
                    return cache.match(request)
                        .then(response => {
                            return (
                                response ||
                                fetch(request)
                                    .then(networkResponse => {
                                        const clonedResponse = networkResponse.clone();
                                        cache.put(request, clonedResponse);
                                        return networkResponse;
                                    })
                            );
                        })
                        .catch(() => {
                            return caches.match(request);
                        });
                })
        );
    }
});

self.addEventListener('activate', async (event) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter((name) => name !== staticCacheName)
            .filter((name) => name !== dynamicCacheName)
            .map((name) => caches.delete(name)),
    );
});
