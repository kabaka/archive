import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import {
  PartialTheme,
  ThemeProvider,
} from '@fluentui/react';

import './App.css';
import Tags from './pages/tags';
import { AppContainer } from './components/AppContainer';

const myTheme: PartialTheme = {
  palette: {
    themePrimary: '#0f8387',
    themeDark: '#324c4d',
  },
};

export const App: React.FunctionComponent = () => (
  <ThemeProvider theme={myTheme}>
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route path="/" element=<p>Hello</p> />
          <Route path="/tags" element=<Tags /> />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  </ThemeProvider>
);
