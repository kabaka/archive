const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { opendir, realpath, rename, stat } = require('fs').promises;
const path = require('path');

console.log('Archive is starting.')
console.log('Preparing HTTP Server.')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true))
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
 
console.log('Preparing file watcher.')

// TODO: move all this to other files
// const { FileWatcher } = require('./consumer/file-watcher.ts');

const Database = require('arangojs').Database;
const { resolve } = require('path');
const db = new Database('http://127.0.0.1:8529');

const interval = 1000; // wait 5 seconds between scans
const dirs = {
  ingestion: './ingestion/',
  processing: './processing/',
  storage: './storage/',
};

const ingestFile = (filePath) => {
  const ingest = (resolve, reject) {
    const processingPath = await processNewFile(filePath);
    const storagePath = await storeProcessedFile(processingPath);
    console.log('Done:', storagePath);
  }

  return new Promise(ingest)
}

const processNewFile = async (oldPath) => {
  const process = (resolve, reject) => {
    // TODO: add pre-process checks, such as file size and format
    const sanitizedName = oldPath.replace(/^ingestion\//, '').replace(/[^a-zA-Z0-9]/g, '-');
    const name = path.basename(oldPath);
    const newPath = path.join(dirs.processing, sanitizedName);

    try {
      await rename(oldPath, newPath);

      console.log('Processing started:', name);
    } catch (err) {
      reject(err)
    }

    const stats = await stat(newPath);

    console.log('stat:', stats);

    if (stats.size === 0) {
      console.log('Ingesting empty file:', name);
      return resolve(newPath);
    }

    return resolve(newPath);
  }
};

const storeProcessedFile = (name) => {
  const filePath = path.join(dirs.storage, name);
  return rename(path.join(dirs.processing, name), filePath)
};

const ingestDirectory = (name) => {
  const ingest = (resolve, reject) => {
    const dir = await opendir(name);

    for await (const dirent of dir) {
      const myPath = path.join(name, dirent.name);

      if (dirent.isDirectory()) {
        console.log(myPath);
        await ingestDirectory(myPath);
      } else {
        ingestFile(myPath);
      }
    }
  }
  return new Promise(ingest);
};

const FileWatcher = async () => {
  const scan = async () => {
    try {
      ingestDirectory(dirs.ingestion);
    } catch (err) {
      console.error('Error while checking for new files:', err);
    }

    setTimeout(scan, interval);
  }

  scan();
};

FileWatcher();