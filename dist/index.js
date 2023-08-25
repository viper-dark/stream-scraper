/* import dotenv from "dotenv"
const response =dotenv.config()
 */
import path from 'path';
import app from './config/express.config.js';
import createLogger from './api/utils/logger.js';
import constants from "./constants/index.js";
const { env, port } = constants;
const currentModuleUrl = new URL(import.meta.url);
const currentFilename = path.basename(currentModuleUrl.pathname);
const logger = createLogger(currentFilename);
// listen to requests
app.listen(port, (err) => {
    if (err) {
        return logger.error('server failed to start', err);
    }
    return logger.info(`server listening on http://localhost:${port} [env, port] = [${env}, ${port}]`);
});
/**
 * Exports express
 * @public
 */
export default app;
