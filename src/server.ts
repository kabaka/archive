import { ArchiveIngestorFilesystem } from './ingesters/filesystem.js';
import { ArchiveProcessor } from './processors.js';
import { Log } from './log.js';

Log.info('Archive is starting.');

Log.info('Initializing processors.');

ArchiveProcessor.initialize();

Log.info('Initializing filesystem watcher.');

// TODO make this look more like processors.
ArchiveIngestorFilesystem.startScanning();

Log.info('Done starting.');
