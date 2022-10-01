import React from 'react';
import { useLoaderData } from 'react-router-dom';

// import { IArchiveRecord } from 'archive-types';

export default () => {
  const record: any = useLoaderData();
  const { metadata } = record;

  return (
    <>
      <h2>
        Record
        &nbsp;
        {record.id}
        &nbsp;&bull;&nbsp;
        {metadata.mimeType}
      </h2>
      <dl>
        {Object.keys(metadata).map((key) => (
          <>
            <dt>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (m) => m.toUpperCase())}
            </dt>
            <dd>
              {metadata[key]}
            </dd>
          </>
        ))}
      </dl>
      <hr />
      <h3>Raw Metadata</h3>
      <pre>{JSON.stringify(metadata)}</pre>
    </>
  );
};
