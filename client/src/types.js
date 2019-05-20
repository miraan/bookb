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
