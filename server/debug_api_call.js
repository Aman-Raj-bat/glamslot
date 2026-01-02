const http = require('http');

console.log("Testing API...");

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/slots/available?date=2026-01-03',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
