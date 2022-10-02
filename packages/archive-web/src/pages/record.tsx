import { IArchiveTag } from 'archive-types';
import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

// import { IArchiveRecord } from 'archive-types';

export default () => {
  const record: any = useLoaderData();
  const { metadata } = record;

  const [tags, setTags] = useState([]);

  useEffect(() => {
    (async () => {
      const myTags = await record.tags;

      const newTags = await Promise.all(myTags.map(async (tag) => ({
        name: await tag.name,
        slug: tag.slug,
      })));

      setTags(newTags);
    })();
  }, [record]);

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
      <h3>Tags</h3>
      <ul>
        {tags.map((tag: IArchiveTag) => (
          <li key={tag.slug}>{tag.name}</li>
        ))}
      </ul>
      <hr />
      <h3>Raw Metadata</h3>
      <pre>{JSON.stringify(metadata)}</pre>
    </>
  );
};
