import * as crypto from "crypto";
import { ArchiveProcessor } from "./processor/processor";
import { Slug } from "./slug.js";
import { StorageContainer } from "./storage/storage";
import { Tag } from "./tag.js";

enum ArchiveRecordStatus {
  new,
  processing,
  processed,
  error,
}

interface ArchiveRecordObj {
  data: any;
  id: string;
  metadata: object;
  mimeType: string | void;
  status: ArchiveRecordStatus;
}

class ArchiveRecord implements ArchiveRecordObj {
  data: any;
  id: string;
  metadata: object;
  mimeType: string | void;
  processors: object;
  status: ArchiveRecordStatus;
  storage: StorageContainer;
  tags: string[];

  constructor(
    storage: StorageContainer,
    processors: object,
    record: ArchiveRecordObj | null = null
  ) {
    this.data = record?.data ?? null;
    this.id = record?.id ?? crypto.randomUUID();
    this.metadata = record?.metadata ?? {};
    this.mimeType = record?.mimeType ?? undefined;
    this.status = record?.status ?? ArchiveRecordStatus.new;
    this.tags = [];

    this.storage = storage;
    this.processors = processors;
  }

  async addTag(tagName: string) {
    const tag = new Tag(tagName);

    return await this.storage.tags.addTag(tag, this);
  }

  async removeTag(tagName: string) {
    const tag = new Tag(tagName);

    return await this.storage.tags.removeTag(tag, this);
  }

  async process() {
    try {
      const mimeType = this.metadata["mimeType"];

      await this.beginProcessing();

      console.log("process()", this, mimeType, this.processors[mimeType]);

      if (this.processors[mimeType] instanceof Array) {
        this.processors[mimeType].forEach((processor: ArchiveProcessor) => {
          console.log("-- process()", this, processor);
          processor.processRecord(this);
        });
      } else {
        throw `no processors available for ${mimeType}`;
      }

      await this.finishProcessing();
    } finally {
      this.flushMetadata();
    }
  }

  async beginProcessing() {
    this.status = ArchiveRecordStatus.processing;

    return await this.storage.processing.createRecord(this);
  }

  async finishProcessing() {
    if (this.status !== ArchiveRecordStatus.processing) {
      throw `cannot finishProcessing() for ${this}; record is currently ${this.status}`;
    }

    try {
      await this.storage.processed.createRecord(this);
      await this.storage.processing.destroyRecord(this);

      this.status = ArchiveRecordStatus.processed;
    } catch (err) {
      this.status = ArchiveRecordStatus.error;

      throw err;
    }
  }

  async flushMetadata() {
    console.log("flushMetadata() writing object", this.toString());
    await this.storage.metadata.createMetadata(this);
  }

  toString() {
    return this.id;
  }
}

export { ArchiveRecord, ArchiveRecordStatus };
