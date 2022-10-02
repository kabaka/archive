import {
  IArchiveProcessor,
  IArchiveRecord,
} from 'archive-types';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
// eslint-disable-next-line sort-imports
import { ArchiveConfiguration } from '../config.js';
import { Log } from '../log.js';

class ArchiveProcessorPdf implements IArchiveProcessor {
  mimeTypes = [ 'application/pdf' ];

  computerVisionClient: ComputerVisionClient;

  constructor() {
    this.computerVisionClient = new ComputerVisionClient(
      new ApiKeyCredentials({
        inHeader: {
          'Ocp-Apim-Subscription-Key': ArchiveConfiguration.azureComputerVision.key,
        },
      }),
      ArchiveConfiguration.azureComputerVision.endpoint,
    );
  }

  processRecord(record: IArchiveRecord) {
    if (!this.mimeTypes.includes(record.metadata.mimeType)) {
      throw new Error();
    }
    Log.debug('ArchiveProcessorPdf.processRecord()', record);
    return record;
  }
}

export { ArchiveProcessorPdf };
