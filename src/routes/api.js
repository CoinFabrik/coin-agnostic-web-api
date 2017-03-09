var express = require('express');
var router = express.Router();
var responses = require('../tools/responses');
var format = require('../tools/format');

function configureRoutes(coin) {
  var validateAddrs = function (req, res, next) {
    req.addrs = format.isValidAddressCSV(req.params.addrs, res);
    if (!req.addrs) {
      return;
    }
    if (coin.validateAddress && !req.addrs.every(coin.validateAddress)) {
      responses.sendResponse(responses.E_ADDRESS_INVALID, res);
      return;
    }
    next();
  }

  var validateTxid = function (req, res, next) {
    req.txids = format.isValidTransactionCSV(req.params.txids, res);
    if (!req.txids) {
      return;
    }
    if (coin.validateTxid && !req.txids.every(coin.validateTxid)) {
      responses.sendResponse(responses.E_TX_HASH_INVALID, res);
      return;
    }
    next();
  }

  router.get('/balance/:addrs', validateAddrs, (req, res, next) => {
    var addrs = req.addrs;
    coin.getBalances(addrs, (err, balances) => {
      if (err) {
        if (err.errCode) {
          responses.sendResponse(err.errCode, res, err.errMessage);
        } else {
          res.status(400);
          res.json({
            subCode: 1,
            message: "Error getting balances: " + err
          })
        }
      } else {
        responses.sendResponse(responses.S_SUCCESS, res, balances);
      }
    })
  });

  router.get('/transactions/:addrs', validateAddrs, (req, res, next) => {
    var addrs = req.addrs;
    var options = {
      includeUnconfirmed: req.query.includeUnconfirmed,
      start: req.query.start,
      limit: req.query.limit,
      order: req.query.order
    };
    if (!format.isValidTransactionQuery(options, res)) {
      return;
    }
    if (coin.validateTxid && typeof options.start === 'string' && !coin.validateTxid(options.start)) {
      responses.sendErrorResponse(responses.E_QUERY_START_INVALID, res);
      return;
    }

    coin.getTxList(addrs, options, (err, txLists) => {
      if (err) {
        if (err.errCode) {
          responses.sendResponse(err.errCode, res, err.errMessage);
        } else {
          res.status(400);
          res.json({
            subCode: 1,
            message: "Error getting transaction hashes: " + err
          })
        }
      } else {
        responses.sendResponse(responses.S_SUCCESS, res, txLists);
      }
    })
  })

  router.get('/transactionInfo/:txids', validateTxid, (req, res, next) => {
    coin.getTxDetails(req.txids, (err, txs) => {
      if (err) {
        if (err.errCode) {
          responses.sendResponse(err.errCode, res, err.errMessage);
        } else {
          res.status(400);
          res.json({
            subCode: 1,
            message: "Error getting transactions: " + err
          })
        }
      } else {
        responses.sendResponse(responses.S_SUCCESS, res, txs);
      }
    })
  })

  router.get('/transactionParams/:addrs', validateAddrs, (req, res, next) => {
    var addrs = req.params.addrs.split(',');
    var options = {
      includeUnconfirmed: req.query.includeUnconfirmed
    };
    coin.getTxParams(addrs, options, (err, params) => {
      if (err) {
        if (err.errCode) {
          responses.sendResponse(err.errCode, res, err.errMessage);
        } else {
          res.status(400);
          res.json({
            subCode: 1,
            message: 'Error getting tx params: ' + err
          })
        }
      } else {
        responses.sendResponse(responses.S_SUCCESS, res, params);
      }
    })
  })

  router.put('/rawTransaction', (req, res, next) => {
    var tx = req.body.transaction;
    //console.log('transaction: ' + tx);
    if (tx === null || tx === '') {
      responses.sendResponse(responses.E_SEND_NULL_TX_INVALID, res);
    } else {
      coin.sendRawTx(tx, (err, txid) => {
        if (err) {
          if (err.errCode) {
            responses.sendResponse(err.errCode, err.errMessage);
          } else {
            res.status(400);
            res.json({
              subCode: 1,
              message: "Error sending transaction: " + err
            })
          }
        } else {
          responses.sendResponse(responses.S_SUCCESS, res, {success: true, txid: txid});
        }
      })
    }
  })

  if (coin.getBlockchainInfo) {
    router.get('/blockchainInfo', (req, res, next) => {
      coin.getBlockchainInfo((err, info) => {
        if (err) {
          if (err.errCode) {
            responses.sendResponse(err.errCode, res, err.errMessage);
          } else {
            res.status(400);
            res.json({
              subCode: 1,
              message: 'Error getting blockchain info: ' + err
            })
          }
        } else {
          responses.sendResponse(responses.S_SUCCESS, res, info);
        }
      })
    })
  }

  if (coin.getUnconfirmedTxList) {
    router.get('/unconfirmedTransactions/:addrs', validateAddrs, (req, res, next) => {
      var addrs = req.addrs;
      coin.getUnconfirmedTxList(addrs, (err, txLists) => {
        if (err) {
          if (err.errCode) {
            responses.sendResponse(err.errCode, res, err.errMessage);
          } else {
            res.status(400);
            //TODO: Incorporate Ethererum Full Node codes and messages
            res.json({
              subCode: 1,
              message: "Error getting transaction hashes: " + err
            })
          }
        } else {
          res.status(200);
          res.json(txLists);
        }
      })
    })
  }


  return router;
}

module.exports = configureRoutes;
