const CACHE = 'depeche-cache-v1';
const timeout = 400;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll([
                '/static/',
                '/build/',
                '/api/user/profile',
                '/auth/check',
            ])
        ));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fromNetwork(event.request, timeout)
        .catch((err) => {
            console.log(`Error: ${err.message()}`);
            return fromCache(event.request);
        }));
});

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
// Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
// Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

/*event.waitUntil(
        caches.open('api-cache')
            .then(cache => {
                return cache.addAll([
                    '/api/user/profile',
                ]);
            })
    );*/

/*self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open('api-cache')
            .then(cache => {
                return cache.match(event.request)
                    .then(response => {
                        // Если есть соответствующий ресурс в кэше, возвращаем его
                        if (response) {
                            self.clients.matchAll().then(clients => {
                                clients.forEach(client => {
                                    client.postMessage({ type: 'log', message: `has ${}` });
                                });
                            });
                            return response;
                        } else {
                            self.clients.matchAll().then(clients => {
                                clients.forEach(client => {
                                    client.postMessage({ type: 'log', message: 'no' });
                                });
                            });
                        }

                        // В противном случае выполняем сетевой запрос к бекенду
                        return fetch(event.request)
                            .then(fetchResponse => {
                                self.clients.matchAll().then(clients => {
                                    clients.forEach(client => {
                                        client.postMessage({ type: 'log', message: 'new' });
                                    });
                                });
                                // Проверяем, что получен корректный ответ
                                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                                    return fetchResponse;
                                }

                                // Клонируем полученный ответ и сохраняем его в кэше
                                const responseToCache = fetchResponse.clone();
                                cache.put(event.request, responseToCache);

                                return fetchResponse;
                            });
                    });
            })
    );
});*/

/*caches.open('api-cache').then(cache => {
    return cache.keys().then(requests => {
        requests.forEach(request => {
            console.log(request.url);
        });
    });
});*/


