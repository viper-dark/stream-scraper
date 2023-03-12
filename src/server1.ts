import { ScraperDynamic } from "../libs/ScraperDynamic";

//first test correct match link
export async function get_server(
  first_team: string,
  second_team: string
): Promise<any> {
  const scraper = new ScraperDynamic(first_team, second_team);
  await scraper.get_match_link();

  //second step
  await scraper.get_urls_attached_to_btns();

  //third step
  await scraper.get_m3u8_urls();

  const data = scraper.hls_data;
  if (!data.length) {
    throw new Error("ERROR trying to fetch data for server 1");
  }
  return data;
}
