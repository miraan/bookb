// @flow

import * as React from 'react';

import type {Plan as PlanType} from '../../types';

type Props = {
  plan: PlanType,
  onChooseButtonClick: (PlanType) => void,
}

const PlanOption = (props: Props) => (
  <div className="planOption">
    <div className="planOptionTitle planOptionRow">
      {props.plan.name}
    </div>
    <div className="planOptionRow">
      {props.plan.maxBooks} Books at a Time
    </div>
    <div className="planOptionRow">
      {props.plan.deliveryDeal}
    </div>
    <div className="planOptionRow">
      7 Days Free Trial
    </div>
    <div className="planOptionRow">
      Then £{(props.plan.pricePerMonth / 100).toFixed(2)} / month
    </div>
    <div className="planOptionRow planOptionButton" onClick={() => props.onChooseButtonClick(props.plan)}>
      Choose Plan
    </div>
  </div>
);

export default PlanOption;
