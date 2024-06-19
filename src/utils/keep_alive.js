var http = require('http');

const keepAlive = ({text, port}) => {
    const portToUse = port || 3000;

    const server = http.createServer((_, res) => {
        res.writeHead(200);
        res.write("I'm up and running!\n");
        res.end(text || "I'm alive.");
    });
    server.listen(portToUse);

    return server;
}

module.exports = {
    keepAlive
}