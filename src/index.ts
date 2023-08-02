import express from "express";
import scrape from "./scraper.js";
import morgan from "morgan"
import path from "path";
import dotenv from "dotenv";
import NodeCache from 'node-cache'
const app = express();
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'))


export const cache = new NodeCache(  );


dotenv.config();

const port = process.env.PORT || 3001;

app.get("/", scrape());
app.get("/yesterday", scrape("yesterday"));
app.get("/tomorrow", scrape("tomorrow"));

app.get("/matchLink",);

app.listen(port, () => {
  console.info("server listening on http://localhost:" + port);
});

export default app;