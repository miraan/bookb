// @flow

import { Router } from 'express';
import PostgresClient from '../clients/PostgresClient';

import type {CreateAccountPayload} from '../types';

export default class UserRouter {
  path: string

  router: Router

  postgresClient: PostgresClient

  constructor(
    postgresClient: PostgresClient,
    path: string = '/api/user',
  ) {
    this.router = Router();
    this.path = path;
    this.postgresClient = postgresClient;
    this.init();
  }

  init = () => {
    this.router.put('/addEmail', this.addEmail);
    this.router.post('/createAccount', this.createAccount);
    this.router.post('/logIn', this.logIn);
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
      res.status(200).json({
        success: true,
        content: {
          user,
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
}
