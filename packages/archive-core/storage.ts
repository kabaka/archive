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
}
