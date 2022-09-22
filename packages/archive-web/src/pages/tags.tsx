import React, { useEffect, useState } from 'react';
import { ArchiveStorage } from 'archive-core';
import { IArchiveTag } from 'archive-types';

export default () => {
  const [tags, setTags] = useState([]);

  const getTags = async () => {
    try {
      const newTags: IArchiveTag[] = await ArchiveStorage.getTags();

      setTags(newTags);
    } catch (err) {
      // XXX
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <>
      <h2>Tags</h2>
      <pre>{tags.map((tag) => <p>{tag.slug}</p>)}</pre>
      <p>end of tags...</p>
    </>
  );
  // {tags.map((tag) => <p>{tag.name}</p>)}
};

/**
 *
const myGetTags = async () => {
  const tags = await ArchiveStorage.getTags();

  Log.debug('getTags()', tags);

  tags.forEach(async (tag) => {
    await tag.getRecords();
    Log.debug('getTags() records:', tag.records);
  });
};

myGetTags();

 */
