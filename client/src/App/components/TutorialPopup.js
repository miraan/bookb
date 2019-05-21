// @flow

import * as React from 'react';
import LocalStorage from '../../LocalStorage';
import Popup from './Popup';

export default class TutorialPopup extends React.Component<{}> {
  render = () => {
    const seenTutorial = LocalStorage.getSeenTutorial();
    if (seenTutorial) {
      return null;
    }
    return (
      <Popup>
        <div className="tutorial">
          <span className="tutorialRow tutorialTitle">BookB</span>
          <span className="tutorialRow">Borrow Unlimited Books</span>
          <span className="tutorialRow">Same Day Delivery and Return</span>
          <span>How Our Subscription Works:</span>
          <ul>
            <li>Explore Our Catalog</li>
            <li>Select Your Books</li>
            <li>Same Day Delivery</li>
            <li>Exchange When You Want</li>
          </ul>
          <div>
            <button className="tutorialButton" type="submit" variant="raised" onClick={this.onCloseButtonClick}>
              Got It
            </button>
          </div>
        </div>
      </Popup>
    );
  }

  onCloseButtonClick = () => {
    LocalStorage.saveSeenTutorial(true);
    this.forceUpdate();
  }
}
