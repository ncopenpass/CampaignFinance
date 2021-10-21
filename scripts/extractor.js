'use strict';

const fs = require('fs')
let AdmZip = require("adm-zip");
let path = require("path");

// reading archives
let zip = new AdmZip("data.zip");
zip.extractAllTo("", true);
// fs.createReadStream('data.zip').pipe(unzip.Extract({ path: '.' }));
const mainEntry = zip.getEntries()[0].entryName;
// copySync(path.join(tempDir, mainEntry), srcPath, {overwrite: true});
fs.readdirSync(mainEntry).forEach(file => {
    console.log('Copying file: ' + file);
    fs.renameSync(path.join(mainEntry, file), file);
  });
fs.rmdirSync(mainEntry);