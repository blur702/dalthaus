const http = require('http');

const PORT = 3000;
const REDIRECT_TO = 'http://localhost:3002';

const server = http.createServer((req, res) => {
    const redirectUrl = `${REDIRECT_TO}${req.url}`;
    res.writeHead(301, { 'Location': redirectUrl });
    res.end();
});

server.listen(PORT, () => {
    console.log(`Redirect server running on port ${PORT}`);
    console.log(`All requests will be redirected to ${REDIRECT_TO}`);
});