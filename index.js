var configureApp = require('./configure-app');
var serverStarter = require('./bin/www');
var apiRoutes = require('./routes/api');

function webApi(coin) {
  //check coin interface

  //coin.name
  //coin.registerExtraRoutes

  //tweak express app
  var app = configureApp((app) => {
    if (coin.registerExtraRoutes) {
      coin.registerExtraRoutes(app);
    }
    //register default routes here
    app.use('/api', apiRoutes(coin));
  });

  return {
    startServer(cb) {
      serverStarter(app, cb);
    }
  }
}

module.exports = webApi;
