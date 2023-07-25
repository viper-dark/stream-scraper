"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_server = void 0;
const ScraperDynamic_1 = require("../libs/ScraperDynamic.js");
//first test correct match link
async function get_server(first_team, second_team) {
    const scraper = new ScraperDynamic_1.ScraperDynamic(first_team, second_team);
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
exports.get_server = get_server;
