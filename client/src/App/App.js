// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Delivery from './pages/Delivery';
import Signup from './pages/Signup';
import ChoosePlan from './pages/ChoosePlan';
import PaymentMethod from './pages/PaymentMethod';

const App = () => (
  <Switch>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/delivery" component={Delivery} />
        <Route path="/signup" component={Signup} />
        <Route path="/choosePlan" component={ChoosePlan} />
        <Route path="/paymentMethod" component={PaymentMethod} />
      </Switch>
    </div>
  </Switch>
);

export default App;
