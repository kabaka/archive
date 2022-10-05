import * as React from 'react';
import {
  ArchiveStorage,
  ArchiveTag,
} from 'archive-core';
import {
  BasePickerListBelow,
  IBasePickerProps,
  ITag,
  ValidationState,
} from '@fluentui/react';
import {
  IArchiveRecord,
  IArchiveTag,
} from 'archive-types';
import {
  useEffect,
  useState,
} from 'react';

export interface ITagEditorPickerProps extends IBasePickerProps<ITag> { }
interface ITagEditorProps {
  record: IArchiveRecord;
}

class TagEditorPicker extends BasePickerListBelow<ITag, ITagEditorPickerProps> { }

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

export const TagEditor: React.FunctionComponent<ITagEditorProps> = (props: ITagEditorProps) => {
  const { record } = props;
  const [ tags, setTags ] = useState([]);

  // TODO: only submit new tags
  const onChange = (items: ITag[]) => {
    setTags(items);

    (async () => {
      items.forEach((item) => {
        record.addTag(item.name);
      });

      const myTags = await record.tags;

      myTags.forEach((tag) => {
        if (!items.some((item) => item.key === tag.slug)) {
          record.removeTag(tag.slug);
        }
      });
    })();
  };

  const filterSuggestedTags = async (filterText: string, selectedTags: ITag[]): Promise<ITag[]> => {
    if (!filterText) {
      return [];
    }

    let myTags: IArchiveTag[] = await ArchiveStorage.getTags(filterText);

    if (selectedTags) {
      myTags = myTags.filter((tag) => (
        !selectedTags.some((selectedTag) => (
          tag.slug === selectedTag.key
        ))
      ));
    }

    const result = await Promise.all(myTags.map(async (tag: IArchiveTag): Promise<ITag> => ({
      key: tag.slug,
      name: await tag.name,
    })));

    // TODO: generate slug without instantiating ArchiveTag
    const tempTag = new ArchiveTag(filterText);

    result.push({
      key: tempTag.slug,
      name: filterText,
    });

    return result;
  };

  const onValidateInput = (input: string): ValidationState => (input.length > 0 ? 0 : 1);

  useEffect(() => {
    (async () => {
      const myTags = await record.tags;

      const result = await Promise.all(myTags.map(async (tag): Promise<ITag> => ({
        key: tag.slug,
        name: await tag.name,
      })));

      setTags(result);
    })();
  }, [ record ]);

  return (
    <TagEditorPicker
      onChange={onChange}
      onResolveSuggestions={filterSuggestedTags}
      onRenderSuggestionsItem={onRenderSuggestionsItem}
      onRenderItem={onRenderItem}
      onValidateInput={onValidateInput}
      selectedItems={tags}
    />
  );
};
