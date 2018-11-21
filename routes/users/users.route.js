var route = require('express').Router();
var userService = require('../../lib/mid_service/userService');
var service = require('../../lib/application/serviceUtils');

route.post('/signin', service.handleWith(userService.signIn));
route.post('/signup', service.handleWith(userService.signUp));
route.post('/restpsw', service.handleWith(userService.resetPsw, {responseType: service.responseTypes.full}));
route.get('/me', service.handleWith(userService.getMyInfo));
route.put('/:id', service.handleWith(userService.updateUser, {responseType: service.responseTypes.full}));
route.get('/check-username/:userId', service.handleWith(userService.checkUserName));


module.exports = route;


