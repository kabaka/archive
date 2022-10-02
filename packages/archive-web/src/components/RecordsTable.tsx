/* eslint-disable max-len */
import * as React from 'react';
import {
  Announced,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Icon,
  MarqueeSelection,
  Selection,
  SelectionMode,
  TextField,
  Toggle,
  mergeStyleSets,
} from '@fluentui/react';
import {
  useEffect,
  useState,
} from 'react';

import { IArchiveRecord } from 'archive-types';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { useBoolean } from '@fluentui/react-hooks';
import { useNavigate } from 'react-router-dom';

interface IArchiveRecordRow {
  id: any;
  originalFilePath: any;
  mimeType: any;
  size: number;
  modified: number;
  modifiedBy: string;
}

function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => (
    (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

const onRenderIcon = () => (
  <Icon {...getFileTypeIconProps({
    extension: 'docx', size: 16,
  })}
  />
);

const classNames = mergeStyleSets({
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px',
  },
  fileIconCell: {
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        height: '100%',
        verticalAlign: 'middle',
        visibility: 'hidden',
        width: '0px',
      },
      verticalAlign: 'middle',
    },
    textAlign: 'center',
  },
  fileIconHeaderIcon: {
    fontSize: '16px',
    padding: 0,
  },
  fileIconImg: {
    maxHeight: '16px',
    maxWidth: '16px',
  },
  selectionDetails: { marginBottom: '20px' },
});

const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px',
  },
};
export interface IDetailsListDocumentsExampleState {
  columns: IColumn[];
  items: IArchiveRecordRow[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
}

interface IRecordsTableProps {
  records: IArchiveRecord[];
}

const dateCell = (row: IArchiveRecordRow) => {
  const date = new Date(row.modified);
  return <span>{date.toLocaleString()}</span>;
};

// eslint-disable-next-line max-len
export const RecordsTable: React.FunctionComponent<IRecordsTableProps> = (props: IRecordsTableProps) => {
  const navigate = useNavigate();
  const [ allItems, setAllItems ] = useState([]);
  const [ items, setItems ] = useState([]);
  const [ announcedMessage, setAnnouncedMessage ] = useState('');
  const [ selection ] = useState(new Selection());
  const [ selectionDetails, setSelectionDetails ] = useState('No items selected.');
  const [ isCompactMode, {
    setTrue: setCompactModeOn, setFalse: setCompactModeOff,
  } ] = useBoolean(false); // XXX
  const [ isModalSelection, {
    setTrue: enableModalSelection, setFalse: disableModalSelection,
  } ] = useBoolean(false); // XXX

  const [ columns, setColumns ]: [IColumn[], any] = useState([
    {
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      className: classNames.fileIconCell,
      fieldName: 'mimeType',
      iconClassName: classNames.fileIconHeaderIcon,
      iconName: 'Page',
      isIconOnly: true,
      key: 'fileType',
      maxWidth: 16,
      minWidth: 16,
      name: 'File Type',
      onRender: onRenderIcon,
    },
    {
      fieldName: 'id',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: true,
      isSortedDescending: false,
      key: 'id',
      maxWidth: 350,
      minWidth: 210,
      name: 'ID',
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
    },
    {
      fieldName: 'originalFilePath',
      isPadded: true,
      isResizable: true,
      isRowHeader: true,
      isSorted: true,
      isSortedDescending: false,
      key: 'originalFilePath',
      maxWidth: 350,
      minWidth: 210,
      name: 'Original File Path',
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
    },
    {
      fieldName: 'modified',
      isPadded: true,
      isResizable: true,
      key: 'modifiedDate',
      maxWidth: 200,
      minWidth: 125,
      name: 'Date Modified',
      onRender: dateCell,
    },
    {
      fieldName: 'modifiedBy',
      isCollapsible: true,
      isPadded: true,
      isResizable: true,
      key: 'modifiedBy',
      maxWidth: 90,
      minWidth: 70,
      name: 'Modified By',
    },
    {
      fieldName: 'size',
      isCollapsible: true,
      isResizable: true,
      key: 'size',
      maxWidth: 90,
      minWidth: 70,
      name: 'Size',
    },
  ]);

  useEffect(() => {
    (async () => {
      const { records } = props;

      const result = await Promise.all(records.map(async (record: IArchiveRecord) => {
        const metadata = await record.metadata;

        return {
          id: record.id,
          mimeType: metadata.mimeType,
          modified: metadata.modified,
          modifiedBy: '',
          originalFilePath: metadata.originalFilePath,
          size: 0,
        };
      }));

      setAllItems(result);
      setItems(result);
    })();
  }, [ props ]);

  useEffect(() => {
    const selectionCount = selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        setSelectionDetails('No items selected');
        break;
      case 1:
        setSelectionDetails(`1 item selected: ${(selection.getSelection()[0] as IArchiveRecord).id} `);
        break;
      default:
        setSelectionDetails(`${selectionCount} items selected`);
        break;
    }
  }, [ selection ]);

