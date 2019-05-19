// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Order from './pages/Order';
import Signup from './pages/Signup';

const App = () => (
  <Switch>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/order" component={Order} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </div>
  </Switch>
);

export default App;
