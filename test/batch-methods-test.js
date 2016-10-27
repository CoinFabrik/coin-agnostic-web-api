var test = require('tape');
var webApi = require('../src');

test('addMissingBatchMethods', (t) => {
  t.plan(4);
  var coin = {
    name: 'somecoin',
    getBalance(addr, cb) {
      cb(null, addr + ' balance');
    },
    getFullTx(txid, cb) {
      cb(null, {
        id: txid
      });
    },
    getTxDetails(txids, cb) {
      cb(null, 'incorrect batch implementation');
    },
    getTxIDs(addr, options, cb) {
      cb(null, [
        addr + ' tx 1, letter:' + options.letter,
        addr + ' tx 2, letter:' + options.letter
      ]);
    },
    getTxParam() {},
    sendRawTx() {}
  };
  function createWebApi() {
    webApi(coin);
  }
  t.doesNotThrow(createWebApi, 'Creation does not throw');
  coin.getBalances(['a', 'b'], (err, balances) => {
    t.deepEqual(balances, {
      'a': 'a balance',
      'b': 'b balance'
    });
  });
  coin.getTxList(['a', 'b'], {letter: 'w'}, (err, txLists) => {
    t.deepEqual(txLists, {
      'a': ['a tx 1, letter:w', 'a tx 2, letter:w'],
      'b': ['b tx 1, letter:w', 'b tx 2, letter:w']
    });
  });
  coin.getTxDetails([1, 2], (err, txs) => {
    t.equal(
      txs,
      'incorrect batch implementation',
      'Don\'t override implemented batch methods'
    );
  })
});
