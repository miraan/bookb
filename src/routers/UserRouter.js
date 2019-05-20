// @flow

import { Router } from 'express';
import passport from 'passport';
import PostgresClient from '../clients/PostgresClient';
import StripeClient from '../clients/StripeClient';
import {generateUserAuthenticationToken} from '../flib/encryption';
import {requireUserAuthentication} from '../flib/middleware';
import {plans} from '../types';

import type {CreateAccountPayload, User, UpdateUserPayload, Plan} from '../types';

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
    this.router.post('/bookOrders', requireUserAuthentication, this.createBookOrders);
    this.router.get('/bookOrders', requireUserAuthentication, this.getBookOrders);
    this.router.get('/cancelBookOrder/:bookId', requireUserAuthentication, this.cancelBookOrder);
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

  createBookOrders = (req: any, res: any, next: any) => {
    const user: User = req.user;
    if (!user) {
      throw new Error('UserRouter.createBookOrders error: null user');
    }

    const plan = plans.find(p => p.id === user.planId)
    if (!plan) {
      throw new Error('UserRouter.createBookOrders error: user has no plan.');
    }

    if (!user.stripeCustomerId || !user.stripeSubscriptionId) {
      throw new Error('UserRouter.createBookOrders error: user has no payment method / active subscription.');
    }

    const bookIds = req.body.bookIds;
    if (!bookIds) {
      throw new Error('UserRouter.createBookOrders error: no bookIds.');
    }

    if (bookIds.length > plan.maxBooks) {
      throw new Error(`UserRouter.createBookOrders error: user is only allowed ${plan.maxBooks} books, but ${bookIds.length} books were requested.`);
    }

    this.postgresClient.getBookOrders(user.id).then(bookOrders => {
      const requested = bookOrders.filter(b => b.status === 'requested')
      if (requested.length + bookIds.length > plan.maxBooks) {
        throw new Error(`You will exceed the maximum number of books allowed under your plan if you request these books in addition to your already requested books. Please cancel some book requests first.`)
      }
      return Promise.all(
        bookIds.map(
          bookId => this.postgresClient.createBookOrder(user.id, bookId)
        )
      )
    })
    .then(results => {
      return this.postgresClient.getBookOrders(user.id)
    })
    .then(bookOrders => {
      res.status(200).json({
        success: true,
        content: { bookOrders },
      });
    })
    .catch(error => {
      if (!error) {
        return;
      }
      next(new Error(`UserRouter.createBookOrders error: ${error}`));
    });
  }

  getBookOrders = (req: any, res: any, next: any) => {
    const user: User = req.user;
    if (!user) {
      throw new Error('UserRouter.getBookOrders error: null user');
    }

    this.postgresClient.getBookOrders(user.id).then(bookOrders => {
      res.status(200).json({
        success: true,
        content: { bookOrders },
      });
    })
    .catch(error => {
      if (!error) {
        return;
      }
      next(new Error(`UserRouter.getBookOrders error: ${error}`));
    });
  }

  cancelBookOrder = (req: any, res: any, next: any) => {
    const user: User = req.user;
    if (!user) {
      throw new Error('UserRouter.cancelBookOrder error: null user');
    }

    const bookId = req.params.bookId;
    if (!bookId) {
      throw new Error('UserRouter.cancelBookOrder error: no bookId given');
    }

    this.postgresClient.cancelBookOrder(user.id, bookId).then(bookOrder => {
      return this.postgresClient.getBookOrders(user.id)
    })
    .then(bookOrders => {
      res.status(200).json({
        success: true,
        content: { bookOrders },
      });
    })
    .catch(error => {
      if (!error) {
        return;
      }
      next(new Error(`UserRouter.cancelBookOrder error: ${error}`));
    });
  }
}
