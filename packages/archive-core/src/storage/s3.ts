import {
  BuildMiddleware,
  HttpRequest,
} from '@aws-sdk/types';
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
import {
  IArchiveRecord, IArchiveStorageClient, IArchiveTag,
} from 'archive-types';
import { ArchiveRecord } from '../record.js';
import { ArchiveStorage } from '../storage.js';
import { ArchiveTag } from '../tag.js';
import { Log } from '../log.js';

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
    > = (next) => (args) => {
      const request = args.request as HttpRequest;
      request.headers.host = [ request.hostname, 9000 ].join(':');

      return next(args);
    };

    const middlewareStack = client.middlewareStack.clone();

    middlewareStack.addRelativeTo(presignHeaderMiddleware, {
      name: middlewareName,
      override: true,
      relation: 'after',
      toMiddleware: 'hostHeaderMiddleware',
    });

    this.s3 = {
      config: client.config,
      middlewareStack,
      send: client.send,
    } as S3Client;
  }

  // eslint-disable-next-line class-methods-use-this
  streamToString(stream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks = [];

      const processChunk = ({
        done, value,
      }): any => {
        if (done) {
          const result = Buffer.concat(chunks).toString('utf8');
          resolve(result);

          return;
        }

        chunks.push(value);

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
      Body: await record.data,
      Bucket: this.configuration.bucket,
      ContentType: record.metadata.mimeType,
      Key: record.id,
    };

    const command = new PutObjectCommand(params);

    this.s3.send(command);
  }

  updateRecord(record: IArchiveRecord) {
    this.createRecord(record);
  }

  destroyRecord(record: string | IArchiveRecord) {
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
      data: response.Body,
      id: recordId,
      metadata: await ArchiveStorage.getArchiveRecordMetadata(recordId),
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

  async getTagName(tag: IArchiveTag | string): Promise<string> {
    const myTag = typeof tag === 'string' ? new ArchiveTag(tag) : tag;
    const params = {
      Bucket: this.configuration.bucket,
      Key: `tags/${myTag.partitionName}/${myTag.slug}`,
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);

    return this.streamToString(response.Body.getReader());
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

    try {
      const metadata = await this.streamToString(response.Body.getReader());

      return JSON.parse(metadata);
    } catch (err) {
      // alert(err);
    }

    return {};
  }

  async getTags(prefix?: string) {
    const tags = [];

    let fullPrefix = 'tags/';
    let truncated = true;
    let ContinuationToken: string;

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

    while (truncated) {
      try {
        // We have to disable no-await-in-loop since each loop is a serial
        // read. That is, it cannot be parallel.

        // eslint-disable-next-line no-await-in-loop
        const response = await this.s3.send(new ListObjectsV2Command(params));

        response.Contents.forEach((item) => {
          // XXX this doesn't expose the tags's name
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

  async getRecordTags(record: IArchiveRecord | string) {
    const tags = [];
    const recordId = typeof record === 'string' ? record : record.id;
    const prefix = `records-to-tags/${recordId}`;

    let truncated = true;
    let ContinuationToken: string;

    const params: ListObjectsV2CommandInput = {
      Bucket: this.configuration.bucket,
      Prefix: prefix,
    };

    while (truncated) {
      try {
        // We have to disable no-await-in-loop since each loop is a serial
        // read. That is, it cannot be parallel.

        // eslint-disable-next-line no-await-in-loop
        const response = await this.s3.send(new ListObjectsV2Command(params));

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        response.Contents.forEach((item) => {
          // XXX this doesn't expose the tags's name
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

  async getTagRecords(tag: IArchiveTag): Promise<IArchiveRecord[]> {
    const params: ListObjectsV2CommandInput = {
      Bucket: this.configuration.bucket,
      Prefix: `tags-to-records/${tag.partitionName}/${tag.slug}/`,
    };

    const records: IArchiveRecord[] = [];

    let truncated = true;
    let ContinuationToken: any;

    while (truncated) {
      try {
        // We have to disable no-await-in-loop since each loop is a serial
        // read. That is, it cannot be parallel.

        // eslint-disable-next-line no-await-in-loop
        const response = await this.s3.send(new ListObjectsV2Command(params));

        response.Contents.forEach((item) => {
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
  private createTag(tag: IArchiveTag) {
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

    let params = {
      Body: '',
      Bucket: this.configuration.bucket,
      ContentType: 'text/plain',
      Key: `tags-to-records/${tag.partitionName}/${tag.slug}/${record.id}`,
    };

    let command = new PutObjectCommand(params);

    await this.s3.send(command);

    params = {
      Body: '',
      Bucket: this.configuration.bucket,
      ContentType: 'text/plain',
      Key: `records-to-tags/${record.id}/${tag.slug}`,
    };

    command = new PutObjectCommand(params);

    await this.s3.send(command);
  }

  removeTag(tag: IArchiveTag, record: IArchiveRecord) {
    const params = {
      Bucket: this.configuration.bucket,
      Key: `tags/${tag.partitionName}/${tag.slug}/${record.id}`,
    };

    const command = new DeleteObjectCommand(params);

    this.s3.send(command);
  }
}

export { S3Storage };
