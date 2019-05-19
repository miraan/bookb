// @flow

import type { Book, User } from './types';

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

export type AddEmailPayload = {
  email: string,
}

export type AddEmailSuccess = {
  success: true,
  content: {
    user: User,
  }
}
export type AddEmailResponse = AddEmailSuccess | Failure
