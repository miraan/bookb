// @flow

import * as React from 'react';
import { Redirect } from 'react-router-dom';
import LocalStorage from '../../LocalStorage';
import Header from '../components/Header';
import isValidEmail from '../../flib/isValidEmail';
import Api from '../../Api';

import type { CreateAccountPayload } from '../../ApiTypes';

type Props = {};
type State = {
  email: string,
  password: string,
  confirmPassword: string,
  addressLine1: string,
  addressLine2: string,
  city: string,
  postCode: string,
  country: string,
  mobileNumber: string,
  loginEmail: string,
  loginPassword: string,
}

class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    LocalStorage.deleteLocalStorage();
    const user = LocalStorage.getUser();
    this.state = {
      email: user && user.email ? user.email : '',
      password: '',
      confirmPassword: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postCode: '',
      country: 'United Kingdom',
      mobileNumber: '+44',
      loginEmail: '',
      loginPassword: '',
    };
  }

  render = () => {
    const user = LocalStorage.getUser();

    if (user && user.password) {
      return (
        <Redirect to="./plan" />
      );
    }

    const {
      email, addressLine1, addressLine2, city, postCode, country, mobileNumber,
      password, confirmPassword, loginEmail, loginPassword,
    } = this.state;

    return (
      <div className="App">
        <Header showMenuIcon showSearchBar={false} center={false} />
        <h3 className="signupFormHeading">Create an Account</h3>
        <div className="signupFormRow">
          Email Address:
        </div>
        <div className="signupFormRow">
          <input type="email" className="signupFormInput" value={email} onChange={e => this.setState({ email: e.target.value })} />
        </div>
        {user && user.email
          ? (
            <>
              <div className="signupFormRow">
                Password:
              </div>
              <div className="signupFormRow">
                <input type="password" className="signupFormInput" value={password} onChange={e => this.setState({ password: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Confirm Password:
              </div>
              <div className="signupFormRow">
                <input type="password" className="signupFormInput" value={confirmPassword} onChange={e => this.setState({ confirmPassword: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Address Line 1:
              </div>
              <div className="signupFormRow">
                <input type="text" className="signupFormInput" value={addressLine1} onChange={e => this.setState({ addressLine1: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Address Line 2:
              </div>
              <div className="signupFormRow">
                <input type="text" className="signupFormInput" value={addressLine2} onChange={e => this.setState({ addressLine2: e.target.value })} />
              </div>
              <div className="signupFormRow">
                City:
              </div>
              <div className="signupFormRow">
                <input type="text" className="signupFormInput" value={city} onChange={e => this.setState({ city: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Post Code / Zip Code:
              </div>
              <div className="signupFormRow">
                <input type="text" className="signupFormInput" value={postCode} onChange={e => this.setState({ postCode: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Country:
              </div>
              <div className="signupFormRow">
                <input type="text" className="signupFormInput" value={country} onChange={e => this.setState({ country: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Mobile Number:
              </div>
              <div className="signupFormRow">
                <input type="text" className="signupFormInput" value={mobileNumber} onChange={e => this.setState({ mobileNumber: e.target.value })} />
              </div>
              <div className="signupFormRow">
                <button
                  type="submit"
                  variant="raised"
                  className="signupFormButton"
                  onClick={this.onCreateAccountButtonClick}
                >
            Create Account
                </button>
              </div>
            </>
          ) : (
            <>
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
              <div className="signupFormRow">
              OR
              </div>
              <h3>Log In</h3>
              <div className="signupFormRow">
                Email Address:
              </div>
              <div className="signupFormRow">
                <input type="email" className="signupFormInput" value={loginEmail} onChange={e => this.setState({ loginEmail: e.target.value })} />
              </div>
              <div className="signupFormRow">
                Password:
              </div>
              <div className="signupFormRow">
                <input type="password" className="signupFormInput" value={loginPassword} onChange={e => this.setState({ loginPassword: e.target.value })} />
              </div>
              <button
                type="submit"
                variant="raised"
                className="signupFormButton"
                onClick={this.onLogInButtonClick}
              >
                Log In
              </button>
            </>
          )}
      </div>
    );
  }

  onLogInButtonClick = () => {
    const { loginEmail, loginPassword } = this.state;
    if (!loginEmail || !loginPassword) {
      alert('Please enter both your email and password to log in.');
      return;
    }
    Api.logIn(loginEmail, loginPassword).then((response) => {
      if (!response.success) {
        alert('Error logging in. Please make sure you have entered the correct email and password, and try again.');
        return;
      }
      LocalStorage.saveUser(response.content.user);
      this.forceUpdate();
    });
  }

  onEmailSubmitButtonClick = () => {
    const { email } = this.state;
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    Api.addEmail(email).then((response) => {
      if (!response.success) {
        alert(`An error occurred please try again. Error: ${response.errorMessage}`);
        return;
      }
      const { user } = response.content;
      LocalStorage.saveUser(user || { email });
      this.forceUpdate();
    })
      .catch((error) => {
        alert(`An error occurred please try again. Error: ${error}`);
      });
  }

  onCreateAccountButtonClick = () => {
    const {
      email, addressLine1, addressLine2, city, postCode, country, mobileNumber,
      password, confirmPassword,
    } = this.state;
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!password) {
      alert('Please choose a password.');
      return;
    }
    if (password !== confirmPassword) {
      alert('The passwords you entered do not match.');
      return;
    }
    if (!addressLine1) {
      alert('Please enter your address line 1.');
      return;
    }
    if (!city) {
      alert('Please enter your city.');
      return;
    }
    if (!postCode) {
      alert('Please enter your post code.');
      return;
    }
    if (!country) {
      alert('Please enter your country.');
      return;
    }
    if (!mobileNumber) {
      alert('Please enter your mobile number.');
    }
    const payload: CreateAccountPayload = {
      email,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
      mobileNumber,
      password,
    };
    Api.createAccount(payload).then((response) => {
      if (!response.success) {
        alert(`An error occurred creating your account. Error: ${response.errorMessage}`);
        return;
      }
      const { user } = response.content;
      LocalStorage.saveUser(user);
      this.forceUpdate();
    })
      .catch((error) => {
        alert(`An error occurred please try again. Error: ${error}`);
      });
  }
}

export default Signup;
