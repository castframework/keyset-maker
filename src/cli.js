#!/usr/bin/env node

const ksm = require('./keyset-maker');

var argv = require('minimist')(process.argv.slice(2));


if (argv._.length == 0) {
    console.log("Usage: keyser-maker templateDirectory [outputDirectory]")
    process.exit(1);
}

if (argv._.length == 1) {
    ksm.main(argv._[0]);
}

if (argv._.length == 2) {
    ksm.main(argv._[0], argv._[1]);
}
