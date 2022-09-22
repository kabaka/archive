export namespace ArchiveConfiguration {
  /* Storage for files, metadata, tags, etc. */
  export const storage = {
    metadata: {
      type: 's3',
      config: {
        bucket: 'metadata.archive',
        client: {
          endpoint: 'http://nas-01.vacantminded.com:9000',
          credentials: {
            accessKeyId: 'DzZU3wQLX7YsQKgf',
            secretAccessKey: 'vcrjypbYJ3ld3crxJPOivoPDcaimVQq0',
          },
          forcePathStyle: true,
          region: 'home-01',
          signatureVersion: 'v4',
        },
      },
    },
    processing: {
      type: 's3',
      config: {
        bucket: 'processing.archive',
        client: {
          endpoint: 'http://nas-01.vacantminded.com:9000',
          credentials: {
            accessKeyId: 'DzZU3wQLX7YsQKgf',
            secretAccessKey: 'vcrjypbYJ3ld3crxJPOivoPDcaimVQq0',
          },
          forcePathStyle: true,
          region: 'home-01',
          signatureVersion: 'v4',
        },
      },
    },
    processed: {
      type: 's3',
      config: {
        bucket: 'processed.archive',
        client: {
          endpoint: 'http://nas-01.vacantminded.com:9000',
          credentials: {
            accessKeyId: 'DzZU3wQLX7YsQKgf',
            secretAccessKey: 'vcrjypbYJ3ld3crxJPOivoPDcaimVQq0',
          },
          forcePathStyle: true,
          region: 'home-01',
          signatureVersion: 'v4',
        },
      },
    },
    tags: {
      type: 's3',
      config: {
        bucket: 'tags.archive',
        client: {
          endpoint: 'http://nas-01.vacantminded.com:9000',
          credentials: {
            accessKeyId: 'DzZU3wQLX7YsQKgf',
            secretAccessKey: 'vcrjypbYJ3ld3crxJPOivoPDcaimVQq0',
          },
          forcePathStyle: true,
          region: 'home-01',
          signatureVersion: 'v4',
        },
      },
    },
  };

  /* Where to find new files. */
  export const ingestion = [
    {
      type: 'filesystem',
      dir: './ingestion/', // directory to scan for files
      interval: 1000, // milliseconds to wait between scans
    },
  ];

  /* For processors that use Azure Computer Vision (e.g., PDF for OCR). */
  export const azureComputerVision = {
    key: '',
    endpoint: '',
  };
}
