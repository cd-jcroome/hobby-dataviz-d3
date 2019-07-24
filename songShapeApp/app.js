const http = require('http');
const mdt = require('./mydatetime');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/Plain');
    res.write(`Hello, World\n It\'s currently ${mdt.myDateTime()}`)
    res.end('');
});

server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`);
});