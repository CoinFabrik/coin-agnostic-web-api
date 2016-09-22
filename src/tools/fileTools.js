var fs = require('fs');
var path = require('path');


exports.ensureDirectoryExistence = function (filePath) {
    var dirname = path.dirname(filePath);
    if (exports.directoryExists(dirname)) {
        return true;
    }
    exports.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

exports.directoryExists = function (path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (err) {
        return false;
    }
}

exports.createNewLogFile = function(logFile, errFnc) {
    try {
        exports.ensureDirectoryExistence(logFile);
        if (fs.existsSync(logFile)) {
            fs.renameSync(logFile, logFile.substring(0, logFile.length - 3) + (new Date()).getTime() + ".log");
        }
        fs.openSync(logFile, 'w');
    }
    catch (err) {
        if (errFnc)
            errFnc('ALERT: Cannot write log in path: ' + logFile + ' Error: ' + err);
    }
}
