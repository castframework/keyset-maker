const bip39 = require('bip39');
const Ed25519 = require("ed25519-hd-key");
const TaquitoUtils = require("@taquito/utils");
const { InMemorySigner } = require("@taquito/signer");

async function getXTZMaterialFromPath(seed, path) {
  const { key } = Ed25519.derivePath(path, seed.toString("hex"));
  const rawPrivateKey = TaquitoUtils.b58cencode(key.slice(0, 32), TaquitoUtils.prefix.edsk2);
  const signer = await InMemorySigner.fromSecretKey(rawPrivateKey, null);
  const [
        privateKey,
        address,
      ] = await Promise.all([
        signer.secretKey(),
        signer.publicKeyHash(),
      ]);
  return {privateKey, address};
}

function tezos_private_key(seed) {
    return path => getXTZMaterialFromPath(seed, path).then( x => x["privateKey"]);
}

function tezos_address(seed) {
    return path => getXTZMaterialFromPath(seed, path).then( x => x["address"]);
}

module.exports = mnemonic => function (Liquid) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    this.registerFilter('tezos_private_key', tezos_private_key(seed));
    this.registerFilter('tezos_address', tezos_address(seed));
}
