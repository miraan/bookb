// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const DeliveryConfirmed = () => (
  <div className="App">
    <Header showMenuIcon showSearchBar={false} center={false} />
    <h3 className="noTopMargin">Delivery Confirmed</h3>
    <span className="deliveryConfirmedText">
      {'We\'ll be in touch to arrange a convenient delivery time. You can review your requested books at any time from the menu.'}
    </span>
    <Link to="./catalog">
      <button type="submit" variant="raised">
        Back To Catalog
      </button>
    </Link>
  </div>
);

export default DeliveryConfirmed;
