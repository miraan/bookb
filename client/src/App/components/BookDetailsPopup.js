// @flow

import * as React from 'react';
import LocalStorage from '../../LocalStorage';

import type { Book as BookType } from '../../types';

type Props = {
  book: ?BookType,
  onCloseButtonClick: () => void,
  onReadButtonClick: Book => void,
};

const BookDetailsPopup = (props: Props) => {
  const { book, onCloseButtonClick, onReadButtonClick } = props;
  if (!book) {
    return null;
  }
  const isBookInCart = !!LocalStorage.getCart()[book.id];
  return (
    <div className="bookDetailsPopup">
      <div className="bookDetailsPopupHeader">
        <div className="bookDetailsPopupCloseIcon" onClick={onCloseButtonClick}>
          &times;
        </div>
      </div>
      <img className="bookDetailsPopupImage" src={book.imageUrl} alt={book.title} />
      <span className="bookDetailsPopupText"><b>{book.title}</b></span>
      <span className="bookDetailsPopupText">
        {`by ${book.author}`}
      </span>
      <span className="bookDetailsPopupText">{`Genre: ${book.genre}`}</span>
      {book.description
        ? <span className="bookDetailsPopupText bookDetailsPopupDescription">{book.description}</span>
        : null }
      <button className="readButton" type="submit" variant="raised" onClick={() => onReadButtonClick(book)}>
        {isBookInCart ? 'Remove From Cart' : 'Read'}
      </button>
    </div>
  );
};

export default BookDetailsPopup;
