// @flow

import * as React from 'react';

import type { Book as BookType } from '../../types';

type Props = {
  book: BookType
}

const Book = (props: Props) => {
  const { book } = props;
  return (
    <div className="book">
      <img className="bookImage" src={book.imageUrl} alt={book.title} />
      <p>{book.title}</p>
      <p><i>{book.author}</i></p>
    </div>
  );
};

export default Book;
