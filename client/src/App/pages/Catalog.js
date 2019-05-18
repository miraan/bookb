// @flow

import * as React from 'react';
import Api from '../../Api';
import Book from '../components/Book'
import Header from '../components/Header'

import type {Book as BookType} from '../../types';

type Props = {};

type State = {
  books: Array<BookType>
};

class Catalog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  componentDidMount() {
    Api.getBooks().then(response => {
      if (response.success) {
        this.setState({books: response.content.books});
      }
    })
    .catch(error => {
      console.log('Api.getBooks error: ' + error);
    })
  }

  render() {
    const { books } = this.state;

    return (
      <div className="App">
        <Header showMenuIcon={true} showSearchBar={true} center={false} />
        {/* Check to see if any items are found */}
        {books.length ? (
          <div>
            {/* Render the list of items */}
            {books.map(book => (
              <Book key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div>
            <h2>Loading Catalog...</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default Catalog;