  const onColumnHeaderClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter((currCol) => column.key === currCol.key)[0];

    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;

        setAnnouncedMessage(
          `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'}`,
        );
      } else {
        // eslint-disable-next-line no-param-reassign
        newCol.isSorted = false;
        // eslint-disable-next-line no-param-reassign
        newCol.isSortedDescending = true;
      }
    });

    const newItems = copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);

    setColumns(newColumns);
    setItems(newItems);
  };

  const onChangeCompactMode = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
    if (checked) {
      setCompactModeOn();
    } else {
      setCompactModeOff();
    }
  };

  const onChangeModalSelection = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
    if (checked) {
      enableModalSelection();
    } else {
      disableModalSelection();
    }
  };

  const onChangeText = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string,
  ): void => {
    if (!text) {
      setItems(allItems);
      return;
    }

    setAllItems(allItems.filter((i) => i.id.toLowerCase().indexOf(text) > -1));
  };

  // eslint-disable-next-line class-methods-use-this
  const onItemInvoked = (item: IArchiveRecordRow): void => {
    navigate(`/records/${item.id}`);
  };

  return (
    <div>
      <div className={classNames.controlWrapper}>
        <Toggle
          label="Enable compact mode"
          checked={isCompactMode}
          onChange={onChangeCompactMode}
          onText="Compact"
          offText="Normal"
          styles={controlStyles}
        />
        <Toggle
          label="Enable modal selection"
          checked={isModalSelection}
          onChange={onChangeModalSelection}
          onText="Modal"
          offText="Normal"
          styles={controlStyles}
        />
        <TextField label="Filter by name:" onChange={onChangeText} styles={controlStyles} />
        <Announced message={`Number of items after filter applied: ${items.length}.`} />
      </div>
      <div className={classNames.selectionDetails}>{selectionDetails}</div>
      <Announced message={selectionDetails} />
      {announcedMessage ? <Announced message={announcedMessage} /> : undefined}
      {isModalSelection ? (
        <MarqueeSelection selection={selection}>
          <DetailsList
            items={items}
            compact={isCompactMode}
            columns={columns}
            selectionMode={SelectionMode.multiple}
            getKey={(item) => item.key}
            setKey="multiple"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible
            selection={selection}
            selectionPreservedOnEmptyClick
            onColumnHeaderClick={onColumnHeaderClick}
            onItemInvoked={onItemInvoked}
            enterModalSelectionOnTouch
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
          />
        </MarqueeSelection>
      ) : (
        <DetailsList
          items={items}
          compact={isCompactMode}
          columns={columns}
          selectionMode={SelectionMode.none}
          getKey={(item) => item.key}
          setKey="none"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible
          onColumnHeaderClick={onColumnHeaderClick}
          onItemInvoked={onItemInvoked}
        />
      )}
    </div>
  );
};
