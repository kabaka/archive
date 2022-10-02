import React from 'react';
import { IArchiveRecord } from 'archive-types';
import { ArchiveTagPicker } from '../components/ArchiveTagPicker';

export default () => {
  const records: IArchiveRecord[] = [];

  window.console.log(records);

  return (
    <>
      <h2>Records</h2>
      <ArchiveTagPicker />
    </>
  );
};
