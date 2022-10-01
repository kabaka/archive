import React from 'react';
import ReactDOM from 'react-dom';
import { mergeStyles } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Buffer } from 'buffer';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

global.Buffer = Buffer;

// These fonts are copied into place by the `predev` and `prebuild` package scripts.
initializeIcons('/static/fonts/font-icons-mdl2/');

// Inject some global styles
mergeStyles({
  ':global(body,html,#root)': {
    margin: 0,
    padding: 0,
    height: '100vh',
  },
});

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
