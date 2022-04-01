const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');

function getETHMaterialFromPath(hdwalletETH, path) {
  const wallet = hdwalletETH.derivePath(path).getWallet()
  const address = `0x${wallet.getAddress().toString('hex')}`
  const privateKey = "0x" + wallet.getPrivateKey().toString('hex');
  return {privateKey, address};
}

function ethereum_private_key(hdwalletETH) {
    return path => getETHMaterialFromPath(hdwalletETH, path)["privateKey"];
}

function ethereum_address(hdwalletETH) {
    return path => getETHMaterialFromPath(hdwalletETH, path)["address"];
}

module.exports = mnemonic => function (Liquid) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const hdwalletETH = hdkey.fromMasterSeed(seed)
  this.registerFilter('ethereum_private_key', ethereum_private_key(hdwalletETH));
  this.registerFilter('ethereum_address', ethereum_address(hdwalletETH));
}
