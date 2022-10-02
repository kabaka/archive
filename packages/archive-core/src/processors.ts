import { IArchiveProcessor, IArchiveRecord } from 'archive-types';
import { ArchiveProcessorTxt } from './processors/txt.js';
import { ArchiveProcessorPdf } from './processors/pdf.js';

export namespace ArchiveProcessor {
  const map: any = {};

  export const initialize = () => {
    [
      new ArchiveProcessorPdf(),
      new ArchiveProcessorTxt(),
    ].forEach((processor: IArchiveProcessor) => {
      processor.mimeTypes.forEach((mimeType) => {
        if (map[mimeType] === undefined) {
          map[mimeType] = [];
        }

        map[mimeType].push(processor);
      });
    });
  };

  export const processRecord = (record: IArchiveRecord) => {
    if (map[record.metadata.mimeType] === undefined) {
      throw new Error(`no processor for ${record.metadata.mimeType}`);
    }

    map[record.metadata.mimeType].forEach((processor) => {
      processor.processRecord(record);
    });
  };
}
