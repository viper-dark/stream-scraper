"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const puppeteer = require("puppeteer");
const axios = require("axios").default;
const cherio = require("cherio");
const fetch = require("node-fetch");
const utils_1 = __importDefault(require("./libs/utils"));
/* async function scrape_movies() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://kora.livekoora.online/", {
    waitUntil: "networkidle0",
  });

  //await page.waitForSelector("video");
  const html = await page.content();

  await fs.writeFile("data.html", html, () => {
    console.log("html written succefullys");
  });
  // other actions...
  await browser.close();
} */
function matchData(day = "today") {
    return async (req, res) => {
        const matchDay = ["today", "yesterday", "tomorrow"];
        let html;
        const games = [];
        //day takes only these values
        /* if (!matchDay.includes(day)) {
           throw new Error("day expects today | yesterday | tomorrow");
         }
         const website = "https://yalla-shoot.com";
         const url =
           day == "today"
             ? website + "/live/index.php"
             : `${website}/match/${day}_matches.php`; */
        //making the request to the url
        try {
            //   const response = await axios.get(url);
            // html = response.data;
            const response = await fetch("https://stad.yalla-shoot.io/today-matches1/", utils_1.default);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const htmlContent = await response.text();
            html = htmlContent;
        }
        catch (error) {
            console.error("some shit happend");
            console.error(error.message);
            throw error;
        }
        console.log("got the html fine !!!!!!!!!!!!!");
        const $ = cherio.load(html);
        const els = $("#today > div.albaflex > div").each(function (i, elem) {
            const game = {};
            //team names
            game.firstTeam = $(" a > div.left-team > div.team-name", elem).text();
            game.secondTeam = $("a > div.right-team > div.team-name", elem).text();
            //team logos
            game.firstTeamLogo = $("a > div.left-team > div.team-logo > img", elem)
                .attr("data-src");
            game.secondTeamLogo = $("a > div.right-team > div.team-logo > img", elem)
                .attr("data-src");
            //championship
            game.championship = $("a > div.match-info > ul > li", elem).eq(2).text();
            //commentators
            game.comentator = $(" a > div.match-info > ul > li", elem).eq(1).text();
            //channels
            game.channels = $("a > div.match-info > ul > li", elem).eq(0).text();
            //result or game time
            // const resOrtime = $("td span.fc_time", elem).text();
            const time = $("#match-time", elem).text();
            const result = $("#result", elem).text();
            const notStarted = $(" a > div.match-center > div > div.not-start", elem).text();
            const ended = $(" a > div.match-center > div > div.end", elem).text();
            //handeling time
            let timePeriod = time.includes("مساء") ? "PM" : "AM";
            const singleDigit = time.match(/\d/) + "";
            const timeDigits = time.match(/\d+/g);
            //transform to moroccan time
            let hours = timeDigits[0] - 2;
            if (hours < 1) {
                hours += 12;
                timePeriod = timePeriod == "PM" ? "AM" : "PM";
            }
            const minutes = timeDigits[1];
            game.time = `${hours}:${minutes} ${timePeriod}`;
            game.started = false;
            //handeling result
            //checking if game has ended or not
            game.hasEnded = ended ? true : false;
            games.push(game);
        });
        return res.status(200).json({
            games,
        });
    };
}
module.exports = matchData;
