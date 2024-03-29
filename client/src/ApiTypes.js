// @flow

import type { Book, User, BookOrder } from './types';

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

export type CreateAccountPayload = {
  email: string,
  addressLine1: string,
  addressLine2: string,
  city: string,
  postCode: string,
  country: string,
  mobileNumber: string,
  password: string,
}

export type CreateAccountSuccess = {
  success: true,
  content: {
    user: User,
    token: string,
  }
}
export type CreateAccountResponse = CreateAccountSuccess | Failure

export type LogInPayload = {
  email: string,
  password: string,
}

export type LogInResponse = CreateAccountResponse

export type UpdateUserPayload = {
  ...$ObjMap<$Diff<User, {
    id: number,
    createdTime: string,
  }>, ToOptionalType>,
}

export type UpdateUserResponse = AddEmailResponse

export type SubscribePayload = {
  planId: number,
  stripeToken: string,
  stripeCardBrand: string,
  stripeCardLastFourDigits: string,
}

export type SubscribeResponse = AddEmailResponse

export type CreateBookOrdersSuccess = {
  success: true,
  content: {
    bookOrders: Array<BookOrder>,
  }
}

export type CreateBookOrdersResponse = CreateBookOrdersSuccess | Failure

export type GetBookOrdersResponse = CreateBookOrdersResponse

export type CancelBookOrderResponse = GetBookOrdersResponse | Failure
