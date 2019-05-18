// @flow

import * as React from 'react';
import truncate from '../../flib/truncate';

import type { Book as BookType } from '../../types';

type Props = {
  book: BookType
}

const Book = (props: Props) => {
  const { book } = props;
  return (
    <div className="book">
      <img className="bookImage" src={book.imageUrl} alt={book.title} />
      <p>{truncate(book.title, 40)}</p>
    </div>
  );
};

export default Book;
