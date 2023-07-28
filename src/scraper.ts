//const puppeteer = require("puppeteer");
const axios = require("axios").default;
const cherio = require("cherio");

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
    if (!matchDay.includes(day)) {
      throw new Error("day expects today | yesterday | tomorrow");
    }
    const website = "https://yalla-shoot.com";
    const url =
      day == "today"
        ? website + "/live/index.php"
        : `${website}/match/${day}_matches.php`;

    //making the request to the url

    try {
   //   const response = await axios.get(url);
     // html = response.data;

     
        const response = await fetch("https://www.kooora.com/default.aspx");
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const htmlContent = await response.text();
        html = htmlContent
        console.log(html);
        

    }
     catch (error) {
      console.error("some shit happend");
      console.error(error.message);
      throw error;
      
    }
  console.log("got the html fine !!!!!!!!!!!!!");
 // console.log(html);
  
    const $ = cherio.load(html);

    const els = $("a.matsh_live").each(function (i, elem) {
      const game = {};

      //team names
      game.firstTeam = $("td.fc_name[align = right ]", elem).text();
      game.secondTeam = $("td.fc_name[align = left ]", elem).text();

      //team logos
      game.firstTeamLogo = $("tr td[ align=right ] img", elem)
        .attr("src")
        .replace("..", website);
      game.secondTeamLogo = $("tr td[ align=left ] img", elem)
        .attr("src")
        .replace("..", website);

      //commentators
      game.comentator = $("td  p", elem).eq(1).text();

      //championship
      game.championship = $("td  p", elem).eq(2).text();

      //channels
      game.channels = $("td  p", elem).eq(0).text();

      //result or game time
      const resOrtime = $("td span.fc_time", elem).text();

      //handeling time
      if (resOrtime.includes("KSA")) {
        let timePeriod = resOrtime.includes("مساء") ? "PM" : "AM";
        const singleDigit = resOrtime.match(/\d/) + "";
        const timeDigits = resOrtime.match(/\d+/g);

        //transform to moroccan time
        let hours = timeDigits[0] - 2;

        if (hours < 1) {
          hours += 12;
          timePeriod = timePeriod == "PM" ? "AM" : "PM";
        }
        const minutes = timeDigits[1];
        game.time = `${hours}:${minutes} ${timePeriod}`;
        game.started = false;
      }

      //handeling result
      else {
        game.result = resOrtime.replace(/\n/g, "");
        game.started = true;
      }

      //checking if game has ended or not
      const p = $("span.matsh_end", elem).eq(1).text();
      game.hasEnded = Boolean(p);

      games.push(game);
    });

    return res.status(200).json({
      games,
    });
  };
}

module.exports = matchData;
