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
    var options = {
      start: req.query.start,
      limit: req.query.limit,
      order: req.query.order
    };
    coin.getTxList(addrs, options, (err, txLists) => {
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

  router.get('/transactionParams/:addrs', validateAddrs, (req, res, next) => {
    var addrs = req.params.addrs.split(',');
    coin.getTxParams(addrs, (err, params) => {
      if (err) {
        res.status(400);
        res.json({
          subCode: 1,
          message: 'Error getting tx params: ' + err
        })
      } else {
        res.status(200);
        res.json(params);
      }
    })
  })

  router.put('/rawTransaction', (req, res, next) => {
    var tx = req.body.transaction;
    console.log('transaction: ' + tx);
    if (tx === null || tx === '') {
      res.status(400);
      res.json({
        subCode: 1,
        message: "Cannot send null tx"
      })
    } else {
      coin.sendRawTx(tx, (err, txid) => {
        if (err) {
          res.status(400);
          //TODO: Incorporate Ethererum Full Node codes and messages
          res.json({
            subCode: 1,
            message: "Error sending transaction: " + err
          })
        } else {
          res.status(200);
      res.json({success: true, txid: txid});
    }
    })
  }
  })

  return router;
}

module.exports = configureRoutes;
