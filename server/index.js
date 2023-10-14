const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_PORT = 9001;
const STATIC_PATH = './public';

const TYPES = {
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    svg: 'image/svg+xml',
    png: 'image/png',
    ttf: 'font/ttf',
    ico: 'image/x-icon',
    json: 'application/json',
    mp3: 'audio/mpeg',
};

const server = http.createServer((request, response) => {
    console.log(1);
    const {url} = request;
    let fileExt = path.extname(url).substring(1);
    let normalizedUrl;
    if (url === '/' || fileExt === '') {
        normalizedUrl = '/index.html';
        fileExt = 'html';
    } else {
        normalizedUrl = url;
    }


    const restype = TYPES[fileExt];

    fs.readFile(`${STATIC_PATH}${normalizedUrl}`, (err, data) => {
        if (err) {
            console.log(`not found ${STATIC_PATH}${normalizedUrl}`);
            response.writeHead(404);
            response.end();
            return;
        }

        response.writeHead(200, {'Content-Type': restype});
        response.write(data);
        response.end();
    })
});

console.log(`Server listening port ${SERVER_PORT}`);
server.listen(SERVER_PORT);
