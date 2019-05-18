// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Catalog from './pages/Catalog';

const App = () => (
  <Switch>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/catalog" component={Catalog} />
      </Switch>
    </div>
  </Switch>
);

export default App;
