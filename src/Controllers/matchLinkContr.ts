import { get_server } from "../server1";
import getMatchLink from "../scrapeLink";
import cache from '../index.js'
export const matchLinkContr =  async (req, res) => {
    const teams = req.query.teams.split(",");
    const server = req.query.server;
     const data = cache.get(teams+server)
    if (data)
    {
        console.log("******************** cache found *************************");
       return res.status(200).json({ m3u8Data: data });

        
    }
    let linkData;
    //chosing the server
    try {
      switch (server) {
        case "server1":
          linkData = await get_server(teams[0], teams[1]);
  
          break;
        case "server2":
          linkData = await getMatchLink(teams.join(","));
  
        default:
          break;
      }
    } catch (error) {
      console.error(error );
      console.error(error + "/n" );
      console.error("///////////////////////////////////");
      console.error("error getting data for teams" + teams[0] + " vs " + teams[1]);
      return res
        .status(500)
        .send("internal server error " + teams[0] + " vs " + teams[1]);
    }
  
    if (!linkData) {
      return res
        .status(400)
        .send(
          "ERROR no link or data found for match " + teams[0] + " vs " + teams[1]
        );
    }
   cache.set(teams+server,linkData,60*3)
    res.status(200).json({ m3u8Data: linkData });
  }