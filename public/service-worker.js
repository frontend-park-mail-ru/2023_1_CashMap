self.addEventListener('install', async (event) => {
    console.log(1)
});

self.addEventListener('fetch', event => {
    console.log(2)
});

// Другие события и обработчики
