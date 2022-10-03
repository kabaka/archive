import * as React from 'react';
import {
  useEffect,
  useState,
} from 'react';
import { ArchiveTag } from 'archive-core';
import { IArchiveRecord } from 'archive-types';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line sort-imports
import { RecordsTable } from '../components/RecordsTable';

export default () => {
  const [ records, setRecords ]: [ IArchiveRecord[], any ] = useState([]);
  const [ search ] = useSearchParams();

  useEffect(() => {
    // TODO: right now, these are just ORed together. More advanced queries are
    // needed -- at least AND.
    const tags = search.get('tags');

    if (!tags || tags.length === 0) {
      setRecords([]);
      return;
    }

    (async () => {
      let results: IArchiveRecord[] = [];

      await Promise.all(tags.split(',').map(async (tag) => {
        const archiveTag = new ArchiveTag(tag);
        const myRecords = await archiveTag.getRecords();

        results = results.concat(myRecords);
      }));

      setRecords(results);
    })();
  }, [ search ]);

  return (
    <>
      <h2>Records</h2>
      <RecordsTable records={records} />
    </>
  );
};
