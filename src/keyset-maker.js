const fs = require("fs")
const fse = require('fs-extra');
const path = require("path")
const { Liquid } = require('liquidjs');

const bip39 = require('bip39');

const initLedger = require('./pluginsLedger/initLedger.js')

let mnemonic;
if ('MNEMONIC' in process.env) {
  mnemonic = process.env.MNEMONIC;
} else {
  mnemonic = bip39.generateMnemonic(256);
}

const getAllLiquidFiles = function(dirPath, arrayOfFilenames) {
  arrayOfFilenames = arrayOfFilenames || []

  files = fs.readdirSync(dirPath)
  files.forEach(function(filename) {
    if (fs.statSync(dirPath + "/" + filename).isDirectory()) {
      arrayOfFilenames = getAllLiquidFiles(dirPath + "/" + filename, arrayOfFilenames)
    } else {
      if (filename.endsWith(".liquid") === false) {
        return;
      }  
      arrayOfFilenames.push(path.join(dirPath, "/", filename))
    }
  })

  return arrayOfFilenames
}


async function main(templateDirectory, outputDirectory)  {
  var normalizedTemplateDirectory = path.normalize(templateDirectory);
  var engine = new Liquid();
  engine.plugin(require('./plugins/ethereum.js')(mnemonic));
  engine.plugin(require('./plugins/tezos.js')(mnemonic));

  const liquidFiles = getAllLiquidFiles(normalizedTemplateDirectory);

  liquidFiles.forEach(filename => {
    engine.renderFile(filename, {'mnemonic': mnemonic}).then(rendered => {
      const outputFilename = filename.replace(".liquid", "");
      if (outputDirectory) {
        fse.outputFileSync(outputFilename.replace(normalizedTemplateDirectory, outputDirectory), rendered);
      } else {
        fs.writeFileSync(outputFilename, rendered);
      }
    });
  });
}


async function mainLedger(templateDirectory, outputDirectory)  {
  var normalizedTemplateDirectory = path.normalize(templateDirectory);
  var engine = new Liquid();
  const TransportNodeHid = await initLedger();
  engine.plugin(require('./pluginsLedger/ethereum.js')(TransportNodeHid));
  engine.plugin(require('./pluginsLedger/tezos.js')(TransportNodeHid));

  const liquidFiles = getAllLiquidFiles(normalizedTemplateDirectory);

  liquidFiles.forEach(filename => {
    engine.renderFile(filename, {'mnemonic': mnemonic}).then(rendered => {
      const outputFilename = filename.replace(".liquid", "");
      if (outputDirectory) {
        fse.outputFileSync(outputFilename.replace(normalizedTemplateDirectory, outputDirectory+"/"), rendered);
      } else {
        fs.writeFileSync(outputFilename, rendered);
      }
    });
  });
}

module.exports = {
  main,
  mainLedger
};