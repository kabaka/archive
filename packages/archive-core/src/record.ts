import randomUUID from 'crypto-randomuuid';
import {
  ArchiveRecordStatus,
  IArchiveRecord,
  IArchiveRecordInput,
} from 'archive-types';
import { ArchiveProcessor } from './processors.js';
import { ArchiveStorage } from './storage.js';
import { ArchiveTag } from './tag.js';

class ArchiveRecord implements IArchiveRecord {
  dataCache: any;

  id: string;

  metadataCache: any;

  status: ArchiveRecordStatus;

  // tags: string[];

  constructor(record: IArchiveRecord | IArchiveRecordInput | string | null = null) {
    if (typeof record === 'string') {
      this.id = record;
    } else {
      // this.data = record?.data ?? null;
      this.id = record?.id ?? randomUUID();
      this.metadataCache = record?.metadata ?? {};
      this.status = record?.status ?? ArchiveRecordStatus.new;
    }

    // this.tags = [];
  }

  /*
  get mimeType() {
    if (this.metadata.mimeType !== undefined) {
      return this.metadata.mimeType;
    }

    return 'application/octet-stream';
  }
  */

  get storage() {
    switch (this.status) {
      case ArchiveRecordStatus.processed:
        return ArchiveStorage.processed;
      case ArchiveRecordStatus.processing:
      default:
        return ArchiveStorage.processing;
    }
  }

  get data(): Promise<any> {
    if (this.dataCache) {
      return new Promise((resolve) => {
        resolve(this.dataCache);
      });
    }

    return this.storage.getRecordData(this.id);
  }

  set data(val: any) {
    this.dataCache = val;
    this.storage.updateRecord(this);
  }

  get metadata() {
    if (this.metadataCache) {
      /* return new Promise((resolve) => {
        resolve(this.metadataCache);
      }); */
      return this.metadataCache;
    }

    return ArchiveStorage.getArchiveRecordMetadata(this.id);
  }

  set metadata(metadata: any) {
    this.metadataCache = metadata;

    this.flushMetadata();
  }

  get tags() {
    return ArchiveStorage.getRecordTags(this);
  }

  async addTag(tagName: string) {
    const tag = new ArchiveTag(tagName);

    return ArchiveStorage.addTag(tag, this);
  }

  async removeTag(tagName: string) {
    const tag = new ArchiveTag(tagName);

    return ArchiveStorage.removeTag(tag, this);
  }

  async process() {
    try {
      await this.beginProcessing();

      ArchiveProcessor.processRecord(this);

      await this.finishProcessing();
    } finally {
      this.flushMetadata();
    }
  }

  async beginProcessing() {
    this.status = ArchiveRecordStatus.processing;

    return ArchiveStorage.storeArchiveRecord(this);
  }

  async finishProcessing() {
    if (this.status !== ArchiveRecordStatus.processing) {
      throw new Error(`cannot finishProcessing() for ${this}; record is currently ${this.status}`);
    }

    try {
      this.status = ArchiveRecordStatus.processed;

      // this will move the record to the 'processed' storage
      await ArchiveStorage.storeArchiveRecord(this);
    } catch (err) {
      this.status = ArchiveRecordStatus.error;

      throw err;
    }
  }

  async flushMetadata() {
    this.metadataCache.modified = Date.now();
    await ArchiveStorage.storeArchiveRecordMetadata(this);
  }

  toString() {
    return this.id;
  }
}

export { ArchiveRecord, ArchiveRecordStatus };
