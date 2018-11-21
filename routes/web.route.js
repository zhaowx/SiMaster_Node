var express = require('express');
var route = express.Router();
var path = require('path');


route.get(new RegExp('^[^.]+$'), function (req, res, next) {
    if (req.path.indexOf('/api') === 0) {
        return next();
    }
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});


module.exports = route;
