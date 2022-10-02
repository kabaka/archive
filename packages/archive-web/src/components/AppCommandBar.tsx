import * as React from 'react';
import {
  CommandBar,
  ICommandBarItemProps,
} from '@fluentui/react/lib/CommandBar';
import { IButtonProps } from '@fluentui/react/lib/Button';
import { setVirtualParent } from '@fluentui/dom-utilities';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const items: ICommandBarItemProps[] = [
  {
    iconProps: { iconName: 'GlobalNavButton' },
    key: 'nav',
    text: '',
  },
  {
    iconProps: { iconName: 'Upload' },
    key: 'upload',
    subMenuProps: {
      items: [
        {
          key: 'uploadfile',
          onClick: (
            // eslint-disable-next-line max-len
            ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
          ) => {
            ev?.persist();

            Promise.resolve().then(() => {
              const inputElement = document.createElement('input');
              inputElement.style.visibility = 'hidden';
              inputElement.setAttribute('type', 'file');

              document.body.appendChild(inputElement);

              const target = ev?.target as HTMLElement | undefined;

              if (target) {
                setVirtualParent(inputElement, target);
              }

              inputElement.click();

              if (target) {
                setVirtualParent(inputElement, null);
              }

              setTimeout(() => {
                inputElement.remove();
              }, 10000);
            });
          },
          preferMenuTargetAsEventTarget: true,
          text: 'File',
        },
        {
          key: 'uploadfolder',
          onClick: (
            // eslint-disable-next-line max-len
            ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
          ) => {
            ev?.persist();

            Promise.resolve().then(() => {
              const inputElement = document.createElement('input');
              inputElement.style.visibility = 'hidden';
              inputElement.setAttribute('type', 'file');

              (inputElement as { webkitdirectory?: boolean }).webkitdirectory = true;

              document.body.appendChild(inputElement);

              const target = ev?.target as HTMLElement | undefined;

              if (target) {
                setVirtualParent(inputElement, target);
              }

              inputElement.click();

              if (target) {
                setVirtualParent(inputElement, null);
              }

              setTimeout(() => {
                inputElement.remove();
              }, 10000);
            });
          },
          preferMenuTargetAsEventTarget: true,
          text: 'Folder',
        },
      ],
    },
    text: 'Upload',
  },
  {
    iconProps: { iconName: 'Share' },
    key: 'share',
    onClick: () => console.log('Share'),
    text: 'Share',
  },
  {
    iconProps: { iconName: 'Download' },
    key: 'download',
    onClick: () => console.log('Download'),
    text: 'Download',
  },
];

const overflowItems: ICommandBarItemProps[] = [
  {
    iconProps: { iconName: 'MoveToFolder' },
    key: 'move',
    onClick: () => console.log('Move to'),
    text: 'Move to...',
  },
  {
    iconProps: { iconName: 'Copy' },
    key: 'copy',
    onClick: () => console.log('Copy to'),
    text: 'Copy to...',
  },
  {
    iconProps: { iconName: 'Edit' },
    key: 'rename',
    onClick: () => console.log('Rename'),
    text: 'Rename...',
  },
];

const farItems: ICommandBarItemProps[] = [
  {
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Grid view',
    iconOnly: true,
    iconProps: { iconName: 'Tiles' },
    key: 'tile',
    onClick: () => console.log('Tiles'),
    text: 'Grid view',
  },
  {
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Info',
    iconOnly: true,
    iconProps: { iconName: 'Info' },
    key: 'info',
    onClick: () => console.log('Info'),
    text: 'Info',
  },
];

export const AppCommandBar: React.FunctionComponent = () => (
  <CommandBar
    items={items}
    overflowItems={overflowItems}
    overflowButtonProps={overflowProps}
    farItems={farItems}
    ariaLabel="Inbox actions"
    primaryGroupAriaLabel="Email actions"
    farItemsGroupAriaLabel="More actions"
  />
);
