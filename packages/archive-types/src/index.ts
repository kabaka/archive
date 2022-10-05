/* Enums */

enum ArchiveRecordStatus {
  new,
  processing,
  processed,
  error,
}

/* Interfaces */

interface IArchiveProcessor {
  mimeTypes: string[];
  processRecord(record: IArchiveRecord): IArchiveRecord;
}

interface IArchiveRecord {
  addTag(tagName: string);
  data: any;
  id: string;
  metadata: any;
  removeTag(tagName: string);
  status: ArchiveRecordStatus;
  tags: Promise<IArchiveTag[]>;
}

interface IArchiveRecordInput {
  data: any;
  id: string;
  metadata: any;
  status: ArchiveRecordStatus;
}

interface IArchiveStorageClient {
  configuration: object,
  addTag(tag: IArchiveTag, record: IArchiveRecord),
  createMetadata(record: IArchiveRecord),
  createRecord(record: IArchiveRecord),
  createTag(tag: IArchiveTag): void,
  destroyRecord(record: string | IArchiveRecord),
  getRecord(recordId: string),
  getTagRecords(tag: IArchiveTag): Promise<IArchiveRecord[]>,
  getTags(prefix?: string): Promise<IArchiveTag[]>,
  removeTag(tag: IArchiveTag, record: IArchiveRecord),
  updateRecord(record: IArchiveRecord),
}

interface IArchiveTag {
  name: any;
  nameCache: string;
  partitionName: string;
  records: IArchiveRecord[];
  slug: string;
}

interface IStorageConfiguration {
  metadata: any,
  processed: any,
  processing: any,
  tags: any,
}

interface IStorageContainer {
  metadata: IArchiveStorageClient,
  processed: IArchiveStorageClient,
  processing: IArchiveStorageClient,
  tags: IArchiveStorageClient,
}

export { ArchiveRecordStatus };

export type {
  IArchiveProcessor,
  IArchiveRecord,
  IArchiveRecordInput,
  IArchiveStorageClient,
  IArchiveTag,
  IStorageConfiguration,
  IStorageContainer,
};
