// @flow

export type Book = {
  id: number,
  title: string,
  author: string,
  description: string,
  genre: string,
  imageUrl: string,
}

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
  stripeSubscriptionId?: ?string,
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

export type BookOrder = {
  id: number,
  userId: number,
  bookId: number,
  createdTime: string,
  status: 'requested' | 'canceled' | 'delivered' | 'returned',
}

export type Plan = {
  id: number,
  name: string,
  maxBooks: number,
  deliveryDeal: string,
  pricePerMonth: number,
}

export const plans: Array<Plan> = [
  {
    id: 1,
    name: 'Basic Plan',
    maxBooks: 2,
    deliveryDeal: 'Next Day Delivery',
    pricePerMonth: 799,
  },
  {
    id: 2,
    name: 'Standard Plan',
    maxBooks: 4,
    deliveryDeal: 'Same Day Delivery (for orders placed before 6pm)',
    pricePerMonth: 999,
  },
  {
    id: 3,
    name: 'Family Plan',
    maxBooks: 8,
    deliveryDeal: 'Same Day Delivery (for orders placed before 6pm)',
    pricePerMonth: 1299,
  }
]
