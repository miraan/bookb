// @flow

import * as React from 'react';

type Props = {
  showMenuIcon: boolean,
  showSearchBar: boolean,
  center: boolean,
}

const Header = (props: Props) => {
  const { showMenuIcon, showSearchBar, center } = props;
  return (
    <div className="header" style={center ? { justifyContent: 'center' } : {}}>
      <div className="headerLeft">
        {showMenuIcon
          ? (
            <div className="menuIcon">
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
    </div>
  );
};

export default Header;
