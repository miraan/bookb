// @flow

import type { Book, User, BookOrder } from './types';

const loginTokenKey: string = 'loginToken';
const booksKey: string = 'books';
const cartKey: string = 'cart';
const userKey: string = 'user';
const bookOrdersKey: string = 'bookOrders';
const seenTutorialKey: string = 'seenTutorial';

export default class LocalStorage {
  static saveLoginToken(loginToken: string) {
    sessionStorage.setItem(loginTokenKey, loginToken);
  }

  static getLoginToken(): ?string {
    return sessionStorage.getItem(loginTokenKey);
  }

  static deleteLoginToken() {
    sessionStorage.removeItem(loginTokenKey);
  }

  static saveBooks(books: Array<Book>) {
    sessionStorage.setItem(booksKey, JSON.stringify(books));
  }

  static getBooks(): Array<Book> {
    const json = sessionStorage.getItem(booksKey);
    if (!json) {
      return [];
    }
    return JSON.parse(json);
  }

  static deleteBooks() {
    sessionStorage.removeItem(booksKey);
  }

  static saveCart(cart: {number: Book}) {
    sessionStorage.setItem(cartKey, JSON.stringify(cart));
  }

  static getCart(): {number: Book} {
    const json = sessionStorage.getItem(cartKey);
    if (!json) {
      return {};
    }
    return JSON.parse(json);
  }

  static deleteCart() {
    sessionStorage.removeItem(cartKey);
  }

  static saveUser(user: User) {
    sessionStorage.setItem(userKey, JSON.stringify(user));
  }

  static getUser(): ?User {
    const json = sessionStorage.getItem(userKey);
    if (!json) {
      return null;
    }
    return JSON.parse(json);
  }

  static deleteUser() {
    sessionStorage.removeItem(userKey);
  }

  static saveBookOrders(bookOrders: Array<BookOrder>) {
    sessionStorage.setItem(bookOrdersKey, JSON.stringify(bookOrders));
  }

  static getBookOrders(): Array<BookOrder> {
    const json = sessionStorage.getItem(bookOrdersKey);
    if (!json) {
      return [];
    }
    return JSON.parse(json);
  }

  static deleteBookOrders() {
    sessionStorage.removeItem(bookOrdersKey);
  }

  static saveSeenTutorial(seenTutorial: boolean) {
    sessionStorage.setItem(seenTutorialKey, JSON.stringify(seenTutorial))
  }

  static getSeenTutorial(): boolean {
    const json = sessionStorage.getItem(seenTutorialKey)
    return !!json
  }

  static deleteSeenTutorial() {
    sessionStorage.removeItem(seenTutorialKey)
  }

  static deleteLocalStorage() {
    LocalStorage.deleteLoginToken();
    LocalStorage.deleteBooks();
    LocalStorage.deleteCart();
    LocalStorage.deleteUser();
    LocalStorage.deleteBookOrders();
    LocalStorage.deleteSeenTutorial();
  }
}
