import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  S3Client,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BuildMiddleware, HttpRequest } from '@aws-sdk/types';
import { IArchiveRecord, IArchiveStorageClient, IArchiveTag } from 'archive-types';
import { ArchiveRecord } from '../record.js';
import { Log } from '../log.js';
import { ArchiveTag } from '../tag.js';
import { ArchiveStorage } from '../storage.js';

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
    const client = new S3Client(configuration.client);
    const middlewareName = 'presignHeaderMiddleware';

    const presignHeaderMiddleware: BuildMiddleware<
    ServiceInputTypes,
    ServiceOutputTypes
    > = (next) => async (args) => {
      const request = args.request as HttpRequest;
      request.headers.host = [request.hostname, 9000].join(':');

      return next(args);
    };

    const middlewareStack = client.middlewareStack.clone();

    middlewareStack.addRelativeTo(presignHeaderMiddleware, {
      name: middlewareName,
      relation: 'after',
      toMiddleware: 'hostHeaderMiddleware',
      override: true,
    });

    this.s3 = {
      middlewareStack,
      config: client.config,
      send: client.send,
    } as S3Client;
  }

  // eslint-disable-next-line class-methods-use-this
  streamToString(stream): Promise<string> {
    // window.alert(stream.read);
    return new Promise((resolve, reject) => {
      const chunks = [];

      const processChunk = ({ done, value }): any => {
        // alert('starting');

        if (done) {
          try {
            const result = Buffer.concat(chunks).toString('utf8');

            // window.alert(`done: ${result}`);

            resolve(result);

            return;
          } catch (err) {
            // eslint-disable-next-line no-alert
            alert(err);
          }
        }

        chunks.push(value);

        // alert(`${done} :: ${chunks.length}: ${chunks.join(', ')}`);

        // eslint-disable-next-line consistent-return
        return stream.read().then(processChunk);
      };

      try {
        stream.read().then(processChunk);
      } catch (err) {
        reject(err);
      }
    });
  }

  async createRecord(record: IArchiveRecord) {
    const params = {
      Key: record.id,
      Body: await record.data,
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
      metadata: await ArchiveStorage.getArchiveRecordMetadata(recordId),
      mimeType: response.ContentType,
      status: null, // XXX no way to determine this right now
    });
  }

  async getRecordData(recordId: string) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: recordId,
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);

    return this.streamToString(response.Body);
  }

  async getTagName(tag: IArchiveTag) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: `tags/${tag.partitionName}/${tag.slug}`,
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);

    return this.streamToString(response.Body);
  }

  async createMetadata(record: IArchiveRecord) {
    const params = {
      Body: JSON.stringify(await record.metadata),
      Bucket: this.configuration.bucket,
      ContentType: 'application/json',
      Key: record.id,
    };

    const command = new PutObjectCommand(params);

    this.s3.send(command);
  }

  async getMetadata(record: IArchiveRecord | string) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: typeof record === 'string' ? record : record.id,
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);
    // alert(JSON.stringify(Object.keys(response.Body)));
    try {
      const metadata = await this.streamToString(response.Body.getReader());

      // alert(`metadata: ${metadata.toString()}`);
      return JSON.parse(metadata);
    } catch (err) {
      // alert(err);
    }

    // XXX
    return '';
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
          const tag = new ArchiveTag(item.Key.split('/')[2]);
          tags.push(tag);
        });

        truncated = response.IsTruncated;

        if (truncated) {
          ContinuationToken = response.Contents.slice(-1)[0].Key;

          params.ContinuationToken = ContinuationToken;
        }
      } catch (err) {
        // Log.error(err);
        truncated = false;
        throw err;
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

        response.Contents.forEach(async (item) => {
          const record = new ArchiveRecord(item.Key.split('/')[3]);

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
