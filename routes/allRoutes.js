module.exports = function (app) {
    app.use('/api/users', require('./users/users.route.js'));
    app.use('/', require('./web.route.js'));
};


