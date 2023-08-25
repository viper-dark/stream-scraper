import path from 'path';
import expressSession from 'express-session';
import sessionFileStore from 'session-file-store';
const currentModuleDir = path.dirname(new URL(import.meta.url).pathname).replace("/","")

const FileStore = sessionFileStore(expressSession);

const options = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // 30 days in milliseconds
    maxAge: 30 * 24 * 60 * 1000,
  },
  // Make sure you override this value so that cookies
  // saved by the backend do not have the default 'connect.sid' name
  name: 'api-structure',
  // To enable user sessions across server restarts.
  // For more stable persistence storage, you might want to use redis or mongodb

  store: new FileStore({
    path: path.join(currentModuleDir, '../../sessions'),
    secret: process.env.SESSION_SECRET,
    retries: 1,
    fileExtension: '',
  }),
};

const sessionMiddleware = () => expressSession(options);

export default sessionMiddleware;
