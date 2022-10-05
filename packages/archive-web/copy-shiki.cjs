/* eslint-disable no-console */
const sourceModule = require.resolve('shiki');
const fs = require('node:fs');
const path = require('path');

const shikiSubdirectories = [
  'dist',
  'languages',
  'themes',
];

const copyShiki = (destinationPath) => {
  let pathArr = sourceModule.split(path.sep);

  pathArr = pathArr.slice(0, pathArr.length - 2);

  shikiSubdirectories.forEach((dir) => {
    const sourcePath = `${path.sep}${path.join(...pathArr, dir)}`;
    const myDestination = path.join(destinationPath, dir);

    console.log('copying', sourcePath, 'to', myDestination);

    fs.mkdirSync(myDestination, { recursive: true });
    fs.cpSync(sourcePath, myDestination, {
      force: true,
      recursive: true,
    });
  });

  console.log('done');
};

if (process.argv.length !== 3) {
  throw new Error('usage: node copy-shiki.cjs <shiki-destination>');
}

copyShiki(process.argv[ 2 ]);
