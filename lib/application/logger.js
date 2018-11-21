var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);
/**
 *
 * @param name
 * @param logEnvironment
 * @returns {Logger}
 */
module.exports = function (name, logEnvironment) {
    var logger = bunyan.createLogger({
        name: name || 'Unnamed logger',
        streams: [{
            level: 'info',
            type: 'raw',
            stream: prettyStdOut
        }]
    });
    if (logEnvironment) logger.info('ENVIRONMENT: %s', process.env.NODE_ENV || 'Development');
    return logger;
};