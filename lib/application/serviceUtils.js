var util = require('util');
var _ = require('lodash');

/**
 *
 * @param handler Service method used to handle the command.
 * @param [options] {Object}
 * @param options.inMappers {Array} A list of functions which perform operations on the command
 * immediately before handling it.
 * @param options.outMappers {Array} A list of function to map the response with.
 * @param options.customParams {Object} An object containing key value pairs for any additional parameters.
 * @param options.responseType {String} Response type if different from standard responses.
 * @param options.setCookie {bool} If the underlying service returns an accessToken then set the cookie.
 * @returns {Function}
 */
exports.handleWith = function (handler, options) {
    options = options || {};
    options.inMappers = options.inMappers || [];
    options.outMappers = options.outMappers || [];
    return async function (req, res) {
        if (!handler) throw new Error('No handler has been specified for this route.');
        if (!res) throw new Error('Response object is required.');
        if (!req) throw new Error('Request object is required.');
        if (!options.responseType) options.responseType = responseMap[req.method] || exports.responseTypes.empty;
        var command = paramMergeMap[req.method](req);
        command._userContext = req.profile;
        options.inMappers.forEach(function (mapper) {
            command = mapper(command, req);
        });
        try {
            var data = await handler(command);
            if (options.setCookie && data.accessToken) {
                //console.log(data.accessToken);
                // exports.setCookie(res, data.accessToken); // cookie
            }
            return APIResponse(res, options.responseType)(data);
        } catch (err) {
            console.log(err);
            return exports.sendError(err, res);
        }
    };
};


exports.responseTypes = {
    full: 'full',
    idOnly: 'idOnly',
    empty: 'empty',
    /**
     * If service returns an item then return it entirely or
     * if not still return a 200 with no body.
     */
    fullOrEmpty: 'fullOrEmpty'
};

var APIResponse = function (res, responseType) {

    return function (serviceResponse) {
        if (responseType === exports.responseTypes.full) {
            if (!serviceResponse) return res.status(404).end();
            res.status(200);
            return res.send(serviceResponse).end();
        } else if (responseType === exports.responseTypes.idOnly) {
            if (!serviceResponse) return res.status(404).end();
            res.status(200);
            return res.send({id: serviceResponse.id}).end();
        } else if (responseType === exports.responseTypes.fullOrEmpty) {
            res.status(200);
            if (!serviceResponse) return res.end();
            return res.send(serviceResponse).end();
        }
        return res.status(200).end();
    };
};


var responseMap = {
    GET: exports.responseTypes.full,
    PUT: exports.responseTypes.empty,
    POST: exports.responseTypes.idOnly,
    DELETE: exports.responseTypes.empty
};

var paramMergeMap = {
    GET: function (req) {
        return _.merge(req.params, req.query);
    },
    POST: function (req) {
        return _.merge(req.params, req.body);
    },
    PUT: function (req) {
        return _.merge(req.params, req.body);
    },
    DELETE: function (req) {
        return _.merge(req.params, req.query);
    }
};

exports.sendError = function sendError (err, res) {
    if (err.category === 'Validation') {
        res.status(400).send(err.getBody());
    } else if (err.category === 'Forbidden') {
        res.status(403).send();
    } else {
        res.status(err.status || 500).send();
    }
};


exports.primeForPersistence = function (command, entityType) {
    if (command.id) {
        command.created = parseInt(command.created);
        command.updated = new Date().getTime();
    } else {
        command.entityType = entityType;
        command.updated = new Date().getTime();
    }
};

/**
 * Removes context properties (i.e. that start with _)
 * @param command
 */
exports.stripContext = function (command) {
    var response = {};
    for (var key in command) {
        if (!command.hasOwnProperty(key)) continue;
        if (key.indexOf('_') !== 0) {
            response[key] = command[key];

        }
    }
    return response;
};

exports.coerceToArray = function (value) {
    if (value && !util.isArray(value)) value = [value];
    return value;
};

exports.parse = function (serializedJson) {
    if (!serializedJson) return;
    return JSON.parse(serializedJson);
};

exports.applyUpdates = function (original, updates) {
    Object.keys(updates).forEach(function (updatesKey) {
        original[updatesKey] = updates[updatesKey];
    });
};

exports.setCookie = function (res, accessToken) {
    res.set('Set-Cookie', util.format('accessToken=%s; Path=/;', accessToken));
};





