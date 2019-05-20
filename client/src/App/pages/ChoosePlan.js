// @flow

import * as React from 'react';
import Header from '../components/Header';
import PlanOption from '../components/PlanOption';
import {plans} from '../../types';
import LocalStorage from '../../LocalStorage';

import type {Plan as PlanType} from '../../types';

type Props = {};

export default class ChoosePlan extends React.Component<Props> {
  render = () => {
    return (
      <div className="App">
        <Header showMenuIcon showSearchBar={false} center={false} />
        <h3 className="noTopMargin">Pick a Plan</h3>
        {plans.map(plan => (
          <PlanOption key={plan.id} plan={plan} onChooseButtonClick={this.onChoosePlanButtonClick} />
        ))}
      </div>
    );
  }

  onChoosePlanButtonClick = (plan: PlanType) => {
    const cartSize = Object.keys(LocalStorage.getCart()).length
    if (cartSize > plan.maxBooks) {
      alert(`You have ${cartSize} books in your reading cart, but this plan allows a maximum of ${plan.maxBooks} at a time. Please remove books from your cart or select a different plan.`);
      return;
    }
    console.log('chose plan' + plan.id);
  }
}
