import { ScraperDynamic } from "./ScraperDynamic.Class.js";
//first test correct match link
export async function get_server(first_team, second_team) {
    const scraper = new ScraperDynamic(first_team, second_team);
    try {
        await scraper.get_match_link();
    }
    catch (error) {
        console.error("error incoutered trying to get the match data");
        throw error;
    }
    try {
        await scraper.get_urls_attached_to_btns();
    }
    catch (error) {
        console.error("error incoutered trying to get urls/hrefs attached to btns");
        throw error;
    }
    try {
        await scraper.get_m3u8_urls();
    }
    catch (error) {
        console.error("error incoutered trying to get the m3u urls");
        throw error;
    }
    //second step
    //third step
    const data = scraper.hls_data;
    if (!data.length) {
        throw new Error("ERROR trying to fetch data for server 1");
    }
    console.log(`congratulations ${data.length} has been found for match ${first_team} vs ${second_team}`);
    return data;
}
