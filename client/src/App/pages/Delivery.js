// @flow

import * as React from 'react';
import {Redirect} from 'react-router-dom';
import Header from '../components/Header';
import LocalStorage from '../../LocalStorage';
import Api from '../../Api';
import {plans} from '../../types';
import nav from '../../flib/nav';

import type {Plan} from '../../types';

type Props = {};

class Delivery extends React.Component<Props> {
  render = () => {
    const user = LocalStorage.getUser();
    if (!user || !user.stripeSubscriptionId) {
      console.log('Delivery page: redirecting to signup as no user with payment method logged in.');
      return (
        <Redirect to="./signup" />
      );
    }
    const cart = LocalStorage.getCart();
    if (!Object.keys(cart).length) {
      console.log('Delivery page: redirecting to catalog as cart is empty.');
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
        <button className="confirmDeliveryButton" type="submit" variant="raised" onClick={this.onConfirmDeliveryButtonClick}>
          Confirm Delivery
        </button>
      </div>
    );
  }

  onConfirmDeliveryButtonClick = () => {
    const user = LocalStorage.getUser();
    if (!user || !user.stripeSubscriptionId) {
      return;
    }

    const bookIds = Object.keys(LocalStorage.getCart());
    if (!bookIds.length) {
      return;
    }

    const plan: ?Plan = plans.find(p => p.id === user.planId)
    if (!plan) {
      return;
    }

    if (bookIds.length > plan.maxBooks) {
      alert(`Your current plan allows a maximum of ${plan.maxBooks} at a time. Please remove some books from your cart or upgrade your plan.`);
      return;
    }

    Api.createBookOrders(bookIds).then(response => {
      if (!response.success) {
        alert('An error occurred, please try again. Error: ' + response.errorMessage);
        return;
      }
      LocalStorage.saveBookOrders(response.content.bookOrders);
      LocalStorage.saveCart({});
      nav('/deliveryConfirmed');
    })
  }
}

export default Delivery;
