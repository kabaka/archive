import {
  initializeIcons,
  mergeStyles,
} from '@fluentui/react';
import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line sort-imports
import { App } from './App';
import reportWebVitals from './reportWebVitals';

global.Buffer = Buffer;

// These fonts are copied into place by the `predev` and `prebuild` package
// scripts.
initializeIcons('/static/fonts/font-icons-mdl2/');

// Inject some global styles
mergeStyles({
  ':global(body,html,#root)': {
    // height: '100vh',
    margin: 0,
    padding: 0,
    // width: '100vw',
  },
});

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
