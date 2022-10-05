import * as React from 'react';
import {
  INavLink,
  INavLinkGroup,
  Nav,
  mergeStyles,
  useTheme,
} from '@fluentui/react';
import {
  useEffect,
  useState,
} from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

const NAV_WIDTH = 300;
export interface IComponentClassNames {
  root: string;
  button: string;
  buttonIcon: string;
}

export interface ILeftNavProps {
  isOpen: boolean;
}

const baseNavStyles = {
  boxSizing: 'border-box',
  height: '100vh',
  transition: 'margin .15s',
  width: NAV_WIDTH,
  zIndex: 1000,
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

export const LeftNav: React.FunctionComponent<ILeftNavProps> = (props: ILeftNavProps) => {
  const { isOpen } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [ activeKey, setActiveKey ] = useState(location.pathname.split('/')[ 1 ]);
  const [ navStyles, setNavStyles ] = useState(mergeStyles(baseNavStyles));

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    if (ev) {
      ev.preventDefault();
    }

    if (item && item.key) {
      setActiveKey(item.key);
      navigate(item.url);
    }
  };

  useEffect(() => {
    setNavStyles(mergeStyles(
      baseNavStyles,
      {
        backgroundColor: theme.semanticColors.bodyBackground,
        borderRight: `solid 1px ${theme.semanticColors.bodyDivider}`,
        marginLeft: isOpen ? 0 : NAV_WIDTH * -1,
      },
    ));
  }, [ isOpen, theme ]);

  return (
    <Nav
      ariaLabel="Navigation"
      className={navStyles}
      groups={navLinkGroups}
      isOnTop
      onLinkClick={onLinkClick}
      selectedKey={activeKey}
    />
  );
};
