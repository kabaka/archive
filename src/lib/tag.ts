import { Slug } from "./slug.js";

interface TagObject {
  name: string;
  records: string[];
  slug: string;
}

class Tag extends Slug implements TagObject {
  name: string;
  records: string[];

  constructor(name: string) {
    super();

    this.name = name;
    this.records = [];
    this.slug = this.convertToSlug(this.name);
  }

  getPartitionName() {
    return this.slug.slice(0, 2);
  }

  toString() {
    return this.name;
  }
}

export { Tag };
