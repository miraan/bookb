// @flow

import * as React from 'react';
import Header from '../components/Header';

const Contact = () => (
  <div className="App">
    <Header showMenuIcon showSearchBar={false} center={false} />
    <h3 className="noTopMargin">Contact</h3>
    You can email us at:
    {' '}
    <a href="mailto:hi@bookb.co">hi@bookb.co</a>
  </div>
);

export default Contact;
