import httpStatus from 'http-status';
import cors from 'cors';
import APIError from '../api/utils/APIError.js';

const options = {
  origin: (origin, callback) => {
    // In dev, allow these origins to access the API
    const whiteList = ['localhost', 'chrome-extension'];
    const index = whiteList.findIndex((aWhiteListedOrigin) => origin.includes(aWhiteListedOrigin));
    if (!origin || index !== -1) {
      callback(null, true);
    } else {
      const error = {
        message: `'${origin}' is not allowed to access the specified route/resource`,
        status: httpStatus.FORBIDDEN,
      };
      callback(new APIError(error), false);
    }
  },
  credentials: false,
};

const corsMiddleware = () => cors(options);

export default corsMiddleware;
