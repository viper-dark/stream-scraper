/**
 * Common constants across all the environments (dev, staging, prod)
 */
import dotenv from "dotenv";
dotenv.config();
export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
};
