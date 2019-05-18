// @flow

import * as React from 'react';
import Api from '../../Api';

import type {Book} from '../../types';

type Props = {};

type State = {
  books: Array<Book>
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
        <h1>Catalog</h1>
        {/* Check to see if any items are found */}
        {books.length ? (
          <div>
            {/* Render the list of items */}
            {books.map(book => (
              <div>
                {book.title}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2>No Books Found</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default Catalog;
