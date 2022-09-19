const SLUG_VALIDATION_REGEX = /^[a-z0-9_.-]+$/;
const SLUG_REPLACEMENT_REGEX = /[^a-z0-9_.-]+/g;

class Slug {
  slug: string;

  validateSlug(newSlug: string) {
    return SLUG_VALIDATION_REGEX.test(newSlug);
  }

  getSlug() {
    if (this.slug == undefined) {
      this.slug = this.convertToSlug(this.toString());
    }

    return this.slug;
  }

  convertToSlug(value: any) {
    return value
      .toString()
      .toLowerCase()
      .replaceAll(SLUG_REPLACEMENT_REGEX, "-");
  }
}

export { Slug };
