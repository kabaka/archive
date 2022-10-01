import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@fluentui/react';

import { AppCommandBar } from './AppCommandBar';
import { LeftNav } from './LeftNav';

export const AppContainer: React.FunctionComponent = () => (
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
          <Outlet />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  </Stack>
);
