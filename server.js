const express = require('express');
const app = express();
app.listen(process.env.PORT || 8000);
app.use(express.static(__dirname + '/docs'));

app.use((req, res, next) => {
	res.sendFile(__dirname + '/docs/index.html');
});