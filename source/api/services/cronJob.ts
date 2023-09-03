import axios from "axios";
import { date } from "joi";
/**
 * a cron job that will make requests to the server every 10 minutes
 * ,thus caching the request
 */
async function cron_job(): Promise<void> {
    const THIRTY_MINUTES=30*60*1000

    try {
        // Make an HTTP GET request to a route within your own server
        const response = await axios.get('http://localhost:3001/');

        // Handle the response here
        const data = response.data;
        for (let index = 0; index < data.games.length; index++) {
            const game = data.games[index];
            //make the request only if the game hasn't ended and it's 30 minutes away from beginning
            const time_diference = (game.timeinMili - Date.now())
           
            if (!game.hasEnded && time_diference < THIRTY_MINUTES) {
                console.log("id",index)
                console.log("game that needs to be cached ", game.firstTeam,game.secondTeam)
                try {
                 const {data} =  await axios.get(`http://localhost:3001/matchLink?teams=${game.firstTeam},${game.secondTeam}&server=server1`)
                } catch (error) {
                    console.log("resquest failed for id =",index)
                    continue;
                }
            }


        }
    } catch (error) {
        console.error('Error making HTTP request:', error);
    }
}

export default cron_job