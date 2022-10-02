import * as React from 'react';
import {
  INavLink,
  INavLinkGroup,
  INavStyles,
  Nav,
} from '@fluentui/react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useState } from 'react';

export interface IComponentClassNames {
  root: string;
  button: string;
  buttonIcon: string;
}

const navStyles: Partial<INavStyles> = {
  root: {
    borderRight: '2px solid #aaa',
    boxSizing: 'border-box',
    height: '100vh',
    overflowY: 'auto',
    width: 208,
  },
};

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        key: '/',
        name: 'Home',
        url: '/',
      },
      {
        key: 'records',
        name: 'Records',
        url: '/records',
      },
      {
        key: 'tags',
        name: 'Tags',
        url: '/tags',
      },
    ],
  },
];

export const LeftNav: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ activeKey, setActiveKey ] = useState(location.pathname.split('/')[1]);

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
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
