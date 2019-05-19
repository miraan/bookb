// @flow

import * as https from 'https';
import * as http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import Api from './Api';
import PostgresClient from './clients/PostgresClient';

const api: Api = new Api(
  new PostgresClient()
);

// Serve the static files from the React app
api.express.use(express.static(path.join(__dirname, 'client')));

// Handles any requests that don't match the ones above
api.express.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/index.html`));
});

// Start the server
if (process.env.DEV_LOCAL) {
  const port = 5000;
  const server = http.createServer(api.express).listen(port);
  server.on('error', (error: ErrnoError) => onError(error, port));
  server.on('listening', () => console.log(`HTTP Server Listening on Port ${port}`));
} else {
  const useHttps = false
  if (useHttps) {
    const httpPort = 80
    const httpsPort = 443
    const httpsKeyFilePath = '/etc/letsencrypt/live/sunrisephotoapp.com/privkey.pem';
    const httpsCertificateFilePath = '/etc/letsencrypt/live/sunrisephotoapp.com/fullchain.pem';

    const httpsServer = https.createServer({
      key: fs.readFileSync(httpsKeyFilePath).toString(),
      cert: fs.readFileSync(httpsCertificateFilePath).toString(),
    }, api.express).listen(httpsPort)

    const httpServer = http.createServer((req: $Request, res: $Response) => {
      res.writeHead(307, { 'Location': 'https://' + req.headers['host'] + req.url })
      res.end()
    }).listen(httpPort)

    httpsServer.on('error', (error: ErrnoError) => onError(error, httpsPort))
    httpsServer.on('listening', () => console.log(`HTTPS Server Listening on Port ${httpsPort}`))

    httpServer.on('error', (error: ErrnoError) => onError(error, httpPort))
    httpServer.on('listening', () => console.log(`HTTP Server Listening on Port ${httpPort}`))
  } else {
    const port = 80;
    const server = http.createServer(api.express).listen(port);
    server.on('error', (error: ErrnoError) => onError(error, port));
    server.on('listening', () => console.log(`HTTP Server Listening on Port ${port}`));
  }
}

const onError = (error: ErrnoError, port: number) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  switch (error.code) {
    case 'EACCES':
      console.log(`Port ${port} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.log(`Port ${port} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}
