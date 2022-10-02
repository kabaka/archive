import * as React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  PartialTheme,
  ThemeProvider,
} from '@fluentui/react';

import { ArchiveStorage, ArchiveTag } from 'archive-core';

import './App.css';
import { AppContainer } from './components/AppContainer';
import Tags from './pages/tags';
import Tag from './pages/tag';
import Record from './pages/record';

const myTheme: PartialTheme = {
  palette: {
    themePrimary: '#0f8387',
    themeDark: '#324c4d',
  },
};

// const tagsLoader = async () => ArchiveStorage.getTags();

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer />,
    children: [
      {
        path: 'tags',
        element: <Tags />,
        loader: ArchiveStorage.getTags,
      },
      {
        path: 'tags/:slug',
        element: <Tag />,
        loader: async ({ params }) => {
          const tag = new ArchiveTag(params.slug);

          const records = await tag.getRecords();
          return records;
        },
      },
      {
        path: 'records',
        element: <p>hello</p>,
      },
      {
        path: 'records/:id',
        element: <Record />,
        loader: async ({ params }) => {
          const record = ArchiveStorage.getArchiveRecord(params.id);

          return record;
        },
      },
    ],
  },
]);

export const App: React.FunctionComponent = () => (
  <ThemeProvider theme={myTheme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
