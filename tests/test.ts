const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
import { Scraper } from "../libs/Scraper";
const { first, second, link } = process.env;

const scraper = new Scraper(first, second);
//first test correct match link
async () => {
  const b = await scraper.get_match_link();
  console.log("is the correct link :");
};
//second test
(async () => {
  //first step
  await scraper.get_match_link();
  //second step
  const b = await scraper.get_urls_attached_to_btns();

  //third step
  const t = await scraper.get_m3u8_urls();
  console.log(scraper);
  console.log(t);

  //await scraper.get_m3u8_url();
})();
