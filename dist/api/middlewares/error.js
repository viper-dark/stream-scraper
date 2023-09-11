import httpStatus from 'http-status';
import { ValidationError } from 'express-validation';
import APIError from '../utils/APIError.js';
import constants from '../../constants/index.js';
const { env } = constants;
/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err, req, res, next) => {
    console.log(err);
    const response = {
        code: err.status || httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
    };
    if (env !== 'development') {
        delete response.stack;
    }
    res.status(response.code);
    res.json(response);
    res.end();
};
/**
 * If the error is not an instance of APIError, convert it.
 * @public
 */
export const converter = (err, req, res, next) => {
    let convertedError = err;
    if (err instanceof ValidationError) {
        convertedError = new APIError({
            message: 'Validation Error',
            errors: err.errors,
            status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
            stack: err.stack,
        });
    }
    else if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
            stack: err.stack,
        });
    }
    return handler(convertedError, req, res);
};
/**
 * Catch 404 and forward to the error handler
 * @public
 */
export const notFound = (req, res) => {
    const err = new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res);
};
export default { handler, notFound, converter };
//# sourceMappingURL=error.js.map