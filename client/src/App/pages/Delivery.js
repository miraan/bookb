// @flow

import * as React from 'react';
import {Redirect} from 'react-router-dom';
import Header from '../components/Header';
import LocalStorage from '../../LocalStorage';

type Props = {};

class Delivery extends React.Component<Props> {
  render = () => {
    const user = LocalStorage.getUser();
    if (!user || !user.stripeSubscriptionId) {
      return (
        <Redirect to="./signup" />
      );
    }
    const cart = LocalStorage.getCart();
    const cartSize = Object.keys(cart).length;
    if (cartSize < 1) {
      return (
        <Redirect to="./catalog" />
      );
    }
    return (
      <div className="App">
        <Header showMenuIcon={true} showSearchBar={false} center={false} />
        <h3 className="noTopMargin">Confirm Delivery</h3>
        <ul className="deliveryList">
          {Object.keys(cart).map(key => (
            <li className="deliveryItem" key={key}>
              <b>{cart[key].title}</b> by {cart[key].author}
            </li>
          ))}
        </ul>
        <span>We will text you at {user.mobileNumber} to arrange a delivery time that works for you.</span>
        <button className="confirmDeliveryButton" type="submit" variant="raised">
          Confirm Delivery
        </button>
      </div>
    );
  }
}

export default Delivery;
