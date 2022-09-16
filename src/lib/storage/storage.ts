import { ArchiveRecord } from "../archive-record.js";
import { Tag } from "../tag.js";

interface StorageContainer {
  metadata: ArchiveStorage;
  processed: ArchiveStorage;
  processing: ArchiveStorage;
  tags: ArchiveStorage;
}

class ArchiveStorage {
  config: object;
  processors: object;
  storage: StorageContainer;

  constructor(
    storage: StorageContainer,
    processors: object,
    configuration: object
  ) {
    this.config = configuration;
    this.processors = processors;
    this.storage = storage;
  }

  createRecord(record: ArchiveRecord): void {
    throw "create() not is yet implemented for this storage type";
  }

  updateRecord(record: ArchiveRecord): void {
    throw "update() not is yet implemented for this storage type";
  }

  destroyRecord(record: string | ArchiveRecord): void {
    throw "destroy() not is yet implemented for this storage type";
  }

  getRecord(recordId: string): void {
    throw "fetch() not is yet implemented for this storage type";
  }

  async createMetadata(record: ArchiveRecord) {
    throw "createMetadata() not is yet implemented for this storage type";
  }

  async getTags(prefix?: string) {
    throw "getTags() not is yet implemented for this storage type";
  }

  async addTag(tag: Tag, record: ArchiveRecord) {
    throw "() not is yet implemented for this storage type";
  }

  async removeTag(tag: Tag, record: ArchiveRecord) {
    throw "() not is yet implemented for this storage type";
  }
}

export { ArchiveStorage };
export type { StorageContainer };
