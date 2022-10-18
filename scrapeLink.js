const axios = require("axios").default;
const cherio = require("cherio");
const getStream = require("./src/scrapeStream.js");

async function getMatchLink(teams) {
  // part 1 getting the a href link
  let matchLink;
  const { data: homeHtml } = await axios.get("https://ma.livekoora.online/");

  let $ = cherio.load(homeHtml);

  //const divContainers = $("div > div > div.match-event");
  const divContainers = $(" div > a ");
  console.log("didv container" + divContainers.length);

  //iterating over the divs
  divContainers.each(function (i, elem) {
    const firstTeamName = $(" div.r-team > div.t-name", elem).text();
    const secondTeamName = $("div.l-team > div.t-name", elem).text();

    //checking if it's the match we want ,by comparing the team names
    const teamsSeparated = teams.split(",");
    const teamsSelected = firstTeamName + "," + secondTeamName;
    console.log("teams selected §§§" + teamsSelected);
    console.log("match link §§§" + $(elem).attr("href"));

    //if it matches ,quit the loop
    if (
      teamsSelected.includes(teamsSeparated[1]) ||
      teamsSelected.includes(teamsSeparated[0])
    ) {
      //  matchLink = $("a#match-live", elem).attr("href");
      matchLink = $(elem).attr("href");
      console.log("hiiiiiiiiiiiii");

      return false;
    }
  });

  //if no link is found return with 1

  if (!matchLink) {
    console.error("no link found");
    return null;
  }
  //part 2 getting the iframe links inside of script and button tags

  /* const { data: linkHtml } = await axios.get(matchLink);
  $ = cherio.load(linkHtml);

  let iframeScripts = []; */

  // iterating over scripts tags
  /*$("script").each(function (i, elem) {
    const script = $(elem).html();

    const bol = script.includes("var no_mobile_iframe");
    //if the script include s this string then it's iframe container
    if (bol) {
      iframeScripts.push({
        quality: "480p",
        iframeContainer: script,
      });
      return false;
    }
  });*/

  //iterating over button tags

  /*   $("button").each(function (i, elem) {
    const quality = $(this).text().trim();

    const onclickAtt = $(this).attr("onclick");

    console.log(i);
    console.log("quality :" + quality);
    console.log("onclick :" + onclickAtt);

      iframeScripts.push({
      quality: quality,
      iframeContainer: onclickAtt,
    });  
  });
 */
  /* const matches = [];
  //itearating over the iframeScripts
  iframeScripts.forEach((el) => {
    //the magical reg to match all that is between "" ,that i just copied off of stackoverflow
    matches.push(
      el.iframeContainer
        .match(/(["'])(?:(?=(\\?))\2.)*?\1/g)
        ?.map((el, i) => el.replace(/^"(.*)"$/, "$1"))
    );
  });
  //if no string matches found for iframe
  if (!matches.length) {
    console.error("no string matches found for iframe");
    return null;
  }

  const hlsData = [];
  // console.log(matches);

  for (const [i, el] of Object.entries(matches)) {
    //random number from 1 to 6 ,reimplemented from the original script
    const back =
      i > 0
        ? Math.floor(Math.random() * 50) + 1
        : Math.floor(Math.random() * 6) + 1;
    // the iframe url
    const l = el.length;

    const iframe = el[l - 2] + back + el[l - 1];

    if (!iframe.startsWith("http")) {
      continue;
    }

    //building the m3u8 link following the original script
    const urlVars = {};
    iframe.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      urlVars[key] = value;
    });

    const m3u8Link =
      "https://" +
      iframe.split("/")[2] +
      "/" +
      urlVars["live"] +
      "/" +
      urlVars["channel"] +
      ".m3u8";

    hlsData.push({
      m3u8Link: m3u8Link,
      referer: iframe,
      quality: iframeScripts[i].quality,
    });
  }*/
  hlsData = [];
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
module.exports = getMatchLink;
