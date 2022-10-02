import * as React from 'react';
import {
  MessageBar,
  MessageBarType,
  Stack,
} from '@fluentui/react';
import { Outlet } from 'react-router-dom';
// eslint-disable-next-line sort-imports
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
          <Stack>
            <Stack.Item>
              <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
              >
                Error MessageBar with single line, with dismiss button.
              </MessageBar>
            </Stack.Item>
            <Stack.Item>
              <Outlet />
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  </Stack>
);
