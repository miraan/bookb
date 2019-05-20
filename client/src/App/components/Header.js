// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import LocalStorage from '../../LocalStorage';
import nav from '../../flib/nav';

type Props = {
  showMenuIcon: boolean,
  showSearchBar: boolean,
  center: boolean,
}

type State = {
  showMenu: boolean,
}

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMenu: false,
    }
  }

  render = () => {
    const { showMenuIcon, showSearchBar, center } = this.props;
    return (
      <div className="header" style={center ? { justifyContent: 'center' } : {}}>
        <div className="headerLeft">
          {showMenuIcon
            ? (
              <div className="menuIcon" onClick={this.onMenuButtonClick}>
                <div className="menuIconLine" />
                <div className="menuIconLine" />
                <div className="menuIconLine" />
              </div>
            ) : null}
          <span>
          BookB
          </span>
        </div>
        {showSearchBar
          ? (
            <div className="searchBar">
              <input className="searchInput" type="text" placeholder="Search" />
            </div>
          )
          : null}
        {this.renderMenu()}
      </div>
    );
  }

  onMenuButtonClick = () => {
    const {showMenu} = this.state;
    this.setState({ showMenu: !showMenu });
  }

  renderMenu = () => {
    const {showMenu} = this.state;
    if (!showMenu) {
      return null;
    }
    const user = LocalStorage.getUser();
    const showLogOut = user && user.stripeCustomerId && user.stripeSubscriptionId;
    return (
      <div className="menu">
        <div className="menuHeader">
          <div className="menuCloseIcon" onClick={this.onMenuButtonClick}>
            &times;
          </div>
        </div>
        <div className="menuItem">
          <Link to="./catalog">
            Catalog
          </Link>
        </div>
        {showLogOut
        ? <>
            <div className="menuItem">
              <Link to="./myBooks">
                My Books
              </Link>
            </div>
            <div className="menuItem" onClick={this.onLogOutButtonPress}>
              Log Out
            </div>
          </>
        : <>
            <div className="menuItem">
              <Link to="./signup">
                Sign Up
              </Link>
            </div>
            <div className="menuItem">
              <Link to="./signup">
                Log In
              </Link>
            </div>
          </>}
      </div>
    )
  }

  onLogOutButtonPress = () => {
    LocalStorage.deleteLocalStorage();
    nav('/');
  }
}

export default Header;
