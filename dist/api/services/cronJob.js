import axios from "axios";
import { cache } from "../../config/express.config.js";
import { get_server } from "./getServer.service.js";
/**
 * a cron job that will make requests to the server every 10 minutes
 * ,thus caching the request
 */
export async function cron_job_cache_stream() {
    const THIRTY_MINUTES = 30 * 60 * 1000;
    console.log("cron job caching stream_ data running ,", new Date().toISOString());
    try {
        const data = cache.get("matches_data");
        if (!data) {
            console.error("no match data found in the cache");
            return;
        }
        for (let index = 0; index < data.games.length; index++) {
            const game = data.games[index];
            //make the request only if the game hasn't ended and it's 30 minutes away from beginning
            const time_diference = (game.timeinMili - Date.now());
            if (!game.hasEnded && time_diference < THIRTY_MINUTES) {
                console.log(`match that needs to be cached ${game.firstTeam} vs ${game.secondTeam} id:${index}`);
                try {
                    const key = `/matchLink?teams=${game.firstTeam},${game.secondTeam}&server=server1`;
                    const data = await get_server(game.firstTeam, game.secondTeam);
                    //cache valid for 11 minutes
                    cache.set(key, {
                        m3u8Data: data
                    }, 11 * 60);
                }
                catch (error) {
                    console.log("cache resquest failed or soemthing went wrong for id =", index);
                    continue;
                }
            }
        }
    }
    catch (error) {
        console.error('Error making getting match data from cache:', error);
    }
}
export async function cron_job_match_data() {
    console.log("cron job match_data running !", new Date().toISOString());
    try {
        const response = await axios.get(process.env.LOCAL_HOST);
        // Handle the response here
        const data = response.data;
        //caching the matches  data for 2 hours 120 seconds
        cache.set("matches_data", data, (2 * 60 * 60) + 120);
    }
    catch (error) {
        console.error("something went wrong fetching match data ", error);
    }
}
//# sourceMappingURL=cronJob.js.map