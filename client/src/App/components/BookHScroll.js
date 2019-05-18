// @flow

import * as React from 'react';
import Book from './Book';

import type { Book as BookType } from '../../types';

type Props = {
  books: Array<BookType>,
};

const BookHScroll = (props: Props) => {
  const { books } = props;
  return (
    <div className="bookHScroll">
      {books.map(book => (
        <Book id={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookHScroll;
