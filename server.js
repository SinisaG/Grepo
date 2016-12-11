var express = require('express');
var app = express();
var path = require('path');

app.use('/static', express.static(path.join(__dirname + '/dist/static')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('*', function(req, res) {
    res.redirect(301, '/');
});

var port = process.env.PORT || 3000;
console.log('Serving app on port ' + port + ". Env: " + process.env.NODE_ENV);
app.listen(port);