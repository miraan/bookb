// @flow

import type { Book } from './types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type Failure = {
  success: false,
  errorMessage: string,
}

export type GetBooksSuccess = {
  success: true,
  content: {
    books: Array<Book>,
  }
}
export type GetBooksResponse = GetBooksSuccess | Failure
