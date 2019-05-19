// @flow

import * as React from 'react';
import LocalStorage from '../../LocalStorage';
import Header from '../components/Header';
import isValidEmail from '../../flib/isValidEmail';
import Api from '../../Api';

type Props = {};
type State = {
  email: string,
  addressLine1: string,
  addressLine2: string,
  city: string,
  postCode: string,
  country: string,
  mobileNumber: string,
}

class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postCode: '',
      country: '',
      mobileNumber: '',
    };
  }

  render = () => {
    const user = LocalStorage.getUser();
    const {
      email, addressLine1, addressLine2, city, postCode, country, mobileNumber,
    } = this.state;

    return (
      <div className="App">
        <Header showMenuIcon showSearchBar={false} center={false} />
        <h2 className="signupFormHeading">Create an Account</h2>
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
          )}
      </div>
    );
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
    });
  }

  onCreateAccountButtonClick = () => {
    console.log('create acc');
  }
}

export default Signup;
