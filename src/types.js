// @flow

export type Book = {
  id: number,
  title: string,
  author: string,
  description: string,
  genre: string,
  imageUrl: string,
}

export type Plan = 1 | 2 | 3

export type User = {
  id: number,
  email: string,
  password?: ?string,
  firstName?: ?string,
  lastName?: ?string,
  addressLine1?: ?string,
  addressLine2?: ?string,
  city?: ?string,
  postCode?: ?string,
  country?: ?string,
  mobileNumber?: ?string,
  stripeCustomerId?: ?string,
  stripeCardBrand?: ?string,
  stripeCardLastFourDigits?: ?string,
  planId?: ?number,
  createdTime: string,
}

export type AddEmailPayload = {
  email: string,
}

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

export type UpdateUserPayload = {
  ...$ObjMap<$Diff<User, {
    id: number,
    createdTime: string,
  }>, ToOptionalType>,
}
