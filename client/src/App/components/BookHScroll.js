// @flow

import * as React from 'react';
import Book from './Book';

import type { Book as BookType } from '../../types';

type Props = {
  books: Array<BookType>,
  onBookClick: Book => void,
  smallBooks?: boolean,
};

const BookHScroll = (props: Props) => {
  const { books, onBookClick, smallBooks } = props;
  return (
    <div className="bookHScroll">
      {books.map(book => (
        <Book key={book.id} book={book} onClick={onBookClick} small={smallBooks} />
      ))}
    </div>
  );
};

export default BookHScroll;
