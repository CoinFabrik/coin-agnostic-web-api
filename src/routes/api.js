var express = require('express');
var router = express.Router();

function validateAddrs(req, res, next) {
  req.addrs = req.params.addrs.split(',');
  //TODO: Check that the addresses are valid
  //check(req, res, next, req.addrs);
  next();

}

function configureRoutes(coin) {
  router.get('/balance/:addrs', validateAddrs, (req, res, next) => {
    var addrs = req.addrs;
    coin.getBalances(addrs, (err, balances) => {
      if (err) {
        res.status(400);
        //TODO: Incorporate Ethererum Full Node codes and messages
        res.json({
          subCode: 1,
          message: "Error getting balances: " + err
        })
      } else {
        res.status(200);
        res.json(balances);
      }
    })
  });

  router.get('/transactions/:addrs', validateAddrs, (req, res, next) => {
    var addrs = req.addrs;
    coin.getTxList(addrs, (err, txLists) => {
      if (err) {
        res.status(400);
        //TODO: Incorporate Ethererum Full Node codes and messages
        res.json({
          subCode: 1,
          message: "Error getting transaction hashes: " + err
        })
      } else {
        res.status(200);
        res.json(txLists);
      }
    })
  })

  router.get('/transactionInfo/:txids', (req, res, next) => {
    var txids = req.params.txids.split(',');
    coin.getTxDetails(txids, (err, txs) => {
      if (err) {
        res.status(400);
        //TODO: Incorporate Ethererum Full Node codes and messages
        res.json({
          subCode: 1,
          message: "Error getting transactions: " + err
        })
      } else {
        res.status(200);
        res.json(txs);
      }
    })
  })

  return router;
}

module.exports = configureRoutes;
