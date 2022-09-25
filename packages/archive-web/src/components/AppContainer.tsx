import * as React from 'react';
import { Stack } from '@fluentui/react';

import { AppCommandBar } from './AppCommandBar';
import { LeftNav } from './Nav';

export const AppContainer: React.FunctionComponent = (props) => {
  const { children } = props;
  return (
    <Stack verticalFill>
      <Stack.Item>
        <AppCommandBar />
      </Stack.Item>
      <Stack.Item>
        <Stack horizontal verticalFill>
          <Stack.Item verticalFill>
            <LeftNav />
          </Stack.Item>
          <Stack.Item>
            {children}
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
