// @flow

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import PostgresClient from './clients/PostgresClient';
import BookRouter from './routers/BookRouter';
import UserRouter from './routers/UserRouter';

export default class Api {
  express: any

  postgresClient: PostgresClient

  constructor(
    postgresClient: PostgresClient,
  ) {
    this.express = express();
    this.postgresClient = postgresClient;

    this.initMiddleware();
    this.initRoutes();
  }

  initMiddleware = () => {
    this.express.use(morgan('dev', { stream: { write: msg => console.log(msg) } }));

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    if (process.env.DEV_LOCAL) {
        // This makes debugging the web apps locally easier.
      this.express.use((req: any, res: any, next: any) => {
        res.header(
          'Access-Control-Allow-Origin',
          '*'
        )
        res.header(
          'Access-Control-Allow-Headers',
          '*'
        )
        res.header(
          'Access-Control-Allow-Methods',
          '*'
        )
        next()
      });
    }
  }

  initRoutes = () => {
    // This avoids 304 responses which clients will sometimes otherwise receive.
    this.express.disable('etag');

    const bookRouter = new BookRouter(this.postgresClient);
    this.express.use(bookRouter.path, bookRouter.router)

    const userRouter = new UserRouter(this.postgresClient);
    this.express.use(userRouter.path, userRouter.router)

    this.express.use((error: any, req: any, res: any, next: any) => {
      console.log(error)
      return res.status(500).json({
        success: false,
        errorMessage: 'Server error: ' + error,
      })
    })
  }
}
