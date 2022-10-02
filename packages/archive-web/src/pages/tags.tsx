import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { IArchiveTag } from 'archive-types';
import { ArchiveLink } from '../components/Link';

export default () => {
  const tags: any = useLoaderData();

  const [myTags, setMyTags]: [IArchiveTag[], any] = useState([]);

  useEffect(() => {
    (async () => {
      const newTags = await Promise.all(tags.map(async (tag: IArchiveTag) => ({
        name: await tag.name,
        slug: tag.slug,
      })));

      setMyTags(newTags);
    })();
  }, [tags]);

  return (
    <>
      <h2>Tags</h2>
      <ul>
        {
          myTags.map((tag: IArchiveTag) => (
            <ArchiveLink key={tag.slug} href={`/tags/${tag.slug}`}>{tag.name}</ArchiveLink>
          ))
        }
      </ul>
    </>
  );
};
