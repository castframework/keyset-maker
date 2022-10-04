const Tezos = require("@ledgerhq/hw-app-tezos").default;
var Mutex = require('async-mutex').Mutex;

let cache = {};

const mutex = new Mutex();

async function getXTZMaterialFromPath(TransportNodeHid, path) {
  if (!(path in cache)) {
    if (!("transport" in cache)) {
      cache["transport"] = await TransportNodeHid.open("");
      if (!("tez" in cache)) {
        cache["tez"] = new Tezos(cache["transport"])
      }
    }
    const tezosAddress = await mutex.runExclusive(async () => cache["tez"].getAddress(path));
    cache[path] = tezosAddress;
    console.log(tezosAddress);  
  }
  return {privateKey: "PRIVATE KEY ON LEDGER", address: cache[path].address, publicKey: cache[path].publicKey};
}

function tezos_private_key(TransportNodeHid) {
    return path => getXTZMaterialFromPath(TransportNodeHid, path).then( x => x["privateKey"]);
}

function tezos_address(TransportNodeHid) {
    return path => getXTZMaterialFromPath(TransportNodeHid, path).then( x => x["address"]);
}

function tezos_flextesa_material(TransportNodeHid) {
  return async (path) => {
    const rawMaterial = await getXTZMaterialFromPath(TransportNodeHid, path)
    return `${rawMaterial.publicKey},${rawMaterial.address},unencrypted:${rawMaterial.privateKey}`
  }
}

module.exports = TransportNodeHid => function (Liquid) {
    this.registerFilter('tezos_private_key', tezos_private_key(TransportNodeHid));
    this.registerFilter('tezos_address', tezos_address(TransportNodeHid));
    this.registerFilter('tezos_flextesa_material', tezos_flextesa_material(TransportNodeHid));
}
