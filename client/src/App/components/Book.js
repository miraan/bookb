// @flow

import * as React from 'react';
import truncate from '../../flib/truncate';

import type { Book as BookType } from '../../types';

type Props = {
  book: BookType,
  onClick: BookType => void,
  small?: boolean,
}

const Book = (props: Props) => {
  const { book, onClick, small } = props;
  return (
    <div className={small ? "bookSmall" : "book"} onClick={() => onClick(book)}>
      <img className={small ? "bookImageSmall" : "bookImage"} src={book.imageUrl} alt={book.title} />
      <p>{truncate(book.title, small ? 20 : 40)}</p>
    </div>
  );
};

export default Book;
