/* eslint-disable no-console */
const fontModule = require.resolve('@fluentui/font-icons-mdl2');
const fs = require('node:fs');
const path = require('path');

const copyFonts = (destination) => {
  let pathArr = fontModule.split(path.sep);

  pathArr = pathArr.slice(0, pathArr.length - 2);

  const fontPath = `${path.sep}${path.join(...pathArr, 'fonts')}`;

  console.log('copying', fontPath, 'to', destination);

  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(fontPath, destination, {
    force: true,
    recursive: true,
  });

  console.log('done');
};

if (process.argv.length !== 3) {
  throw new Error('usage: node copy-fonts.cjs <font-destination>');
}

copyFonts(process.argv[2]);
