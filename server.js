const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
	fs.readFile('./dist/index.html', 'UTF-8', (err, data) => {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
	});
});

server.listen(process.env.PORT || 8000);