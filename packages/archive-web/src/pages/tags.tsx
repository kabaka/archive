import React, { useEffect, useState } from 'react';
import { ArchiveStorage } from 'archive-core/storage';

export default () => {
  const [tags, setTags] = useState([]);

  const getTags = async () => {
    const newTags = await ArchiveStorage.tags.getTags();

    setTags(newTags);
  };

  useEffect(() => {
    getTags();
  });

  return (
    <>
      <h2>Tags</h2>
      {tags.map((tag) => <p>{tag.name}</p>)}
    </>
  );
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
