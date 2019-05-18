// @flow

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import nullthrows from './flib/nullthrows';

import './index.css';
import App from './App/App';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), nullthrows(document.getElementById('root')));
