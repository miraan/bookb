// @flow

import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Elements, StripeProvider } from 'react-stripe-elements';
import Header from '../components/Header';
import CheckoutForm from '../components/CheckoutForm';
import LocalStorage from '../../LocalStorage';

type Props = {};

export default class PaymentMethod extends React.Component<Props> {
  render = () => {
    const user = LocalStorage.getUser();

    if (!user || !user.password) {
      return (
        <Redirect to="./signup" />
      );
    }

    if (!user.planId) {
      return (
        <Redirect to="./choosePlan" />
      );
    }

    if (user.stripeCustomerId && user.stripeSubscriptionId) {
      return (
        <Redirect to="./delivery" />
      );
    }

    return (
      // <StripeProvider apiKey="pk_test_bSMKb3xdVGaOYIsYJ1lYRSmR00Pzyrveg1">
      <StripeProvider apiKey="pk_live_dsNNsB7wvIEC2bzINUUBOGwu00ldtqScAQ">
        <div className="App">
          <Header showMenuIcon showSearchBar={false} center={false} />
          <h3 className="noTopMargin">Add a Payment Card</h3>
          <span className="paymentText">You won't be charged until after your 7 day free trial, and you can cancel at any time.</span>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    )
  }
}
