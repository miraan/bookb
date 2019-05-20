// @flow

import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import Header from '../components/Header';
import CheckoutForm from '../components/CheckoutForm';

const PaymentMethod = () => (
  <StripeProvider apiKey="pk_test_bSMKb3xdVGaOYIsYJ1lYRSmR00Pzyrveg1">
    <div className="App">
      <Header showMenuIcon showSearchBar={false} center={false} />
      <h3 className="noTopMargin">Add a Payment Card</h3>
      <Elements>
        <CheckoutForm />
      </Elements>
    </div>
  </StripeProvider>
);

export default PaymentMethod;
