import {
  ArchiveConfiguration, ArchiveRecord, Log,
} from 'archive-core';
import {
  readFile, unlink,
} from 'fs/promises';
import { ArchiveRecordStatus } from 'archive-types';
import { join } from 'path';
import mime from 'mime';
import { opendirSync } from 'fs';

export namespace ArchiveIngestorFilesystem {
  const ingesting = {};

  const ingestFile = (filePath: string) => {
    const ingest = async (resolve, reject) => {
      if (ingesting[ filePath ] !== undefined) return;

      ingesting[ filePath ] = true;
      Log.debug('ingestFile() starting', filePath);

      const record = new ArchiveRecord();

      try {
        const mimeType = mime.getType(filePath);

        record.addTag(`mime-type: ${mimeType}`);
        record.addTag('Needs Review');

        record.data = await readFile(filePath);

        record.metadata = {
          created: Date.now(),
          mimeType,
          originalFilePath: filePath,
          size: record.dataCache.length,
        };

        Log.debug('ingestFile() prep done; uploading (processing) ', filePath);

        // put file in processing bucket and write metadata to metadata bucket
        await record.beginProcessing();

        // TODO integrity check before deleting local file
        Log.debug("ingestFile() upload to 'processing' storage done");

        Log.debug('ingestFile() processing', filePath);

        await record.process();

        Log.debug(
          "ingestFile() processing done; uploading to 'processed' storage",
          filePath,
        );

        Log.debug('ingestFile() finished; deleting local file', filePath);

        await unlink(filePath);
        delete ingesting[ filePath ];
        resolve(record);
      } catch (err) {
        record.status = ArchiveRecordStatus.error;

        reject(err, record);
      }
    };

    return new Promise(ingest);
  };

  const ingestDirectory = (name: string) => {
    const ingest = async () => {
      Log.debug('ingest()', name);
      const dir = opendirSync(name);

      // eslint-disable-next-line no-restricted-syntax
      for await (const dirEnt of dir) {
        const myPath = join(name, dirEnt.name);

        if (dirEnt.isDirectory()) {
          // Log.debug(myPath);
          // eslint-disable-next-line no-await-in-loop
          await ingestDirectory(myPath);
        } else {
          ingestFile(myPath);
        }
      }
    };
    return new Promise(ingest);
  };

  export const scan = (consumer) => {
    Log.debug('scan()', consumer);
    try {
      ingestDirectory(consumer.dir);
    } catch (err) {
      Log.error('Error while checking for new files:', err);
    }

    setTimeout(scan, consumer.interval, consumer);
  };

  export const start = () => {
    ArchiveConfiguration.ingestion.forEach((consumer) => {
      if (consumer.type !== 'filesystem') {
        return;
      }

      scan(consumer);
    });
  };
}
