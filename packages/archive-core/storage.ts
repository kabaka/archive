import { ArchiveRecordStatus, IArchiveRecord, IArchiveTag } from 'archive-types/types.js';
import { ArchiveConfiguration } from './config.js';
import { S3Storage } from './storage/s3.js';

export namespace ArchiveStorage {
  const createStorage = (storageConfig) => {
    switch (storageConfig.type) {
      case 's3':
        return new S3Storage(storageConfig.config);
      default:
        throw new Error(`invalid storage type '${storageConfig.type}' in config`);
    }
  };

  export const metadata = createStorage(ArchiveConfiguration.storage.metadata);
  export const processed = createStorage(ArchiveConfiguration.storage.processed);
  export const processing = createStorage(ArchiveConfiguration.storage.processing);
  export const tags = createStorage(ArchiveConfiguration.storage.tags);

  export const getTags = () => {
    return tags.getTags();
  };

  export const addTag = async (tag: IArchiveTag, record: IArchiveRecord) => {
    await tags.addTag(tag, record);
  };

  export const removeTag = async (tag: IArchiveTag, record: IArchiveRecord) => {
    await tags.removeTag(tag, record);
  };

  export const storeArchiveRecordMetadata = async (record: IArchiveRecord) => {
    await metadata.createMetadata(record);
  };

  export const storeArchiveRecord = async (record: IArchiveRecord) => { 
    await storeArchiveRecordMetadata(record);

    switch (record.status) {
      case ArchiveRecordStatus.new:
      case ArchiveRecordStatus.processing:
        await processing.createRecord(record);
        break;
      case ArchiveRecordStatus.processed:
        await processed.createRecord(record);
        await processing.destroyRecord(record);
        break;
      case ArchiveRecordStatus.error:
        throw new Error('attempted to write ArchiveRecord in error state');
        break;
    }
  };
}
