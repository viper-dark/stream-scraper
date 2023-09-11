import axios from "axios";
import cherio from "cherio";
import getStream from "../services/getStream.service.js";
async function getMatchLink(teams) {
    // part 1 getting the a href link
    let matchLink;
    const { data: homeHtml } = await axios.get("https://kora.yalla-shoot-new.live/");
    let $ = cherio.load(homeHtml);
    const divContainers = $("div.match-event");
    console.info("didv container" + divContainers.length);
    //iterating over the divs
    divContainers.each(function (i, elem) {
        const firstTeamName = $(" div.right-team > div.team-name", elem).text();
        const secondTeamName = $(" div.left-team > div.team-name", elem).text();
        //checking if it's the match we want ,by comparing the team names
        const teamsSeparated = teams.split(",");
        const teamsSelected = firstTeamName + "," + secondTeamName;
        console.info("teams selected = " + teamsSelected);
        console.info("match link = " + $("#overlay-match > a", elem).attr("href"));
        //if it matches ,quit the loop
        if (teamsSelected.includes(teamsSeparated[1]) ||
            teamsSelected.includes(teamsSeparated[0])) {
            //  matchLink = $("a#match-live", elem).attr("href");
            matchLink = $("#overlay-match > a", elem).attr("href");
            console.log("match link found !");
            return false;
        }
    });
    //if no link is found return with 1
    if (!matchLink) {
        console.error("no link found");
        return null;
    }
    const hlsData = [];
    const iframeUrls = await getIframeLink(matchLink);
    for (let index = 0; index < iframeUrls.length; index++) {
        const element = iframeUrls[index];
        const data = await getStream(element.url);
        hlsData.push({
            m3u8Link: data.m3uLink,
            referer: element.url,
            quality: element.quality,
        });
    }
    return hlsData.length ? hlsData : null;
}
async function getIframeLink(matchLink) {
    const { data: linkHtml } = await axios.get(matchLink);
    $ = cherio.load(linkHtml);
    const iframeUrls = [];
    $("#tabs > button").each(function (i, elem) {
        const quality = $(this).text().trim();
        const iframeUrl = {};
        const onclickAtt = $(this)
            .attr("onclick")
            .match(/"(.*?)"/)[1];
        iframeUrl.quality = quality;
        iframeUrl.url = onclickAtt;
        iframeUrls.push(iframeUrl);
    });
    return iframeUrls
        ? iframeUrls
        : console.log("Error no video iframe btns found !");
}
export default getMatchLink;
//# sourceMappingURL=getMatchLink.service.js.map