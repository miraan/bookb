// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Catalog from './pages/Catalog';
import Delivery from './pages/Delivery';
import Signup from './pages/Signup';
import ChoosePlan from './pages/ChoosePlan';
import PaymentMethod from './pages/PaymentMethod';
import DeliveryConfirmed from './pages/DeliveryConfirmed';
import MyBooks from './pages/MyBooks';
import Contact from './pages/Contact';

const App = () => (
  <Switch>
    <div>
      <Switch>
        <Route exact path="/" component={Catalog} />
        <Route path="/delivery" component={Delivery} />
        <Route path="/signup" component={Signup} />
        <Route path="/choosePlan" component={ChoosePlan} />
        <Route path="/paymentMethod" component={PaymentMethod} />
        <Route path="/deliveryConfirmed" component={DeliveryConfirmed} />
        <Route path="/myBooks" component={MyBooks} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </div>
  </Switch>
);

export default App;
