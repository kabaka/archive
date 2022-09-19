import { ArchiveIngestorFilesystem } from './ingesters/filesystem.js';
import { ArchiveProcessor } from './processors.js';
import { Log } from 'archive-core/log.js';
import { ArchiveStorage } from 'archive-core/storage.js';

Log.info('Archive is starting.');

Log.info('Initializing processors.');

ArchiveProcessor.initialize();

Log.info('Initializing filesystem watcher.');

// TODO make this look more like processors.
ArchiveIngestorFilesystem.startScanning();

const myGetTags = async () => {
  const tags = await ArchiveStorage.getTags();

  Log.debug('getTags()', tags);

  tags.forEach(async (tag) => {
    await tag.getRecords();
    Log.debug('getTags() records:', tag.records);
  });
};

myGetTags();

Log.info('Done starting.');
