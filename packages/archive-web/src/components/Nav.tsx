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
    height: 300,
    boxSizing: 'border-box',
    border: '1px solid #222',
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
        name: 'Tags',
        url: '/tags',
        key: '/tags',
      },
    ],
  },
];

export const LeftNav: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // XXX this won't work in all cases
  const [activeKey, setActiveKey] = useState(location.pathname);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    window.console.log('LeftNav.onLinkClick', ev, item);

    if (ev) {
      // ev.nativeEvent.preventDefault();
      ev.preventDefault();
    }

    if (item && item.key) {
      setActiveKey(item.key);
      try {
        navigate(item.url);
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(`${err}\n${err.stack}${err.line}`);
      }

      // eslint-disable-next-line no-alert
      // alert(item.url);
    }
  };

  /*
  useEffect(() => {
    navigate(activeKey);
  }, [activeKey, navigate]);
  */

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
