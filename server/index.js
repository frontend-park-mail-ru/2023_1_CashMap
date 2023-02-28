const http = require('http');
const fs = require('fs');

const SERVER_PORT = 8002;

const page404 = fs.readFileSync('html/404.html');

const server = http.createServer((request, response) => {
    const {url} = request;
    const normalizedUrl = url === '/' ? '/auth.html' : url;

    console.log(normalizedUrl);
    const filepath = `./html${normalizedUrl}`;
    fs.readFile(filepath, (err, data) => {
        if (err) {
            response.write(page404);
            response.end();
            return;
        }

        response.write(data);
        response.end();
    })
});

server.listen(SERVER_PORT);
