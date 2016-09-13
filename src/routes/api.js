var express = require('express');
var router = express.Router();

function validateAddrs(req, res, next) {
  req.addrs = req.params.addrs.split(',');
  //TODO: Check that the addresses are valid
  //check(req, res, next, req.addrs);
  next();

}

function configureRoutes(coin) {
  router.get('/balance/:addrs', validateAddrs, function(req, res, next) {
    var addrs = req.addrs;
    coin.getBalances(addrs, (err, balances) => {
      if (err) {
        res.status(400);
        res.json({
          subCode: 1,//TODO: Incorporate Ethererum Full Node codes
          message: "Error getting balances: " + err
        })
      } else {
        res.status(200);
        res.json(balances);
      }
    })
  });


  return router;
}

module.exports = configureRoutes;
