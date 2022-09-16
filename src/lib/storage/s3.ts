import { ArchiveStorage, StorageContainer } from "./storage.js";
import { ArchiveRecord } from "../archive-record.js";

import { Tag } from "../tag.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

interface S3StorageConfig {
  client: object;
  bucket: string;
}

class S3Storage extends ArchiveStorage {
  s3: any;
  baseParams: object;
  baseMetadata: object;

  declare config: S3StorageConfig;

  constructor(
    storage: StorageContainer,
    processors: object,
    config: S3StorageConfig
  ) {
    super(storage, processors, config);

    this.s3 = new S3Client(this.config.client);
  }

  async createRecord(record: ArchiveRecord) {
    const params = {
      Key: record.id,
      Body: record.data,
      Bucket: this.config.bucket,
      ContentType: record.metadata["mimeType"],
    };

    const command = new PutObjectCommand(params);

    return await this.s3.send(command);
  }

  updateRecord(record: ArchiveRecord) {
    throw `updateRecord() not implemented: update failed for ${record}`;
  }

  async destroyRecord(record: string | ArchiveRecord) {
    const params = {
      Bucket: this.config.bucket,
      Key: record.toString(),
    };

    const command = new DeleteObjectCommand(params);

    return await this.s3.send(command);
  }

  async getRecord(recordId: string) {
    const params = {
      Bucket: this.config.bucket,
      Key: recordId,
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);

    return new ArchiveRecord(this.storage, this.processors, {
      id: recordId,
      data: response.Body,
      metadata: null, // XXX
      mimeType: response.ContentType,
      status: null, // XXX
    });
  }

  async createMetadata(record: ArchiveRecord) {
    const params = {
      Body: JSON.stringify(record.metadata),
      Bucket: this.config.bucket,
      ContentType: "application/json",
      Key: record.id,
    };

    const command = new PutObjectCommand(params);

    return await this.s3.send(command);
  }

  async getTags(prefix?: string) {
    this.s3.listObjects();
  }

  async addTag(tag: Tag, record: ArchiveRecord) {
    const params = {
      Body: "",
      Bucket: this.config.bucket,
      ContentType: "text/plain",
      Key: `tags/${tag.getPartitionName()}/${tag.getSlug()}/${record.id}`,
    };

    const command = new PutObjectCommand(params);

    return await this.s3.send(command);
  }

  async removeTag(tag: Tag, record: ArchiveRecord) {
    const params = {
      Bucket: this.config.bucket,
      Key: `tags/${tag.getPartitionName()}/${tag.getSlug()}/${record.id}`,
    };

    const command = new DeleteObjectCommand(params);

    return await this.s3.send(command);
  }
}

export { S3Storage };
