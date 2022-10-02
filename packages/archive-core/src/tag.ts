import {
  IArchiveRecord,
  IArchiveTag,
} from 'archive-types';
import { ArchiveStorage } from './storage.js';
import { Slug } from './slug.js';

class ArchiveTag extends Slug implements IArchiveTag {
  nameCache: string;

  records: IArchiveRecord[];

  recordsExpiration: Number = 0;

  constructor(name?: string, slug?: string) {
    super();

    if (slug) {
      this.slug = slug;
    } else {
      this.nameCache = name;
      this.slug = this.convertToSlug(name);
    }

    this.records = [];
  }

  get partitionName() {
    return this.slug.slice(0, 2);
  }

  get name() {
    return ArchiveStorage.getTagName(this);
  }

  async getRecords() {
    if (Date.now() > this.recordsExpiration) {
      this.records = await ArchiveStorage.tags.getTagRecords(this);
    }

    return this.records;
  }

  toString() {
    return this.slug;
  }
}

export { ArchiveTag };
