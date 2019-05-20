// @flow

import { Router } from 'express';
import passport from 'passport';
import PostgresClient from '../clients/PostgresClient';
import StripeClient from '../clients/StripeClient';
import {generateUserAuthenticationToken} from '../flib/encryption';
import {requireUserAuthentication} from '../flib/middleware';

import type {CreateAccountPayload, User, UpdateUserPayload} from '../types';

export default class UserRouter {
  path: string

  router: Router

  postgresClient: PostgresClient
  stripeClient: StripeClient

  constructor(
    postgresClient: PostgresClient,
    stripeClient: StripeClient,
    path: string = '/api/user',
  ) {
    this.router = Router();
    this.path = path;
    this.postgresClient = postgresClient;
    this.stripeClient = stripeClient;
    this.init();
  }

  init = () => {
    this.router.put('/addEmail', this.addEmail);
    this.router.post('/createAccount', this.createAccount);
    this.router.post('/logIn', this.logIn);
    this.router.put('/update', requireUserAuthentication, this.updateUser);
    this.router.post('/subscribe', requireUserAuthentication, this.subscribe);
  }

  addEmail = (req: any, res: any, next: any) => {
    const { email } = req.body;
    if (!email) {
      throw new Error('UserRouter.addEmail: email parameter required.');
    }
    this.postgresClient.getUserByEmail(email).then(user => {
      if (user && user.password) {
        throw new Error('UserRouter.addEmail: account already exists with that email.');
      }
      return this.postgresClient.addEmail({ email })
    })
    .then(user => {
      res.status(200).json({
        success: true,
        content: {
          user,
        },
      });
    })
      .catch((error) => {
        if (!error) {
          return;
        }
        next(new Error(`UserRouter.addEmail error: ${error}`));
      });
  }

  createAccount = (req: any, res: any, next: any) => {
    const {
      email,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
      mobileNumber,
      password,
    } = req.body;

    if (!email || !addressLine1 || !city || !country || !mobileNumber || !password) {
      throw new Error('UserRouter.createAccount error: invalid payload.');
    }

    const payload: CreateAccountPayload = {
      email,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
      mobileNumber,
      password,
    }

    this.postgresClient.getUserByEmail(email).then(user => {
      if (user && user.password) {
        throw new Error('UserRouter.createAccount: account already exists with that email.');
      }
      return user
        ? this.postgresClient.updateUser(user.id, payload)
        : this.postgresClient.createUser(payload)
    })
    .then(user => {
      const token = generateUserAuthenticationToken(user.id);
      res.status(200).json({
        success: true,
        content: {
          user,
          token,
        },
      });
    })
      .catch((error) => {
        if (!error) {
          return;
        }
        next(new Error(`UserRouter.createAccount error: ${error}`));
      });
  }

  logIn = (req: any, res: any, next: any) => {
    const {email, password} = req.body;
    if (!email || !password) {
      throw new Error('UserRouter.logIn error: invalid payload');
    }
    this.postgresClient.getUserByEmail(email).then(user => {
      if (!user) {
        throw new Error('No account with that email exists.');
      }
      if (user.password !== password) {
        throw new Error('Wrong password.');
      }
      const token = generateUserAuthenticationToken(user.id);
      res.status(200).json({
        success: true,
        content: {
          user,
          token,
        }
      });
    })
    .catch((error) => {
      if (!error) {
        return;
      }
      next(new Error(`UserRouter.logIn error: ${error}`));
    });
  }

  updateUser = (req: any, res: any, next: any) => {
    const user: User = req.user;
    if (!user) {
      throw new Error('UserRouter.updateUser error: null user');
    }
    const payload: UpdateUserPayload = req.body;
    this.postgresClient.updateUser(user.id, payload).then(user => {
      res.status(200).json({
        success: true,
        content: { user },
      });
    })
    .catch(error => {
      if (!error) {
        return;
      }
      next(new Error(`UserRouter.updateUser error: ${error}`));
    });
  }

  subscribe = (req: any, res: any, next: any) => {
    const user: User = req.user;
    if (!user) {
      throw new Error('UserRouter.subscribe error: null user');
    }
    const { planId, stripeToken, stripeCardBrand, stripeCardLastFourDigits } = req.body;
    if (!planId || !stripeToken) {
      throw new Error('UserRouter.subscribe error: invalid payload');
    }

    this.stripeClient.createCustomer(user, stripeToken).then(stripeCustomerId => {
      return this.postgresClient.updateUser(user.id, {stripeCustomerId, stripeCardBrand, stripeCardLastFourDigits})
    })
    .then(user => {
      return this.stripeClient.createSubscription(user.stripeCustomerId, 'plan_' + planId);
    })
    .then(stripeSubscription => {
      const stripeSubscriptionId = stripeSubscription.id;
      return this.postgresClient.updateUser(user.id, {stripeSubscriptionId});
    })
    .then(user => {
      res.status(200).json({
        success: true,
        content: { user },
      });
    })
    .catch(error => {
      if (!error) {
        return;
      }
      next(new Error(`UserRouter.subscribe error: ${error}`));
    });
  }
}
