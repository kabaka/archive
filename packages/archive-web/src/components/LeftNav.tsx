import * as React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Nav, INavLink, INavStyles, INavLinkGroup,
} from '@fluentui/react';

export interface IComponentClassNames {
  root: string;
  button: string;
  buttonIcon: string;
}

const navStyles: Partial<INavStyles> = {
  root: {
    width: 208,
    height: '100vh',
    boxSizing: 'border-box',
    borderRight: '2px solid #aaa',
    overflowY: 'auto',
  },
};

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Home',
        url: '/',
        key: '/',
      },
      {
        name: 'Records',
        url: '/records',
        key: 'records',
      },
      {
        name: 'Tags',
        url: '/tags',
        key: 'tags',
      },
    ],
  },
];

export const LeftNav: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname.split('/')[1]);

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    window.console.log('LeftNav.onLinkClick', ev, item);

    if (ev) {
      ev.preventDefault();
    }

    if (item && item.key) {
      setActiveKey(item.key);
      navigate(item.url);
    }
  };

  return (
    <Nav
      onLinkClick={onLinkClick}
      selectedKey={activeKey}
      ariaLabel="Navigation"
      styles={navStyles}
      groups={navLinkGroups}
    />
  );
};
