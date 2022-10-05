import * as React from 'react';
import {
  CommandBar,
  ICommandBarItemProps,
} from '@fluentui/react';
import { setVirtualParent } from '@fluentui/dom-utilities';
import { useBoolean } from '@fluentui/react-hooks';
import { useState } from 'react';
// eslint-disable-next-line sort-imports
import { LeftNav } from './LeftNav';

const farItems: ICommandBarItemProps[] = [
  {
    ariaLabel: 'Upload',
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
];

export const AppCommandBar: React.FunctionComponent = () => {
  const [ isNavOpen, { toggle: toggleNav } ] = useBoolean(false);
  const [ items ] = useState([
    {
      ariaLabel: 'Navigation',
      // iconOnly: true,
      iconProps: { iconName: 'GlobalNavButton' },
      key: 'nav',
      onClick: toggleNav,
      text: 'Archive',
    },
  ]);

  return (
    <>
      <CommandBar
        items={items}
        farItems={farItems}
        ariaLabel="Inbox actions"
        primaryGroupAriaLabel="Email actions"
        farItemsGroupAriaLabel="More actions"
      />
      <LeftNav isOpen={isNavOpen} />
    </>
  );
};
