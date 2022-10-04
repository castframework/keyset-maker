#!/usr/bin/env node

const ksm = require('./keyset-maker');

var argv = require('minimist')(process.argv.slice(2), opts={boolean: ["ledger"]});

if (argv._.length == 0 || argv._["h"] == true) {
    console.log("Usage: keyser-maker [-h] [--ledger] templateDirectory [outputDirectory]")
    process.exit(1);h
}

if (argv["ledger"] == true) {
    argv._.length == 1 ?  ksm.mainLedger(argv._[0]) :  ksm.mainLedger(argv._[0], argv._[1]);
} else {
    argv._.length == 1 ?  ksm.main(argv._[0]) :  ksm.main(argv._[0], argv._[1]);
}
