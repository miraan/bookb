// @flow

import * as React from 'react';
import Api from '../../Api';
import LocalStorage from '../../LocalStorage';
import Header from '../components/Header';

import type { BookOrder, Book } from '../../types';

type Props = {};

export default class MyBooks extends React.Component<Props> {
  componentDidMount() {
    Api.getBookOrders().then((response) => {
      if (!response.success) {
        console.log(`Api.getBookOrders error: ${response.errorMessage}`);
        return;
      }
      LocalStorage.saveBookOrders(response.content.bookOrders);
      this.forceUpdate();
    })
      .catch((error) => {
        console.log(`Api.getBookOrders error: ${error}`);
      });
  }

  render = () => {
    const bookOrders = LocalStorage.getBookOrders();
    const statusToBookOrders = {};
    bookOrders.forEach((b) => {
      if (!statusToBookOrders[b.status]) {
        statusToBookOrders[b.status] = [];
      }
      statusToBookOrders[b.status].push(b);
    });
    return (
      <div className="App">
        <Header showMenuIcon showSearchBar={false} center={false} />
        <h3 className="noTopMargin">My Books</h3>
        {this.renderBookOrders('Awaiting Delivery', statusToBookOrders.requested, true)}
        {this.renderBookOrders('Delivered', statusToBookOrders.delivered)}
        {this.renderBookOrders('Returned', statusToBookOrders.returned)}
        {this.renderBookOrders('Canceled Requests', statusToBookOrders.canceled)}
      </div>
    );
  }

  renderBookOrders = (title: string, bookOrders: Array<BookOrder>,
    showCancelButtons: boolean = false) => {
    if (!bookOrders) {
      return null;
    }
    const books = LocalStorage.getBooks();
    return (
      <>
        <span className="myBooksRow"><b>{title}</b></span>
        <ul>
          {bookOrders.map((bookOrder) => {
            const book = books.find(b => b.id === bookOrder.bookId);
            if (!book) {
              return null;
            }
            return (
              <li className="myBooksMenuItem">
                <b>{book.title}</b>
                {' by '}
                {book.author}
                {' '}
                {showCancelButtons
                  ? <a className="cancelBookOrderLink" onClick={() => this.onCancelBookButtonPress(book)}>CANCEL</a>
                  : null}
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  onCancelBookButtonPress = (book: Book) => {
    Api.cancelBookOrder(book.id).then((response) => {
      if (!response.success) {
        alert(`An error occurred, please try again. Error: ${response.errorMessage}`);
        return;
      }
      LocalStorage.saveBookOrders(response.content.bookOrders);
      this.forceUpdate();
    });
  }
}
