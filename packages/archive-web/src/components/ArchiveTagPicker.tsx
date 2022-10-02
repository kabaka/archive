import * as React from 'react';

import {
  TagPicker,
  ITag,
  IInputProps,
  IBasePickerSuggestionsProps,
  mergeStyles,
} from '@fluentui/react';

import { ArchiveStorage } from 'archive-core';
import { IArchiveTag } from 'archive-types';

const rootClass = mergeStyles({
  maxWidth: 500,
});

const inputProps: IInputProps = {
  onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called', ev),
  onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called', ev),
};

const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested tags',
  noResultsFoundText: 'No matches found',
};

const filterSuggestedTags = async (filterText: string, selectedTags: ITag[]): Promise<ITag[]> => {
  if (!filterText) {
    return [];
  }

  let tags: IArchiveTag[] = await ArchiveStorage.getTags(filterText);

  tags = tags.filter((tag) => (
    !selectedTags.some((selectedTag) => (
      tag.slug === selectedTag.key
    ))
  ));

  return tags.map((tag): ITag => ({
    name: tag.name,
    key: tag.slug,
  }));
};

const getTextFromItem = (item: ITag) => item.name;

export const ArchiveTagPicker: React.FunctionComponent = () => (
  <div className={rootClass}>
    { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
    <label htmlFor="tagPicker">
      Tags
    </label>
    <TagPicker
      removeButtonAriaLabel="Remove"
      selectionAriaLabel="Selected tags"
      onResolveSuggestions={filterSuggestedTags}
      getTextFromItem={getTextFromItem}
      pickerSuggestionsProps={pickerSuggestionsProps}
      inputProps={{
        ...inputProps,
        id: 'tagPicker',
      }}
    />
  </div>
);
