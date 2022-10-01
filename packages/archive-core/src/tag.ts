import { IArchiveRecord, IArchiveTag } from 'archive-types';
import { Slug } from './slug.js';
import { ArchiveStorage } from './storage.js';

class ArchiveTag extends Slug implements IArchiveTag {
  name: string;

  records: IArchiveRecord[];

  recordsExpiration: Number = 0;

  constructor(name: string) {
    super();

    this.name = name;
    this.records = [];
    this.slug = this.convertToSlug(this.name);
  }

  get partitionName() {
    return this.slug.slice(0, 2);
  }

  async getRecords() {
    if (Date.now() > this.recordsExpiration) {
      this.records = await ArchiveStorage.tags.getTagRecords(this);
    }

    return this.records;
  }

  toString() {
    return this.name;
  }
}

export { ArchiveTag };
