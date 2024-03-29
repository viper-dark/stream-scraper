import axios from "axios";
import cherio from "cherio";

async function getStream(iframeLink: string) {
  //getting the iframe html content
  const { data: iframeHtml } = await axios.get(iframeLink, {
    headers: { Referer: "https://fc.livekoora.online/" },
  });

  //loading the the html to cherio
  let $ = cherio.load(iframeHtml);
  let m3uLink = "";
  const Referer = iframeLink;

  //iterating over the script tags found in the html
  $("script").each(function (i: any, elem: any) {
    //the script as string
    const script: string = $(elem).html();

    // the regex to find urls
    const urlR: RegExp =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    const url = script.match(urlR)?.[0];
    let isM3uLink: boolean = false;

    //checking if the url is valid
    url ? (isM3uLink = url.startsWith("http") && url.endsWith("m3u8")) : null;
    //is the link is found stop the iteration over the scripts <script/>
    if (isM3uLink && url) {
      m3uLink = url;
      return false;
    }
  });

  if (!m3uLink) {
    console.error("ERROR no m3u8 url found with the supplied iframe link😨");
    return null;
  }

  return { m3uLink, Referer };
}
export default getStream;
