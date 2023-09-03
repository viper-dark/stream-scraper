import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import tmp from 'tmp';


//import session from './session.config.js';
import cors from './cors.config.js';
import clientLogs from './client-log.config';

import routes from '../api/routes/v1/index.js';
import error from '../api/middlewares/error.js';
import constants from '../constants/index.js';
import cron from "node-cron"
import cron_job from '../api/services/cronJob.js';
const {logs}=constants
/**
 * Express instance
 * @public
 */
const app = express();

// TODO: Include CSRF middlewares here

// request logging. dev: console | production: file
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'))

//app.use(morgan(logs));

// This middleware take care of the origin when the origin is undefined.
// origin is undefined when request is local
 app.use((req, _, next) => {
	req.headers.origin = req.headers.origin || req.headers.host;
	next();
}); 

// CORS configuration
app.use(cors());

// parse body params and attache them to req.body
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// gzip compression
//app.use(compression());

// secure apps by setting various HTTP headers
//app.use(helmet());

/**
 * App Configurations
 */

// session configuration
//app.use(session());

// mount api v1 routes
app.use('/', routes);
//app.use('/api/client-log', clientLogs);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

// temporary files created using tmp will be deleted on UncaughtException
//tmp.setGracefulCleanup();

//cron job to make automatic requests to the server
cron.schedule("*/5 * * * *", cron_job)

export default app;
