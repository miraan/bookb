// @flow

import * as React from 'react';
import { Redirect } from 'react-router-dom';
import LocalStorage from '../../LocalStorage';
import Header from '../components/Header';
import isValidEmail from '../../flib/isValidEmail';

type Props = {};
type State = {
  email: string,
}

class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  render = () => {
    if (LocalStorage.isLoggedIn()) {
      return (
        <Redirect to="./catalog" />
      );
    }

    const { email } = this.state;

    return (
      <div className="App">
        <Header showMenuIcon showSearchBar={false} center={false} />
        <h2>Create an Account</h2>
        <div className="signupFormRow">
        Email Address:
        </div>
        <div className="signupFormRow">
          <input
            type="email"
            className="signupFormInput"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </div>
        <div className="signupFormRow">
          <button
            type="submit"
            variant="raised"
            className="signupFormButton"
            onClick={this.onEmailSubmitButtonClick}
          >
          Next
          </button>
        </div>
      </div>
    );
  }

  onEmailSubmitButtonClick = () => {
    const { email } = this.state;
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    console.log(`Save email: ${email}`);
  }
}

export default Signup;
