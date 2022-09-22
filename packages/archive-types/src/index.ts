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
  data: any;
  id: string;
  metadata: any;
  mimeType: string;
  status: ArchiveRecordStatus;
  addTag(tagName: string);
}

interface IArchiveRecordInput {
  data: any;
  id: string;
  metadata: any;
  mimeType: string;
  status: ArchiveRecordStatus;
}

interface IArchiveStorageClient {
  configuration: object,
  addTag(tag: IArchiveTag, record: IArchiveRecord),
  createMetadata(record: IArchiveRecord),
  createRecord(record: IArchiveRecord),
  destroyRecord(record: string | IArchiveRecord),
  getRecord(recordId: string),
  getTagRecords(tag: IArchiveTag): Promise<IArchiveRecord[]>,
  getTags(prefix?: string): Promise<IArchiveTag[]>,
  removeTag(tag: IArchiveTag, record: IArchiveRecord),
  updateRecord(record: IArchiveRecord),
}

interface IArchiveTag {
  name: string;
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

export {
  ArchiveRecordStatus,
};

export type {
  IArchiveProcessor,
  IArchiveRecord,
  IArchiveRecordInput,
  IArchiveStorageClient,
  IArchiveTag,
  IStorageConfiguration,
  IStorageContainer,
};
