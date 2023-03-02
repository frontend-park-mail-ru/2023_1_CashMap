const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_PORT = 8002;
const htmlpath = './html';
const page404 = fs.readFileSync('html/404.html');

const TYPES = {
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    svg: 'image/svg+xml',
    ttf: 'font/ttf',
};

const server = http.createServer((request, response) => {
    const {url} = request;
    const normalizedUrl = url === '/' ? '/authorization.html' : url;
    const fileExt = path.extname(normalizedUrl).substring(1);
    const restype = TYPES[fileExt];


    console.log(normalizedUrl);
    fs.readFile(`${htmlpath}${normalizedUrl}`, (err, data) => {
        if (err) {
            response.write(page404);
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
