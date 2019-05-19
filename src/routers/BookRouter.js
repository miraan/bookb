// @flow

import { Router } from 'express';
import PostgresClient from '../clients/PostgresClient';

export default class BookRouter {
  path: string

  router: Router

  postgresClient: PostgresClient

  constructor(
    postgresClient: PostgresClient,
    path: string = '/api/book',
  ) {
    this.router = Router();
    this.path = path;
    this.postgresClient = postgresClient;
    this.init();
  }

  init = () => {
    this.router.get('/', this.getBooks);
  }

  getBooks = (req: any, res: any, next: any) => {
    this.postgresClient.getBooks().then((books) => {
      res.status(200).json({
        success: true,
        content: {
          books,
        },
      });
    })
      .catch((error) => {
        if (!error) {
          return;
        }
        next(new Error(`BookRouter.getBooks error: ${error}`));
      });
  }
}
