const express = require('express');
const app = express();
app.listen(process.env.PORT || 8000);
app.use(express.static(__dirname + '/week-dinner/docs'));

app.use((req, res, next) => {
	res.sendFile(__dirname + '/week-dinner/docs/index.html');
});