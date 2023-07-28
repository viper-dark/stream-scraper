const express = require("express");
const scrape = require("./scraper");
const getLink = require("./scrapeLink");
const { get_server } = require("./server1");
const app = express();

const port = process.env.PORT || 3001;

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
    console.error(error );
    console.error(error + "/n" );
    console.error("///////////////////////////////////");
    console.error("error getting data for teams" + teams[0] + " vs " + teams[1]);
    return res
      .status(500)
      .send("internal server error " + teams[0] + " vs " + teams[1]);
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
