import './bootstrap';
import './tracer';

// @ts-ignore
import Youch from 'youch';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import connect_datadog from 'connect-datadog';
import 'express-async-errors';
import cors from 'cors';
import http from 'http';

import * as Sentry from '@sentry/node';
import '@config/database';
import routesV1 from './app/API';
import sentryConfig from './config/sentry';
import LogiError from './app/Error/LogiError';

class App {
  protected app = express();

  server: http.Server;

  constructor() {
    this.server = new http.Server(this.app);

    if (process.env.NODE_ENV === 'production') Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    if (process.env.NODE_ENV === 'production')
      this.app.use(connect_datadog({ response_code: true }));
    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.app.use(routesV1);
    this.app.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.app.use(
      async (
        err: Error | LogiError,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err.name === 'LogiValidationError') {
          // @ts-ignore
          return res.status(err.status).json(err.body);
        }
        if (err.name === 'MulterError') {
          const { message } = err;
          const error = {
            status: 'error',
            message,
          };
          return res.status(400).json(error);
        }
        if (process.env.NODE_ENV === 'development') {
          const errors = await new Youch(err, req).toJSON();

          return res.status(500).json(errors);
        }

        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    );
  }
}

export default new App();
