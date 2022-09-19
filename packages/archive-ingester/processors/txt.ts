/* eslint-disable no-param-reassign */
import { IArchiveProcessor, IArchiveRecord } from 'archive-types/types.js';
import { Log } from 'archive-core/log.js';

class ArchiveProcessorTxt implements IArchiveProcessor {
  mimeTypes = ['text/plain'];

  // eslint-disable-next-line class-methods-use-this
  processRecord(record: IArchiveRecord) {
    Log.debug('ArchiveProcessorTxt.processRecord() before', record);

    const recordDataStr = record.data.toString('utf8');

    record.metadata.wordCount = recordDataStr.trim().split(/\s+/).length;
    record.metadata.lineCount = recordDataStr.split(/\n/).length;

    Log.debug('ArchiveProcessorTxt.processRecord() after', record);

    return record;
  }
}

export { ArchiveProcessorTxt };
