import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { IArchiveTag } from 'archive-types';
import { ArchiveLink } from '../components/Link';

export default () => {
  const tags: any = useLoaderData();

  return (
    <>
      <h2>Tags</h2>
      <ul>
        {
          tags.map((tag: IArchiveTag) => (
            <ArchiveLink key={tag.slug} href={`/tags/${tag.slug}`}>{tag.slug}</ArchiveLink>
          ))
        }
      </ul>
    </>
  );
};
