var cluster = require('cluster');
var bytes = require('bytes');
var config = require('../config/config');
var fs = require('fs');
var path = require('path');

var winston = require('winston');
var logger = [];

exports.initLogger = function (name) {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({
                name: name + '-error-file',
                filename: '../../logs/' + name + '-error.log',
                level: 'error'
            }),
            new (winston.transports.File)({
                name: name + '-info-file',
                filename: '../../logs/' + name + '-info.log',
                level: 'info'
            })
    ]
    });
};

exports.logger = logger;

exports.logRequest = function (req, res, next) {
    if (config.verbose) {

        var sock = req.socket;
        req._startTime = new Date;
        req._remoteAddress = sock.socket ? sock.socket.remoteAddress : sock.remoteAddress;

        function logRequest() {
            res.removeListener('finish', logRequest);
            res.removeListener('close', logRequest);

            var status = res.statusCode
                        , len = parseInt(res.getHeader('Content-Length'), 10)
                        , color = 32;

            if (status >= 500) color = 31
            else if (status >= 400) color = 33
            else if (status >= 300) color = 36;

            len = isNaN(len)
                        ? ''
                        : len = ' - ' + bytes(len);

            var line = '\x1b[90m' + req.method
                        + ' ' + req.originalUrl + ' '
                        + '\x1b[' + color + 'm' + res.statusCode
                        + ' \x1b[90m'
                        + (new Date - req._startTime)
                        + 'ms' + len
                        + '\x1b[0m';

            if (null == line) return;
            logger.log(line);
        };

        res.on('finish', logRequest);
        res.on('close', logRequest);
    }
    next();
}
