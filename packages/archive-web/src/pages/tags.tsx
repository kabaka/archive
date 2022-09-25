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
      <ul>{tags.map((tag) => <li>{tag.slug}</li>)}</ul>
    </>
  );
};
