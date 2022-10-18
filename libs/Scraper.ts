const axios = require("axios").default;
const cherio = require("cherio");
//env variables
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
//___________________________________________________________//
export class Scraper {
  private readonly first_team: string;
  private readonly second_team: string;
  //remeneber to remove the test value
  private match_link: string = "";
  private iframe_urls: any[] = [];
  //the hsl data
  private _hls_data: any[] = [];

  constructor(first_team: string, second_team: string) {
    this.first_team = first_team;
    this.second_team = second_team;
  }

  public get hls_data(): any[] {
    return this._hls_data;
  }

  /**
   * get_match_link
   * getting the link that's playing the match we're targeting
   */
  public async get_match_link(): Promise<boolean> {
    const { data: homeHtml } = await axios.get(process.env.site);
    const first_team = this.first_team;
    const second_team = this.second_team;
    let match_link = "";

    let $ = cherio.load(homeHtml);

    //const divContainers = $("div > div > div.match-event");
    const divContainers = $(".containerMatch");
    console.info("didv container : " + divContainers.length);

    //iterating over the divs
    divContainers.each(function (i, elem) {
      const firstTeamName = $("a", elem).attr("title")?.split("vs")[0].trim();
      const secondTeamName = $("a", elem).attr("title")?.split("vs")[1].trim();

      //checking if it's the match we want ,by comparing the team names
      const teamsSelected = firstTeamName + "," + secondTeamName;

      //if it matches ,quit the loop
      if (
        teamsSelected.includes(first_team) ||
        teamsSelected.includes(second_team)
      ) {
        //  matchLink = $("a#match-live", elem).attr("href");
        match_link = $("a", elem).attr("href");

        return false;
      }
    });
    this.match_link = match_link;

    //if no link is found return with 1

    if (!this.match_link) {
      console.error("no match link found");
      return false;
    }
    return true;
  }
  /**
   * get_urls_attached_to_btns:string
   *
   * gets the iframe urls attached to btns with their quality
   *
   * returns the of btn found 0 if none
   */

  public async get_urls_attached_to_btns(): Promise<number> {
    const { data: linkHtml } = await axios.get(this.match_link);
    let $ = cherio.load(linkHtml);
    //neted iframe boooooooooo
    const { data: frame_html } = await axios.get($("iframe").attr("src"), {
      headers: { Referer: this.match_link },
    });
    $ = cherio.load(frame_html);

    const iframeUrls: any[] = [];
    //iterating over the btns
    $("body > ul > li> a").each(function (i, elem) {
      const quality = $(this).text().trim();
      const onclickAtt = $(this).attr("href");

      let iframeUrl: { quality: String; url: string; referer: string } = {
        quality,
        url: onclickAtt,
        referer: $("iframe").attr("src"),
      };

      iframeUrls.push(iframeUrl);
    });
    if (iframeUrls) {
      this.iframe_urls = [...iframeUrls];
      return iframeUrls.length;
    } else {
      console.log("Error no video iframe btns found !");
      return 0;
    }
  }
  private async get_nested_iframe_url(
    iframe_link: string,
    referer: string
  ): Promise<any> {
    //getting the iframe html content
    const { data: iframeHtml } = await axios.get(iframe_link, {
      headers: { Referer: referer },
    });

    //loading the the html to cherio
    let $ = cherio.load(iframeHtml);
    const Referer = iframe_link;
    //getting the second iframe nested within and returning it
    return { iframe: $("iframe").attr("src"), referer: iframe_link };
  }
  /**
   * get_m3u8_urls
   * the final step of our link scraping journey !
   * getting and decoding hls source
   * returns true if succeded false otherwise
   *
   *
   */
  public async get_m3u8_urls(): Promise<boolean> {
    const urls: any[] = [];
    //getting the final iframe urls using our private method
    for (let index = 0; index < this.iframe_urls.length; index++) {
      const { url, referer } = this.iframe_urls[index];
      const p = await this.get_nested_iframe_url(url, referer);
      urls.push(p);
    }

    //extracting the m3u8 url
    for (let index = 0; index < urls.length; index++) {
      const { iframe, referer } = urls[index];
      let m3u8_url = "";
      //making our final html request
      const { data: iframeHtml } = await axios.get(iframe, {
        headers: { Referer: referer },
      });
      let $ = cherio.load(iframeHtml);

      //itearating over script tags to match the m3u8 source
      $("script").each((i, el) => {
        const script = $(el).html();
        const match = script.match(/window.atob(.*)/)?.[0];
        if (match) {
          const regy = /"(.*?)"/;

          const coded = match.match(regy)[1];

          //decoding the url
          m3u8_url = Buffer.from(coded, "base64") + "";

          return false;
        }
      });

      //adding the hls data
      this._hls_data.push({
        m3u8Link: m3u8_url,
        referer: iframe,
        quality: this.iframe_urls[index].quality,
      });
    }
    if (!this._hls_data.length) {
      console.error(
        "ERROR no hls data found !make sure you have called the necessery methods first!"
      );
      return false;
    }
    return true;
  }
}
