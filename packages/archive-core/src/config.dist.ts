export namespace ArchiveConfiguration {
  /* Storage for files, metadata, tags, etc. */
  export const storage = {
    metadata: {
      config: {
        bucket: '',
        client: {
          credentials: {
            accessKeyId: '',
            secretAccessKey: '',
          },
          region: '',
        },
      },
      type: 's3',
    },
    processed: {
      config: {
        bucket: '',
        client: {
          credentials: {
            accessKeyId: '',
            secretAccessKey: '',
          },
          region: '',
        },
      },
      type: 's3',
    },
    processing: {
      config: {
        bucket: '',
        client: {
          credentials: {
            accessKeyId: '',
            secretAccessKey: '',
          },
          region: '',
        },
      },
      type: 's3',
    },
    tags: {
      config: {
        bucket: '',
        client: {
          credentials: {
            accessKeyId: '',
            secretAccessKey: '',
          },
          region: '',
        },
      },
      type: 's3',
    },
  };

  /* Where to find new files. */
  export const ingestion = [
    {
      dir: '', // directory to scan for files
      interval: 1000, // milliseconds to wait between scans
      type: 'filesystem',
    },
  ];

  /* For processors that use Azure Computer Vision (e.g., PDF for OCR). */
  export const azureComputerVision = {
    endpoint: '',
    key: '',
  };
}
