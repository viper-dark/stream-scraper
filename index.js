const express = require("express");
const cors = require("cors");
const scrape = require("./scraper");
const getLink = require("./scrapeLink");

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

//scrape();

app.get("/", scrape());
app.get("/yesterday", scrape("yesterday"));
app.get("/tomorrow", scrape("tomorrow"));

app.get("/matchLink", async (req, res) => {
  const teams = req.query.teams;
  const linkData = await getLink(teams);
  if (!linkData) {
    return res.status(404).send("no link found for match " + teams);
  }

  res.status(200).json({ m3u8Data: linkData });
});

app.listen(port, () => {
  console.log("server listening on http://localhost:" + port);
});

module.exports = app;
