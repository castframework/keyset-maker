const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;

async function initLedger () {
    return TransportNodeHid;
}

module.exports = initLedger;