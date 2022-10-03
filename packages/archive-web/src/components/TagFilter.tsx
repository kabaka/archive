import * as React from 'react';
import {
  BasePickerListBelow,
  IBasePickerProps,
  ITag,
} from '@fluentui/react';
import { ArchiveStorage } from 'archive-core';
import { IArchiveTag } from 'archive-types';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface ITagPickerProps extends IBasePickerProps<ITag> { }

class TagPicker extends BasePickerListBelow<ITag, ITagPickerProps> { }

// XXX types, etc.
const onRenderItem = (props: any): JSX.Element => {
  const { item } = props;

  return (
    <p key={item.key}>
      {item.name}
      <button type="submit" onClick={props.onRemoveItem}>x</button>
    </p>
  );
};

const onRenderSuggestionsItem = (tag: ITag): JSX.Element => <p>{tag.name}</p>;

const filterSuggestedTags = async (filterText: string, selectedTags: ITag[]): Promise<ITag[]> => {
  if (!filterText) {
    return [];
  }

  let tags: IArchiveTag[] = await ArchiveStorage.getTags(filterText);

  if (selectedTags) {
    tags = tags.filter((tag) => (
      !selectedTags.some((selectedTag) => (
        tag.slug === selectedTag.key
      ))
    ));
  }

  const result = await Promise.all(tags.map(async (tag): Promise<ITag> => ({
    key: tag.slug,
    name: await tag.name,
  })));

  return result;
};

export const TagFilter: React.FunctionComponent = () => {
  const [ search, setSearch ] = useSearchParams();

  const onChange = (items: ITag[]) => {
    if (!items || items.length === 0) {
      setSearch();
      return;
    }

    setSearch({
      tags: items.map((tag) => (
        tag.key
      )).join(','),
    });
  };

  useEffect(() => {
    // TODO: set tags from search params
    // eslint-disable-next-line no-console
    console.log(search);
  }, [ search ]);

  return (
    <>
      <strong>Tag Filter</strong>
      <TagPicker
        onChange={onChange}
        onResolveSuggestions={filterSuggestedTags}
        onRenderSuggestionsItem={onRenderSuggestionsItem}
        onRenderItem={onRenderItem}
      />
    </>
  );
};
