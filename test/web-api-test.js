var test = require('tape');
var webApi = require('../src');

function completeCoin() {
  return Object.create({
    name: 'asdf',
    getBalance() {},
    getBalances() {},
    getFullTx() {},
    getTxDetails() {},
    getTxIDs() {},
    getTxList() {},
    sendRawTx() {}
  });
}

test('A coin has no name', (t) => {
  let coin = completeCoin();
  coin.name = undefined;
  function createWebApi() {
    webApi(coin);
  }
  t.throws(createWebApi, 'Should reject a coin without name');
  t.end();
});

test('Accept complete coin interface', (t) => {
  function createWebApi() {
    webApi(completeCoin());
  }
  t.doesNotThrow(createWebApi, 'Creation does not throw');
  t.end();
});

test('Accept minimal implementation coin', (t) => {
  function createWebApi() {
    webApi({
      name: 'asdf',
      getBalance() {},
      getFullTx() {},
      getTxIDs() {},
      sendRawTx() {}
    });
  }
  t.doesNotThrow(createWebApi, 'Creation does not throw');
  t.end();
});

test('Accept coin with batch functions implemented', (t) => {
  function createWebApi() {
    webApi({
      name: 'asdf',
      getBalances() {},
      getTxDetails() {},
      getTxList() {},
      sendRawTx() {}
    });
  }
  t.doesNotThrow(createWebApi, 'Creation does not throw');
  t.end();
});
