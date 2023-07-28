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
     const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36', // Use a common User-Agent string for Chrome
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', // Accept various content types
      'Accept-Encoding': 'gzip, deflate, br', // Accept gzip, deflate, and brotli encoding
      'Accept-Language': 'en-US,en;q=0.9', // Accept English language
      'Cache-Control': 'no-cache', // Disable caching
      'Connection': 'keep-alive', // Keep the connection alive
    };
    
    const requestOptions = {
      method: 'GET', // Change the method to match your request type (GET, POST, etc.)
      headers: headers,
    };

      const response = await axios.get(url,{headers});
     html = response.data;
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
