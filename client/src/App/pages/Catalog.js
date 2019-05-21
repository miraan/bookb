// @flow

import * as React from 'react';
import Api from '../../Api';
import LocalStorage from '../../LocalStorage';
import Header from '../components/Header';
import BookHScroll from '../components/BookHScroll';
import BookDetailsPopup from '../components/BookDetailsPopup';
import Cart from '../components/Cart';
import TutorialPopup from '../components/TutorialPopup';

import type {Book as BookType} from '../../types';

type Props = {};

type State = {
  books: Array<BookType>,
  selectedBook: ?BookType,
  cart: { number: BookType },
  searchBarText: string,
};

class Catalog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // LocalStorage.deleteLocalStorage();
    this.state = {
      books: LocalStorage.getBooks(),
      selectedBook: null,
      cart: LocalStorage.getCart(),
      searchBarText: '',
    };
  }

  componentDidMount() {
    Api.getBooks().then(response => {
      if (response.success) {
        const books = response.content.books;
        this.setState({books: books});
        LocalStorage.saveBooks(books);
      }
    })
    .catch(error => {
      console.log('Api.getBooks error: ' + error);
    })
  }

  render = () => {
    const { books, selectedBook, cart, searchBarText } = this.state;

    const searchText = searchBarText.trim().toLowerCase();
    const filteredBooks = !searchText.length ? books : books.filter(b => b.title.toLowerCase().includes(searchText) || b.author.toLowerCase().includes(searchText));

    const genreToBooks = {};
    filteredBooks.forEach(book => {
      if (!genreToBooks[book.genre]) {
        genreToBooks[book.genre] = [];
      }
      genreToBooks[book.genre].push(book);
    });

    return (
      <div className="App">
        <Header
          showMenuIcon={true}
          showSearchBar={true}
          center={false}
          searchBarText={searchBarText}
          onSearchBarTextChange={this.onSearchBarTextChange} />
        {filteredBooks.length ? (
          Object.keys(genreToBooks).map(genre => (
            <div key={genre} className="genre">
              <div className="genreHeading">
                {genre}
              </div>
              <BookHScroll books={genreToBooks[genre]} onBookClick={this.onBookClick} />
            </div>
          ))
        ) : (
          <div>
            <h2>{!books.length ? 'Loading Catalog...' : 'No Results'}</h2>
          </div>
        )
        }
        <BookDetailsPopup
          book={selectedBook}
          onCloseButtonClick={() => this.setState({ selectedBook: null})}
          onReadButtonClick={this.onReadButtonClick} />
        <TutorialPopup />
        <Cart cart={cart} onBookClick={this.onBookClick} />
        <div className="footer">
          Copyright © 2019 BookB
        </div>
      </div>
    );
  }

  onBookClick = (book: BookType) => {
    console.log('Clicked book: ' + book.id)
    this.setState({ selectedBook: book });
  }

  onReadButtonClick = (book: BookType) => {
    console.log('Book cart: ' + book.id);
    const {cart} = this.state;

    // If it's in the cart, remove it, else add it.
    if (!!cart[book.id]) {
      delete cart[book.id];
    } else {
      if (Object.keys(cart).length >= 8) {
        alert('You can order a maximum of 8 books at a time. Please remove something else from your cart before adding this book.');
        return
      }
      cart[book.id] = book;
    }

    this.setState({ selectedBook: null, cart: cart });
    LocalStorage.saveCart(cart);
  }

  onSearchBarTextChange = (searchBarText: string) => {
    this.setState({ searchBarText });
  }
}

export default Catalog;
