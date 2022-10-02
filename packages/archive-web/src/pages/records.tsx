import * as React from 'react';
import {
  ArchiveStorage,
  ArchiveTag,
} from 'archive-core';
import {
  IArchiveRecord,
  IArchiveTag,
} from 'archive-types';
import {
  IBasePickerSuggestionsProps,
  IInputProps,
  ITag,
  TagPicker,
} from '@fluentui/react';
import {
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line sort-imports
import { RecordsTable } from '../components/RecordsTable';

const inputProps: IInputProps = {
  onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called', ev),
  onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called', ev),
};

const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
  noResultsFoundText: 'No matches found',
  suggestionsHeaderText: 'Suggested tags',
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

  const result = await Promise.all(tags.map(async (tag): Promise<ITag> => ({
    key: tag.slug,
    name: await tag.name,
  })));

  return result;
};

const getTextFromItem = (item: ITag) => item.name;

export default () => {
  const [ records, setRecords ]: [IArchiveRecord[], any] = useState([]);
  const [ search, setSearch ] = useSearchParams();

  // TODO: populate tags input from URL query params on load

  const onChange = (tags: ITag[]) => {
    setSearch({
      tags: tags.map((tag) => (
        tag.key
      )).join(','),
    });
  };

  useEffect(() => {
    // TODO: right now, these are just ORed together. More advanced queries are
    // needed -- at least AND.
    const tags = search.get('tags');
    let results: IArchiveRecord[] = [];

    (async () => {
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
      { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="tagPicker">
        Tags
      </label>
      <TagPicker
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Selected tags"
        onChange={onChange}
        onResolveSuggestions={filterSuggestedTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={pickerSuggestionsProps}
        inputProps={{
          ...inputProps,
          id: 'tagPicker',
        }}
      />
      <hr />
      <RecordsTable records={records} />
    </>
  );
};
