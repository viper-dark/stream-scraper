import httpStatus from 'http-status';
import cherio from "cherio";
import fetch from "node-fetch";
import { requestOptions, parseTime } from "../utils/index.js";
function get_match_data(day = "today") {
    return async (req, res) => {
        ///
        const matchDay = ["today", "yesterday", "tomorrow"];
        let html;
        const games = [];
        //day takes only these values
        if (!matchDay.includes(day)) {
            throw new Error("day expects today | yesterday | tomorrow");
        }
        const website = process.env.INFO_TARGET;
        const url = day == "today"
            ? website + "today-matches1/"
            : `${website}/matches-${day}`;
        //making the request to the url
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const htmlContent = await response.text();
            html = htmlContent;
        }
        catch (error) {
            console.error("smothing went wrong");
            console.error(error.message);
            throw error;
        }
        console.log(" got the html with success !!");
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
            const timeParsed = parseTime(time);
            game.time = timeParsed.time;
            game.timeinMili = timeParsed.timeinMili;
            game.started = notStarted ? false : true;
            //handeling result if endded or started set time
            game.result = game.started || ended ? result : undefined;
            //checking if game has ended or not
            game.hasEnded = ended ? true : false;
            games.push(game);
        });
        return res.status(httpStatus.OK).json({
            games,
        });
    };
}
export default get_match_data;
//# sourceMappingURL=matchesData.controller.js.map