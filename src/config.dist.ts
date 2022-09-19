export namespace ArchiveConfiguration {
  /* Storage for files, metadata, tags, etc. */
  export const storage = {
    metadata: {
      type: 's3',
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
    },
    processing: {
      type: 's3',
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
    },
    processed: {
      type: 's3',
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
    },
    tags: {
      type: 's3',
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
    },
  };

  /* Where to find new files. */
  export const ingestion = [
    {
      type: 'filesystem',
      dir: '', // directory to scan for files
      interval: 1000, // milliseconds to wait between scans
    },
  ];

  /* For processors that use Azure Computer Vision (e.g., PDF for OCR). */
  export const azureComputerVision = {
    key: '',
    endpoint: '',
  };
}
