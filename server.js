const express = require('express');
const app = express();
app.listen(process.env.PORT || 8000);
app.use(express.static(__dirname + '/dist'));
