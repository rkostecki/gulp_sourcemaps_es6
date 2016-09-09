var express = require('express'),
    app = express(),
    http = require('http'),
    httpServer = http.Server(app);

app.use(express.static(__dirname + '/build/local'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/build/local/index.html');
});
app.listen(8000);