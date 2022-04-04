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
        publicKey,
      ] = await Promise.all([
        signer.secretKey(),
        signer.publicKeyHash(),
        signer.publicKey(),
      ]);
  return {privateKey, address, publicKey};
}

function tezos_private_key(seed) {
    return path => getXTZMaterialFromPath(seed, path).then( x => x["privateKey"]);
}

function tezos_address(seed) {
    return path => getXTZMaterialFromPath(seed, path).then( x => x["address"]);
}

function tezos_flextesa_material(seed) {
  return async (path) => {
    const rawMaterial = await getXTZMaterialFromPath(seed, path)
    return `${rawMaterial.publicKey},${rawMaterial.address},unencrypted:${rawMaterial.privateKey}`
  }
}

module.exports = mnemonic => function (Liquid) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    this.registerFilter('tezos_private_key', tezos_private_key(seed));
    this.registerFilter('tezos_address', tezos_address(seed));
    this.registerFilter('tezos_flextesa_material', tezos_flextesa_material(seed));
}
