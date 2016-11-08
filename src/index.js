var configureApp = require('./configure-app');
var startServer = require('./bin/www');
var apiRoutes = require('./routes/api');
var log = require('./tools/log');
var responses = require('./tools/responses');
var _async = require('async');
var _ = require('lodash');

//Map single methods to batch methods.
var batchMethods = {
  getBalance: 'getBalances',
  getFullTx: 'getTxDetails',
  getTxIDs: 'getTxList',
  getTxParam: 'getTxParams'
};

function assertProp(coin, single, batch) {
  if (!batch && !coin[single]) {
    throw 'Expected the coin to have "' + single + '" implemented';
  } else if (!coin[single] && !coin[batch]) {
    throw 'Expected the coin to have "' + single + '" or ' + batch +
     ' implemented';
  }
}

function checkInterface(coin) {
  assertProp(coin, 'name');
  assertProp(coin, 'sendRawTx');
  Object.keys(batchMethods).forEach(singleMethod => {
    assertProp(coin, singleMethod, batchMethods[singleMethod]);
  });
}

function addMissingBatchMethods(coin) {
  Object.keys(batchMethods).forEach(singleMethod => {
    var batchMethod = batchMethods[singleMethod];
    if(coin[batchMethod]) {
      return;
    }
    coin[batchMethod] = function(keys, options, cb) {
      _async.map(keys, (key, next) => {
        if (cb) {
          coin[singleMethod].call(coin, key, options, next);
        } else {
          coin[singleMethod].call(coin, key, next);
        }
      }, function(err, things) {
        cb = cb || options;
        if (err) {
          return cb(err);
        }
        cb(null, _.zipObject(keys, things));
      });
    }
  });
}

function urlEncodeName(name) {
  return name.replace(/\s+/g, '').toLowerCase();
}

function webApi(coin) {
  checkInterface(coin);
  addMissingBatchMethods(coin);
  var app = configureApp(coin, (app) => {
    if (coin.registerExtraRoutes) {
      coin.registerExtraRoutes(app);
    }
    app.use('/api/' + urlEncodeName(coin.name), apiRoutes(coin));
  });

  return {
    start(cb) {
      startServer(app, coin.port, cb);
    }
  }
}

webApi.responses = responses;

module.exports = webApi;
