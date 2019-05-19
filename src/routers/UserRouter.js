// @flow

import { Router } from 'express';
import PostgresClient from '../clients/PostgresClient';

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
    this.router.put('/', this.addEmail);
  }

  addEmail = (req: any, res: any, next: any) => {
    const { email } = req.body;
    if (!email) {
      throw new Error('UserRouter.addEmail: email parameter required.');
    }
    this.postgresClient.getUserByEmail({ email }).then(user => {
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
}
