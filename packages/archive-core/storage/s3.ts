import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { IArchiveRecord, IArchiveStorageClient, IArchiveTag } from 'archive-types/types.js';
import { Log } from '../log.js';
import { ArchiveRecord } from '../record.js';

import { Tag } from '../tag.js';

interface S3StorageConfig {
  client: object;
  bucket: string;
}

class S3Storage implements IArchiveStorageClient {
  baseMetadata: object;

  baseParams: object;

  configuration: S3StorageConfig;

  s3: S3Client;

  constructor(configuration: S3StorageConfig) {
    this.configuration = configuration;

    this.s3 = new S3Client(this.configuration.client);
  }

  async createRecord(record: IArchiveRecord) {
    const params = {
      Key: record.id,
      Body: record.data,
      Bucket: this.configuration.bucket,
      ContentType: record.metadata.mimeType,
    };

    const command = new PutObjectCommand(params);

    this.s3.send(command);
  }

  async updateRecord(record: IArchiveRecord) {
    this.createRecord(record);
  }

  async destroyRecord(record: string | IArchiveRecord) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: record.toString(),
    };

    const command = new DeleteObjectCommand(params);

    this.s3.send(command);
  }

  async getRecord(recordId: string) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: recordId,
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);

    return new ArchiveRecord({
      id: recordId,
      data: response.Body,
      metadata: null, // XXX
      mimeType: response.ContentType,
      status: null, // XXX
    });
  }

  async createMetadata(record: IArchiveRecord) {
    const params = {
      Body: JSON.stringify(record.metadata),
      Bucket: this.configuration.bucket,
      ContentType: 'application/json',
      Key: record.id,
    };

    const command = new PutObjectCommand(params);

    this.s3.send(command);
  }

  async getTags(prefix?: string) {
    let fullPrefix = 'tags/';

    if (prefix) {
      if (prefix.length < 2) {
        fullPrefix += prefix;
      } else {
        fullPrefix += `${prefix.slice(0, 2)}/${prefix}`;
      }
    }

    const params: ListObjectsV2CommandInput = {
      Bucket: this.configuration.bucket,
      Prefix: fullPrefix,
    };

    // borrowed from https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_ListObjects_section.html

    const tags = [];

    let truncated = true;
    let ContinuationToken: string;

    while (truncated) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await this.s3.send(new ListObjectsV2Command(params));

        response.Contents.forEach((item) => {
          const tag = new Tag(item.Key.split('/')[2]);
          tags.push(tag);
        });

        truncated = response.IsTruncated;

        if (truncated) {
          ContinuationToken = response.Contents.slice(-1)[0].Key;

          params.ContinuationToken = ContinuationToken;
        }
      } catch (err) {
        Log.error(err);
        truncated = false;
      }
    }

    return tags;
  }

  async getTagRecords(tag: IArchiveTag) {
    const params: ListObjectsV2CommandInput = {
      Bucket: this.configuration.bucket,
      Prefix: `tagged/${tag.partitionName}/${tag.slug}`,
    };

    // borrowed from https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_ListObjects_section.html

    const records = [];

    let truncated = true;
    let ContinuationToken;

    while (truncated) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await this.s3.send(new ListObjectsV2Command(params));

        response.Contents.forEach((item) => {
          const record = new ArchiveRecord({
            id: item.Key.split('/')[3],
            data: null, // XXX
            metadata: null, // XXX
            mimeType: null, // XXX
            status: null, // XXX
          });
          records.push(record);
        });

        truncated = response.IsTruncated;

        if (truncated) {
          ContinuationToken = response.Contents.slice(-1)[0].Key;

          params.ContinuationToken = ContinuationToken;
        }
      } catch (err) {
        Log.error(err);
        truncated = false;
      }
    }

    return records;
  }

  // eslint-disable-next-line no-underscore-dangle
  private async createTag(tag: IArchiveTag) {
    const params = {
      Body: tag.name,
      Bucket: this.configuration.bucket,
      ContentType: 'text/plain',
      Key: `tags/${tag.partitionName}/${tag.slug}`,
    };

    const command = new PutObjectCommand(params);

    this.s3.send(command);
  }

  async addTag(tag: IArchiveTag, record: IArchiveRecord) {
    // eslint-disable-next-line no-underscore-dangle
    this.createTag(tag);

    const params = {
      Body: '',
      Bucket: this.configuration.bucket,
      ContentType: 'text/plain',
      Key: `tagged/${tag.partitionName}/${tag.slug}/${record.id}`,
    };

    const command = new PutObjectCommand(params);

    await this.s3.send(command);
  }

  async removeTag(tag: IArchiveTag, record: IArchiveRecord) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: `tags/${tag.partitionName}/${tag.slug}/${record.id}`,
    };

    const command = new DeleteObjectCommand(params);

    this.s3.send(command);
  }
}

export { S3Storage };
