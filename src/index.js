// @flow

import express from 'express';
import path from 'path';
import Api from './Api';
import PostgresClient from './clients/PostgresClient';

const api: Api = new Api(
  new PostgresClient()
);

// Serve the static files from the React app
api.express.use(express.static(path.join(__dirname, 'client')));

// An api endpoint that returns a short list of items
api.express.get('/api/getList', (req, res) => {
  const list = ['item1', 'item2', 'item3'];
  res.json(list);
  console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
api.express.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/index.html`));
});

const port = process.env.PORT || 5000;
api.express.listen(port);

console.log(`App is listening on port ${port}`);
