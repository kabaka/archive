import './App.css';
import './App.css';
import * as React from 'react';
import {
  ArchiveStorage,
  ArchiveTag,
} from 'archive-core';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { AzureThemeDark } from '@fluentui/azure-themes';
import {
  // PartialTheme,
  ThemeProvider,
} from '@fluentui/react';

// eslint-disable-next-line sort-imports
import { AppContainer } from './components/AppContainer';
import Record from './pages/record';
import Records from './pages/records';
import Tag from './pages/tag';
import Tags from './pages/tags';
import Tag from './pages/tag';
import Tags from './pages/tags';

// const myTheme: PartialTheme = {
//   palette: {
//     themeDark: '#324c4d',
//     themePrimary: '#0f8387',
//   },
// };

// const tagsLoader = async () => ArchiveStorage.getTags();

const router = createBrowserRouter([
  {
    children: [
      {
        element: <Tags />,
        loader: () => ArchiveStorage.getTags(),
        path: 'tags',
        path: 'tags',
      },
      {
        element: <Tag />,
        loader: async ({ params }) => {
          const tag = new ArchiveTag(params.slug);

          const records = await tag.getRecords();

          return records;
        },
        path: 'tags/:slug',
        path: 'tags/:slug',
      },
      {
        element: <Records />,
        path: 'records',
        path: 'records',
      },
      {
        element: <Record />,
        loader: ({ params }) => {
          const record = ArchiveStorage.getArchiveRecord(params.id);

          return record;
        },
        path: 'records/:id',
        path: 'records/:id',
      },
    ],
    element: <AppContainer />,
    path: '/',
    element: <AppContainer />,
    path: '/',
  },
]);

export const App: React.FunctionComponent = () => (
  <ThemeProvider theme={AzureThemeDark}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
