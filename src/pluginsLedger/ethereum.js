const AppEth = require("@ledgerhq/hw-app-eth").default;

async function getAddressFromPath(TransportNodeHid, path) {
  const transport = await TransportNodeHid.open("");
  const appEth = new AppEth(transport);
  const result = await appEth.getAddress(path);
  transport.close()
  console.log(`${path}: ${result.address}`);
  return result;
}

function ethereum_private_key(TransportNodeHid) {
    return path => "PRIVATE KEY ON LEDGER";
}

function ethereum_address(TransportNodeHid) {
    return path => getAddressFromPath(TransportNodeHid, path);
}

module.exports = TransportNodeHid => function (Liquid) {
  this.registerFilter('ethereum_private_key', ethereum_private_key(TransportNodeHid));
  this.registerFilter('ethereum_address', ethereum_address(TransportNodeHid));
}
