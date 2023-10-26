import cherio from "cherio";
import fetch from "node-fetch";
import { requestOptions, parseTime } from "./libs/utils.js";
import { cache } from './index.js';
function matchData(day = "today") {
    return async (req, res) => {
        const matchDay = ["today", "yesterday", "tomorrow"];
        let html;
        const games = [];
        //day takes only these values
        if (!matchDay.includes(day)) {
            throw new Error("day expects today | yesterday | tomorrow");
        }
        const data = cache.get(day);
        if (data) {
            return res.status(304).json({ games: data });
        }
        const website = process.env.YALLA_KORA;
        const url = day == "today"
            ? website
            : `${website}/p/${day}-matches.html`;
        //making the request to the url
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const htmlContent = await response.text();
            //  writeFile("tss.html",htmlContent, err => {
            //   if (err) {
            //    console.error(err);
            //   }})
            html = htmlContent;
        }
        catch (error) {
            console.error("some shit happend");
            console.error(error.message);
            throw error;
        }
        console.log(" got the html fine !!");
        const $ = cherio.load(html);
        const els = $("div.widget.HTML > div.match-container").each(function (i, elem) {
            const game = {};
            //team names
            game.firstTeam = $(" a > div.right-team", elem).text();
            game.secondTeam = $(" a > div.left-team", elem).text();
            //team logos
            game.firstTeamLogo = $("a > div.right-team > div.team-logo > img", elem)
                .attr("data-img");
            game.secondTeamLogo = $(" a > div.left-team > div.team-logo > img", elem)
                .attr("data-img");
            //championship
            game.championship = $(" a > div.match-info > ul > li > span", elem).eq(2).text().trim();
            //commentators
            game.channels = $(" a > div.match-info > ul > li > span", elem).eq(1).text().trim();
            //channels
            game.comentator = $("a > div.match-info > ul > li > span", elem).eq(0).text().trim();
            //result or game time
            // const resOrtime = $("td span.fc_time", elem).text();
            const result = $("#result", elem).text();
            let time = timeStampToTime($(" a > div.match-center > div > div.date", elem).attr("data-start"));
            let timeStart = $(" a > div.match-center > div > div.date", elem).attr("data-start");
            let timeEnd = $(" a > div.match-center > div > div.date", elem).attr("data-gameends");
            function timeStampToTime(time) {
                const timeRegex = /T(\d{2}:\d{2}):\d{2}\+\d{2}:\d{2}/;
                const match = time.match(timeRegex);
                if (!match) {
                    return "";
                }
                return match[1];
            }
            function isTimeGreaterThanCurrentTime(time) {
                const timeRegex = /T(\d{2}:\d{2}):\d{2}\+\d{2}:\d{2}/;
                const match = time.match(timeRegex);
                if (!match) {
                    return false;
                }
                time = match[1];
                const offset = match[0].split("+")[1]; // The second capturing group contains the offset
                // Parse the extracted time string
                const timeParts = time.split(":");
                // Create a Date object for the target time
                const targetTime = new Date();
                targetTime.setUTCHours(parseInt(timeParts[0], 10));
                targetTime.setUTCMinutes(parseInt(timeParts[1], 10));
                // Calculate the offset in minutes
                const offsetParts = offset.split(":");
                const offsetMinutes = parseInt(offsetParts[0], 10) * 60 + parseInt(offsetParts[1], 10);
                // Adjust the target time by the offset
                targetTime.setMinutes(targetTime.getUTCMinutes() - offsetMinutes);
                // Get the current UTC time
                const currentUTC = new Date();
                if (currentUTC >= targetTime) {
                    console.log("The current time is equal to or greater than the target time.");
                    return true;
                }
                return false;
            }
            const started = isTimeGreaterThanCurrentTime(timeStart);
            const ended = isTimeGreaterThanCurrentTime(timeEnd);
            //handeling time
            //  let timePeriod = time.includes("PM") ? "PM" : "AM";
            /*   const singleDigit = time.match(/\d/) + "";
              const timeDigits = time.match(/\d+/g);
       */
            //transform to moroccan time
            /* let hours = timeDigits[0] - 2;
    
            if (hours < 1) {
              hours += 12;
              timePeriod = timePeriod == "PM" ? "AM" : "PM";
            } */
            //  const houss= time.split(":")        const minutes = timeDigits[1];
            game.time = parseTime(time);
            game.started = started;
            //handeling result if endded or started set time
            game.result = game.started || ended ? result : undefined;
            //checking if game has ended or not
            game.ended = ended;
            console.log(game);
            if (day == "tomorrow") {
                game.started = false;
                game.ended = false;
            }
            else if (day == "yesterday") {
                game.started = false;
                game.ended = true;
            }
            games.push(game);
        });
        cache.set(day, games, 60);
        return res.status(200).json({
            games,
        });
    };
}
export default matchData;
//# sourceMappingURL=scraper.js.map