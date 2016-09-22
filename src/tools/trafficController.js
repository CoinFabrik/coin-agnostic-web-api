var requestIp = require('request-ip');
var config = require('../config/config');

var ipInfoObj = {};

exports.floodControl = function (req, res, next) {
    if (!config.floodControlDisabled) {
        var ip = requestIp.getClientIp(req);
        var ipInfo = ipInfoObj[req.ip];

        if (!ipInfo) {
            ipInfo = ipInfoObj[req.ip] = { requestTimes: [new Date()] };
        }
        else {
            ipInfo.requestTimes.push(new Date());
        }

        if (ipInfo.requestTimes.length > 50) {
            ipInfoObj[req.ip].requestTimes = ipInfo.requestTimes.slice(-50);
            var timeLast = ipInfo.requestTimes[ipInfo.requestTimes.length - 1];
            var timeFirst = ipInfo.requestTimes[ipInfo.requestTimes.length - 50];

            if (timeLast.getTime() - timeFirst.getTime() < 20000) {
                console.log('Delayed 20 seconds IP: ' + ip);
                setTimeout(function () {
                    next();
                }, 20000);
                return;
            }
        }
        else if (ipInfo.requestTimes.length > 10) {
            var timeLast = ipInfo.requestTimes[ipInfo.requestTimes.length - 1];
            var timeFirst = ipInfo.requestTimes[ipInfo.requestTimes.length - 10];

            if (timeLast.getTime() - timeFirst.getTime() < 3000) {
                console.log('Delayed 5 seconds IP: ' + ip);
                setTimeout(function () {
                    next();
                }, 5000);
                return;
            }
        }
    }

    next();
}
