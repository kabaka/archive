const SLUG_VALIDATION_REGEX = /^[a-z0-9_.-]+$/u;
const SLUG_REPLACEMENT_REGEX = /[^a-z0-9_.-]+/ug;

class Slug {
  slug: string;

  // eslint-disable-next-line class-methods-use-this
  validateSlug(newSlug: string) {
    return SLUG_VALIDATION_REGEX.test(newSlug);
  }

  getSlug() {
    if (this.slug === undefined) {
      this.slug = this.convertToSlug(this.toString());
    }

    return this.slug;
  }

  // eslint-disable-next-line class-methods-use-this
  convertToSlug(value: any) {
    return value
      .toString()
      .toLowerCase()
      .replaceAll(SLUG_REPLACEMENT_REGEX, '-');
  }
}

export { Slug };
