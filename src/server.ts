import mime from "mime";
import { fstat, promises } from "fs";
const { opendir, realpath, rename, stat } = promises;
import { basename, join } from "path";
import * as lib from "./lib/index.js";
import { ArchiveRecord, ArchiveRecordStatus } from "./lib/archive-record.js";
import { config } from "./config.js";
import { readFile, unlink } from "node:fs/promises";
import { StorageContainer } from "./lib/storage/storage.js";

const log = (...args: any[]) => {
  // console.log(log.caller, ...args);
  console.log(...args);
};

log("Archive is starting.");

const storage: StorageContainer = {
  metadata: null,
  processed: null,
  processing: null,
  tags: null,
};

const processors = {};
const ingesting = {};

const interval = 1000; // wait 5 seconds between scans
const ingestionDir = "./ingestion/";

const ingestFile = (filePath) => {
  const ingest = async (resolve, reject) => {
    if (ingesting[filePath] != undefined) return;

    ingesting[filePath] = true;
    log("ingestFile() starting", filePath);

    const record = new ArchiveRecord(storage, processors);

    try {
      // TODO remove hard-coded path from replace() call
      record.metadata = {
        slug: filePath
          .replace(/^ingestion\//, "")
          .replace(/[^a-zA-Z0-9]/g, "-"),
        mimeType: mime.getType(filePath),
      };

      record.data = await readFile(filePath);
      record.metadata["originalFilePath"] = filePath;

      log("ingestFile() prep done; uploading (processing) ", filePath);

      // put file in processing bucket and write metadata to metadata bucket
      await record.beginProcessing();

      // TODO integrity check before deleting local file
      log("ingestFile() upload to 'processing' storage done");

      log("ingestFile() processing", filePath);

      record.process();

      log(
        "ingestFile() processing done; uploading to 'processed' storage",
        filePath
      );

      log("ingestFile() finished; deleting local file", filePath);

      await unlink(filePath);
      delete ingesting[filePath];
      resolve(record);
    } catch (err) {
      record.status = ArchiveRecordStatus.error;

      reject(err, record);
    }
  };

  return new Promise(ingest);
};

const ingestDirectory = (name) => {
  const ingest = async (resolve, reject) => {
    const dir = await opendir(name);

    for await (const dirEnt of dir) {
      const myPath = join(name, dirEnt.name);

      if (dirEnt.isDirectory()) {
        // log(myPath);
        await ingestDirectory(myPath);
      } else {
        ingestFile(myPath);
      }
    }
  };
  return new Promise(ingest);
};

const FileWatcher = async () => {
  const scan = async () => {
    log("FileWatcher.scan()");
    try {
      ingestDirectory(ingestionDir);
    } catch (err) {
      console.error("Error while checking for new files:", err);
    }

    setTimeout(scan, interval);
  };

  scan();
};

const createStorage = (storageConfig) => {
  switch (storageConfig.type) {
    case "s3":
      return new lib.storage.S3Storage(
        storage,
        processors,
        storageConfig.config
      );
    default:
      throw `invalid storage type '${storageConfig.type}' in config`;
  }
};

const prepare = () => {
  log("Building processor map.");

  Object.values(lib.processors).forEach((processor) => {
    processor.mimeTypes.forEach((mimeType) => {
      processors[mimeType] = processors[mimeType] ?? [];
      processors[mimeType].push(new processor());
    });
  });

  log("Creating storage clients.");

  storage.metadata = createStorage(config.storage.metadata);
  storage.processed = createStorage(config.storage.processed);
  storage.processing = createStorage(config.storage.processing);
  storage.tags = createStorage(config.storage.tags);
};

prepare();

log(storage);
log(processors);

log("Starting file watcher.");

FileWatcher();

log("Reached the end. Bye!");
