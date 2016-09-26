var configureApp = require('./configure-app');
var startServer = require('./bin/www');
var apiRoutes = require('./routes/api');
var log = require('./tools/log');

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
  assertProp(coin, 'getBalance', 'getBalances');
  assertProp(coin, 'getFullTx', 'getTxDetails');
  assertProp(coin, 'getTxIDs', 'getTxList');
  assertProp(coin, 'getTxParam', 'getTxParams');
  assertProp(coin, 'sendRawTx');
}

function urlEncodeName(name) {
  return name.replace(/\s+/g, '').toLowerCase();
}

function webApi(coin) {
  checkInterface(coin);
  var app = configureApp((app) => {
    if (coin.registerExtraRoutes) {
      coin.registerExtraRoutes(app);
    }
    app.use('/api/' + urlEncodeName(coin.name), apiRoutes(coin));
  });

  return {
    start(cb) {
      startServer(app, cb);
    }
  }
}

module.exports = webApi;
