import { Scraper } from "../libs/Scraper.js";

//first test correct match link
export async function get_server(
  first_team: string,
  second_team: string
): Promise<any> {
  const scraper = new Scraper(first_team, second_team);
  await scraper.get_match_link();

  //second step
  await scraper.get_urls_attached_to_btns();

  //third step
  await scraper.get_m3u8_urls();

  const data = scraper.hls_data;
  if (!data.length) {
    console.error("ERROR trying to fetch data for server 1");
    return -1;
  }
  return data;
}