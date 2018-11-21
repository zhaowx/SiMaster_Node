var express = require('express');
var app = express();
var logger = require('./lib/application/logger')('app.js');
var server = require('http').createServer(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var path = require('path');
var cookieSession = require('cookie-session');
var config = require('./config');

app.use(cookieParser(config.cookieParser));
app.use(cookieSession(config.cookieSession));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.set('view cache', false);
swig.setDefaults({cache: false});
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.host);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , x-seekstock-staffId');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    req.method == 'OPTIONS' ? res.sendStatus(200) : next();
});

try {
    require('./routes/allRoutes')(app);
} catch (err) {
    console.log(err);
}


(async function () {
    server.listen(config.port);
    logger.info('** listening http on port: ' + config.port);
})();


