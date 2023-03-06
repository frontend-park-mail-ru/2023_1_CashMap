const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_PORT = 8000;
const STATIC_PATH = './public';
const PAGE_404 = fs.readFileSync('public/404.html');

const TYPES = {
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    svg: 'image/svg+xml',
    ttf: 'font/ttf',
};

const server = http.createServer((request, response) => {
    const {url} = request;
    const normalizedUrl = url === '/' ? '/index.html' : url;
    const fileExt = path.extname(normalizedUrl).substring(1);
    const restype = TYPES[fileExt];


    console.log(normalizedUrl);
    fs.readFile(`${STATIC_PATH}${normalizedUrl}`, (err, data) => {
        if (err) {
            response.write(PAGE_404);
            response.end();
            console.log('file not found 404');
            return;
        }

        response.writeHead(200, {'Content-Type': restype});
        response.write(data);
        response.end();
    })
});

console.log(`Server listening port ${SERVER_PORT}`);
server.listen(SERVER_PORT);
