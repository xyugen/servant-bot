var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHead(200);
    res.write("I'm up and running!\n");
    res.end('hello world\n');
}).listen(8080);