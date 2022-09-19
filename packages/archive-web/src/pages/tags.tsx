import React, { useEffect, useState } from 'react';
import { ArchiveStorage } from '../storage';

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
