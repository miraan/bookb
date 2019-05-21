// @flow

import * as React from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Api from '../../Api';
import LocalStorage from '../../LocalStorage';
import nav from '../../flib/nav';

type Props = {
  stripe: any,
};

class CheckoutForm extends React.Component<Props> {
  onButtonPress = async () => {
    // LocalStorage.deleteLocalStorage();
    const user = LocalStorage.getUser();
    if (!user) {
      return;
    }
    const planId = user.planId;
    if (!planId) {
      return;
    }

    const { stripe } = this.props;
    const { token } = await stripe.createToken();

    if (!token) {
      return;
    }

    const stripeToken = token.id;
    const stripeCardBrand = token.card.brand;
    const stripeCardLastFourDigits = token.card.last4;
    console.log('Got stripe details:', stripeToken, stripeCardBrand, stripeCardLastFourDigits);

    Api.subscribe({planId, stripeToken, stripeCardBrand, stripeCardLastFourDigits}).then(response => {
      if (!response.success) {
        alert('An error occurred, please try again. Error: ' + response.errorMessage)
        return;
      }
      LocalStorage.saveUser(response.content.user);
      nav('/delivery');
    })
  }

  render = () => (
    <div className="checkoutForm">
      <div className="cardElementContainer">
        <CardElement
          className="cardElement"
          hidePostalCode={true}
          iconStyle='solid' />
      </div>
      <button
        className="addPaymentMethodButton"
        type="submit"
        variant="raised"
        onClick={this.onButtonPress}
      >
        Add
      </button>
    </div>
  )
}

export default injectStripe(CheckoutForm);
