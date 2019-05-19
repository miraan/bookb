// @flow

import * as React from 'react';
import BookHScroll from './BookHScroll';

import type { Book as BookType } from '../../types';

type Props = {
  cart: { number: BookType },
  onBookClick: BookType => void,
};

const Cart = (props: Props) => {
  const { cart, onBookClick } = props;
  if (!Object.keys(cart).length) {
    return null;
  }
  const books = [];
  Object.keys(cart).forEach(bookId => books.push(cart[bookId]));
  return (
    <div className="cart">
      <div className="cartHeader">
        Reading Cart
        <button className="addDeliveryDetailsButton" type="submit" variant="raised" onClick={() => {}}>
          Add Delivery Details &gt;&gt;
        </button>
      </div>
      <BookHScroll books={books} onBookClick={onBookClick} smallBooks />
    </div>
  );
};

export default Cart;
