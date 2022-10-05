import * as React from 'react';
import {
  Stack,
  mergeStyles,
  useTheme,
} from '@fluentui/react';
import {
  useEffect,
  useState,
} from 'react';
import { Outlet } from 'react-router-dom';
// eslint-disable-next-line sort-imports
import { AppCommandBar } from './AppCommandBar';
import { TagFilter } from './TagFilter';

const contentAreaStyles = mergeStyles({ width: '100%' });
const outerStackStyles = mergeStyles({ minHeight: '100vh' });

const baseTagFilterStyles = {
  height: '100%',
  minHeight: '100vh',
  padding: '14px',
};

export const AppContainer: React.FunctionComponent = () => {
  const theme = useTheme();
  const [ tagFilterStyles, setTagFilterStyles ] = useState(
    mergeStyles(baseTagFilterStyles),
  );

  useEffect(() => {
    setTagFilterStyles(
      mergeStyles(
        {
          // backgroundColor: theme.semanticColors.bodyBackground,
          borderRight: `solid 1px ${theme.semanticColors.bodyDivider}`,
        },
        baseTagFilterStyles,
      ),
    );

    mergeStyles({ ':global(body,html,#root)': { backgroundColor: theme.semanticColors.bodyBackground } });
  }, [ theme ]);

  return (
    <Stack verticalFill className={outerStackStyles}>
      <Stack.Item>
        <AppCommandBar />
      </Stack.Item>
      <Stack.Item>
        <Stack horizontal verticalFill>
          <Stack.Item verticalFill className={tagFilterStyles}>
            <TagFilter />
          </Stack.Item>
          <Stack.Item className={contentAreaStyles}>
            <Stack>
              {/* <Stack.Item>
              <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
              >
                Error MessageBar with single line, with dismiss button.
              </MessageBar>
            </Stack.Item> */}
              <Stack.Item>
                <Outlet />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
