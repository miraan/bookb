// @flow

import stripe from 'stripe';

import type { User } from '../types';

export type StripeCharge = {
  id: string,
  amount: number,
  status: 'succeeded' | 'pending' | 'failed'
}

export type StripeSubscription = {
  id: string,
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
}

export default class StripeClient {
  client: any

  constructor() {
    // this.client = stripe('sk_test_Y3RIifQvhBY08L6RqARwRaX3001RLLgyC4');
    this.client = stripe('sk_live_dQ0fBU7bLwLO0XIIxECSHMvI00bCBWq5ne');
  }

  createCustomer: (User, string) => Promise<string> =
  (user: User, stripeToken: string) => this.client.customers.create({
    source: stripeToken,
    email: user.email,
    description: `${user.firstName || ''} ${user.lastName || ''} (${user.email})`,
    metadata: {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
    },
  })
    .then(customer => Promise.resolve(customer.id))
    .catch(error => Promise.reject(error.message))

  updateCustomer: (string, string) => Promise<string> =
  (stripeCustomerId: string, stripeToken: string) => this.client.customers.update(
    stripeCustomerId, {
      source: stripeToken,
    },
  )
    .then(customer => Promise.resolve(customer.id))
    .catch(error => Promise.reject(error.message))

  createCharge: (string, string, number, string) => Promise<StripeCharge> =
    (stripeCustomerId: string, description: string,
      amount: number, email: string) => this.client.charges.create({
      amount,
      currency: 'gbp',
      customer: stripeCustomerId,
      description,
      ...(email ? { receipt_email: email } : {}),
    })
      .catch(error => Promise.reject(error.message))

  retrieveCharge: string => Promise<StripeCharge> =
    (stripeChargeId: string) => this.client.charges.retrieve(stripeChargeId)
      .catch(error => Promise.reject(error.message))

  createSubscription = (stripeCustomerId: string,
    stripePlanId: string): Promise<StripeSubscription> => this.client.subscriptions.create({
    customer: stripeCustomerId,
    trial_from_plan: true,
    trial_period_days: 7,
    items: [
      {
        plan: stripePlanId,
      },
    ],
  })
    .catch(error => Promise.reject(error.message))
}
