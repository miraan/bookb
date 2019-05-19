// @flow

import * as React from 'react';
import LocalStorage from '../../LocalStorage';
import {Redirect} from 'react-router-dom';
import Header from '../components/Header';

type Props = {};

class Order extends React.Component<Props> {
  render = () => {
    if (!LocalStorage.isLoggedIn()) {
      return (
        <Redirect to="./signup" />
      );
    }
    return (
      <div className="App">
        <Header showMenuIcon={true} showSearchBar={false} center={false} />
        <h2>Order Details</h2>
      </div>
    );
  }
}

export default Order;
