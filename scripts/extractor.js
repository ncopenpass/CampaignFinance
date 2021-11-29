'use strict';

const fs = require('fs')
let AdmZip = require("adm-zip");
let path = require("path");

// reading archives
let zip = new AdmZip("data.zip");
zip.extractAllTo("", true);
const mainEntry = zip.getEntries()[0].entryName;
fs.readdirSync(mainEntry).forEach(file => {
    console.log('Copying file: ' + file);
    fs.renameSync(path.join(mainEntry, file), file);
  });
fs.rmdirSync(mainEntry);