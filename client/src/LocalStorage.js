// @flow

import type { Book } from './types';

const loginTokenKey: string = 'loginToken';
const booksKey: string = 'books';
const cartKey: string = 'cart';

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

  static isLoggedIn(): boolean {
    return !!LocalStorage.getLoginToken();
  }

  static deleteLocalStorage() {
    LocalStorage.deleteLoginToken();
    LocalStorage.deleteBooks();
    LocalStorage.deleteCart();
  }
}
