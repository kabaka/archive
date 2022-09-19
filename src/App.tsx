import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Tags from './pages/tags.js';
import { AppCommandBar } from './components/header.js';

export const App: React.FunctionComponent = () => (
  <BrowserRouter>
    <AppCommandBar />
    <Routes>
      <Route path="/">
        Hello
      </Route>
      <Route path="/tags" element=<Tags /> />
    </Routes>
  </BrowserRouter>
);
