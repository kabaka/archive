/* eslint-disable no-param-reassign */
import {
  IArchiveProcessor,
  IArchiveRecord,
} from 'archive-types';
import { Log } from '../log.js';

class ArchiveProcessorTxt implements IArchiveProcessor {
  mimeTypes = [ 'text/plain' ];

  // eslint-disable-next-line class-methods-use-this
  processRecord(record: IArchiveRecord) {
    Log.debug('ArchiveProcessorTxt.processRecord() before', record);

    const recordDataStr = record.data.toString('utf8');

    record.metadata.wordCount = recordDataStr.trim().split(/\s+/u).length;
    record.metadata.lineCount = recordDataStr.split(/\n/u).length;

    Log.debug('ArchiveProcessorTxt.processRecord() after', record);

    return record;
  }
}

export { ArchiveProcessorTxt };
