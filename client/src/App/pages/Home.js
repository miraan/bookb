import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => (
  <div className="App">
    <h1>BookB</h1>
    <h2>Borrow Unlimited Books</h2>
    <h3>Same Day Delivery and Return</h3>
    <h3><i>How Our Subscription Works</i></h3>
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
