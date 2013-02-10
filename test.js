var dirtySessions = require('./connect-dirty.js'), express = require('express'),
connect = require('connect');

var app = express()
.use(express.cookieParser())
.use(express.session({store: new dirtySessions(), secret: 'bro'}));

app.listen(8000);

app.get('/set/:key=:value', function(req, res){
    req.session[req.params.key] = req.params.value;
    res.send(req.session);
});

app.get('/get/:key', function(req, res){
    res.send(req.session[req.params.key]);
});

app.get('/clear', function(req, res){
    req.session.destroy();
    res.send(req.session);
});