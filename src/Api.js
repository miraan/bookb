// @flow

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import {Strategy} from 'passport-http-bearer';
import PostgresClient from './clients/PostgresClient';
import StripeClient from './clients/StripeClient';
import EmailClient from './clients/EmailClient';
import BookRouter from './routers/BookRouter';
import UserRouter from './routers/UserRouter';
import {getUserIdFromUserAuthenticationToken} from './flib/encryption';
import {passportBearerAuthenticated} from './flib/middleware';

export default class Api {
  express: any

  postgresClient: PostgresClient
  stripeClient: StripeClient
  emailClient: EmailClient

  constructor(
    postgresClient: PostgresClient,
    stripeClient: StripeClient,
    emailClient: EmailClient,
  ) {
    this.express = express();
    this.postgresClient = postgresClient;
    this.stripeClient = stripeClient;
    this.emailClient = emailClient;

    this.initPassport();
    this.initMiddleware();
    this.initRoutes();
  }

  initPassport = () => {
    passport.use(new Strategy((token, cb) => {
      const userId = getUserIdFromUserAuthenticationToken(token);
      if (!userId) {
        cb(null, false);
      }
      this.postgresClient.getUserById(userId).then(user => {
        if (!user) {
          cb(null, false);
        }
        return cb(null, user);
      })
      .catch(error => {
        if (!error) {
          return;
        }
        cb('User Authentication Error' + error, false);
      })
    }));

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

  initMiddleware = () => {
    this.express.use(morgan('dev', { stream: { write: msg => console.log(msg) } }));

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use(passportBearerAuthenticated);
  }

  initRoutes = () => {
    // This avoids 304 responses which clients will sometimes otherwise receive.
    this.express.disable('etag');

    const bookRouter = new BookRouter(this.postgresClient);
    this.express.use(bookRouter.path, bookRouter.router)

    const userRouter = new UserRouter(this.postgresClient, this.stripeClient, this.emailClient);
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
