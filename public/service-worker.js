const timeout = 400;
const staticCacheName = 'static-cache-v1';
const dynamicCacheName = 'dynamic-cache-v1';

let staticFilesToCache = [
    'static/',
];

self.addEventListener('activate', async (event) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter((name) => name !== staticCacheName)
            .filter((name) => name !== dynamicCacheName)
            .map((name) => caches.delete(name)),
    );
});

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
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then((networkResponse) => {
                                const clonedResponse = networkResponse.clone();
                                caches.open(staticCacheName)
                                    .then((cache) => {
                                        cache.put(event.request, clonedResponse);
                                    });
                                return networkResponse;
                            });
                    }
                })
        );
    } else {
        event.respondWith(fromNetwork(event.request, timeout)
            .catch((err) => {
                console.log(`Error: go cash`);
                return fromCache(event.request);
            }));
    }
});

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        let timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);

            const clonedResponse = response.clone();
            caches.open(dynamicCacheName).then((cache) => {
                cache.put(request, clonedResponse.clone());
            });

            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(dynamicCacheName).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}
