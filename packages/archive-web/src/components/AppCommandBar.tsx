import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IButtonProps } from '@fluentui/react/lib/Button';
import { setVirtualParent } from '@fluentui/dom-utilities';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const items: ICommandBarItemProps[] = [
  {
    key: 'nav',
    text: '',
    iconProps: { iconName: 'GlobalNavButton' },
  },
  {
    key: 'upload',
    text: 'Upload',
    iconProps: { iconName: 'Upload' },
    subMenuProps: {
      items: [
        {
          key: 'uploadfile',
          text: 'File',
          preferMenuTargetAsEventTarget: true,
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
        },
        {
          key: 'uploadfolder',
          text: 'Folder',
          preferMenuTargetAsEventTarget: true,
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
        },
      ],
    },
  },
  {
    key: 'share',
    text: 'Share',
    iconProps: { iconName: 'Share' },
    onClick: () => console.log('Share'),
  },
  {
    key: 'download',
    text: 'Download',
    iconProps: { iconName: 'Download' },
    onClick: () => console.log('Download'),
  },
];

const overflowItems: ICommandBarItemProps[] = [
  {
    key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' },
  },
  {
    key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' },
  },
  {
    key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' },
  },
];

const farItems: ICommandBarItemProps[] = [
  {
    key: 'tile',
    text: 'Grid view',
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Grid view',
    iconOnly: true,
    iconProps: { iconName: 'Tiles' },
    onClick: () => console.log('Tiles'),
  },
  {
    key: 'info',
    text: 'Info',
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Info',
    iconOnly: true,
    iconProps: { iconName: 'Info' },
    onClick: () => console.log('Info'),
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
