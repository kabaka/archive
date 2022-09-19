/* eslint-disable no-param-reassign */
import { Log } from '../log.js';
import { IArchiveProcessor, IArchiveRecord } from '../types.js';

class ArchiveProcessorTxt implements IArchiveProcessor {
  mimeTypes = ['text/plain'];

  // eslint-disable-next-line class-methods-use-this
  processRecord(record: IArchiveRecord) {
    Log.debug('ArchiveProcessorTxt.processRecord() before', record);

    const recordDataStr = record.data.toString('utf8');

    record.metadata.wordCount = recordDataStr.trim().split(/\s+/).length;
    record.metadata.lineCount = recordDataStr.split(/\n/).length;

    record.addTag('mime-type: text/plain');

    Log.debug('ArchiveProcessorTxt.processRecord() after', record);

    return record;
  }
}

export { ArchiveProcessorTxt };
