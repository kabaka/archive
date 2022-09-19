import * as crypto from 'crypto';
import {
  ArchiveRecordStatus,
  IArchiveRecord,
  IArchiveRecordInput,
} from 'archive-types/types.js';
import { ArchiveStorage } from './storage.js';
import { Tag } from './tag.js';
import { ArchiveProcessor } from './processors.js';

class ArchiveRecord implements IArchiveRecord {
  data: any;

  id: string;

  metadata: any;

  status: ArchiveRecordStatus;

  tags: string[];

  constructor(record: IArchiveRecord | IArchiveRecordInput | null = null) {
    this.data = record?.data ?? null;
    this.id = record?.id ?? crypto.randomUUID();
    this.metadata = record?.metadata ?? {};
    this.status = record?.status ?? ArchiveRecordStatus.new;
    this.tags = [];
  }

  get mimeType() {
    if (this.metadata.mimeType !== undefined) {
      return this.metadata.mimeType;
    }

    return 'application/octet-stream';
  }

  async addTag(tagName: string) {
    const tag = new Tag(tagName);

    return ArchiveStorage.tags.addTag(tag, this);
  }

  async removeTag(tagName: string) {
    const tag = new Tag(tagName);

    return ArchiveStorage.tags.removeTag(tag, this);
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

    return ArchiveStorage.processing.createRecord(this);
  }

  async finishProcessing() {
    if (this.status !== ArchiveRecordStatus.processing) {
      throw new Error(`cannot finishProcessing() for ${this}; record is currently ${this.status}`);
    }

    try {
      await ArchiveStorage.processed.createRecord(this);
      await ArchiveStorage.processing.destroyRecord(this);

      this.status = ArchiveRecordStatus.processed;
    } catch (err) {
      this.status = ArchiveRecordStatus.error;

      throw err;
    }
  }

  async flushMetadata() {
    await ArchiveStorage.metadata.createMetadata(this);
  }

  toString() {
    return this.id;
  }
}

export { ArchiveRecord, ArchiveRecordStatus };
