import {
  useLoaderData,
  useParams,
} from 'react-router-dom';
import { ArchiveTag } from 'archive-core';
import React from 'react';
import { RecordsTable } from '../components/RecordsTable';

export default () => {
  const records: any = useLoaderData();
  const { slug } = useParams();

  const tag = new ArchiveTag(slug);

  return (
    <>
      <h2>
        Tag:
        {` ${tag.name}`}
      </h2>
      <RecordsTable records={records} />
      {/* <ul>
        {records.map((record: IArchiveRecord) => (
          <li key={record.id}>
            <ArchiveLink href={`/records/${record.id}`}>
              {record.id}
            </ArchiveLink>
          </li>
        ))}
      </ul> */}
    </>
  );
};
