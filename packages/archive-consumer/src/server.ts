import {
  ArchiveProcessor,
  ArchiveStorage,
  Log,
} from 'archive-core';
import { ArchiveIngestorFilesystem } from './consumers/filesystem.js';

Log.info('Archive is starting.');

Log.info('Initializing processors.');

ArchiveProcessor.initialize();

Log.info('Initializing filesystem watcher.');

// TODO make this look more like processors.
ArchiveIngestorFilesystem.start();

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
