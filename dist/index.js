import express from "express";
import scrape from "./scraper.js";
import morgan from "morgan";
import dotenv from "dotenv";
import NodeCache from 'node-cache';
import cors from "cors";
import cron from "node-cron";
import fetch from "node-fetch";
const app = express();
(() => {
    //  let log = console.log
    const context = new Date().toISOString();
    console.log = console.log.bind(console, context);
})();
//cron job to keep the render app awake by calling it every 10 minutes
cron.schedule('*/10 * * * *', async () => {
    console.log(`pinging the render app at time ${new Date().toISOString()}`);
    const response = await fetch("https://scraper-pacx.onrender.com/status");
    const data = await response.json();
    console.log(data);
});
app.use(cors());
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));
export const cache = new NodeCache();
dotenv.config();
const port = process.env.PORT || 3001;
app.get("/", scrape());
app.get("/yesterday", scrape("yesterday"));
app.get("/tomorrow", scrape("tomorrow"));
app.get("/matchLink", async (req, res) => {
    const teams = req.query.teams.split(",");
    const server = req.query.server;
    // redirecting the request to the render server
    return res.redirect("https://scraper-pacx.onrender.com" + req.originalUrl);
    let linkData;
    //chosing the server
    try {
        switch (server) {
            case "server1":
                linkData = await get_server(teams[0], teams[1]);
                break;
            case "server2":
                linkData = await getLink(teams.join(","));
            default:
                break;
        }
    }
    catch (error) {
        console.error(error);
        console.error(error + "/n");
        console.error("///////////////////////////////////");
        console.error("error getting data for teams" + teams[0] + " vs " + teams[1]);
        return res
            .status(500)
            .send("internal server error " + teams[0] + " vs " + teams[1]);
    }
    if (!linkData) {
        return res
            .status(400)
            .send("ERROR no link or data found for match " + teams[0] + " vs " + teams[1]);
    }
    res.status(200).json({ m3u8Data: linkData });
});
app.get("/matchLink");
app.listen(port, () => {
    console.info("server listening on http://localhost:" + port);
});
export default app;
//# sourceMappingURL=index.js.map