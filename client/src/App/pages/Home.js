// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => (
  <div className="App">
    <Header showMenuIcon={false} center showSearchBar={false} center={false} />
    <h2>Borrow Unlimited Books</h2>
    <h3>Same Day Delivery and Return</h3>
    <p>How Our Subscription Works:</p>
    <div className="howItWorks">
      <ul>
        <li>Explore Our Catalog</li>
        <li>Select Your Books</li>
        <li>Same Day Delivery</li>
        <li>Exchange Whenever You Want</li>
      </ul>
    </div>
    <Link to="./catalog">
      <button type="submit" variant="raised">
            Continue To Catalog
      </button>
    </Link>
  </div>
);

export default Home;
