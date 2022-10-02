import * as React from 'react';
import {
  ILinkProps,
  Link,
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';

export const ArchiveLink: React.FunctionComponent<ILinkProps> = (props: ILinkProps) => {
  const navigate = useNavigate();
  const { href } = props;

  const onClick = (ev?: React.SyntheticEvent) => {
    if (ev) {
      ev.nativeEvent.preventDefault();
    }

    navigate(href);
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Link onClick={onClick} {...props} />;
};
