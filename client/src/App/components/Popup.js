// @flow

import * as React from 'react';

type Props = {
  onCloseButtonClick?: () => void,
  children: any,
};

const Popup = (props: Props) => {
  const { onCloseButtonClick, children } = props;
  return (
    <div className="bookDetailsPopup">
      {onCloseButtonClick
      ? <div className="bookDetailsPopupHeader">
          <div className="bookDetailsPopupCloseIcon" onClick={onCloseButtonClick}>
            &times;
          </div>
        </div>
      : null}
      {children}
    </div>
  );
};

export default Popup;
