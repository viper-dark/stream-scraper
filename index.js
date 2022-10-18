const express = require("express");
const scrape = require("./scraper.js");
const getLink = require("./scrapeLink.js");
const { get_server } = require("./src/server1.js");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", scrape());
app.get("/yesterday", scrape("yesterday"));
app.get("/tomorrow", scrape("tomorrow"));

app.get("/matchLink", async (req, res) => {
  const teams = req.query.teams.split(",");
  const server = req.query.server;
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
  } catch (error) {
    console.error(error + "!!!!!!!!!!");
  }

  if (!linkData) {
    return res
      .status(400)
      .send(
        "ERROR no link or data found for match " + teams[0] + " vs " + teams[1]
      );
  }

  res.status(200).json({ m3u8Data: linkData });
});

app.listen(port, () => {
  console.info("server listening on http://localhost:" + port);
});

module.exports = app;
