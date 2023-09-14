//const puppeteer = require("puppeteer");
import axios from "axios";
import cherio from "cherio";
import fetch from "node-fetch";
 import {requestOptions,parseTime} from "./libs/utils.js";
import {cache} from './index.js'


function matchData(day = "today") {
  return async (req, res) => {
    const matchDay = ["today", "yesterday", "tomorrow"];
    let html;
  const games = [];
    //day takes only these values
    if (!matchDay.includes(day)) {
      throw new Error("day expects today | yesterday | tomorrow");
    }
    const data =cache.get( day )
    if(data)
    {
    
      
     return res.status(304).json({games:data})    
    
      
       
    }
    const website = process.env.YALLA_KORA;
   
    
    const url =
      day == "today"
        ? website + "today-matches1/"
        : `${website}/matches-${day}`;  

    //making the request to the url

    try {
   
     

     
        const response = await fetch(url,requestOptions);
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const htmlContent = await response.text();
        html = htmlContent
        

    }
     catch (error) {
      console.error("some shit happend");
      console.error(error.message);
      throw error;
      
    }
  console.log(" got the html fine !!");
 
  
    const $ = cherio.load(html);
     

    const els = $("#today > div.albaflex > div").each(function (i, elem) {
      const game = {};
      
      

      //team names
      game.firstTeam = $(" a > div.left-team > div.team-name", elem).text();
      game.secondTeam = $("a > div.right-team > div.team-name", elem).text();


      //team logos
      game.firstTeamLogo = $("a > div.left-team > div.team-logo > img", elem)
        .attr("data-src")
        
      game.secondTeamLogo = $("a > div.right-team > div.team-logo > img", elem)
        .attr("data-src")
      
        
        //championship
        game.championship = $("a > div.match-info > ul > li", elem).eq(2).text();
        
      //commentators
      game.comentator = $(" a > div.match-info > ul > li", elem).eq(1).text();

      //channels
      game.channels = $("a > div.match-info > ul > li", elem).eq(0).text();

      

      //result or game time
     // const resOrtime = $("td span.fc_time", elem).text();
      const time = $("#match-time", elem).text();
      const result = $("#result", elem).text();
      const notStarted = $(" a > div.match-center > div > div.not-start", elem).text() 
      const ended = $(" a > div.match-center > div > div.end", elem).text()
      
      
      

      //handeling time
     
      //  let timePeriod = time.includes("PM") ? "PM" : "AM";
      /*   const singleDigit = time.match(/\d/) + "";
        const timeDigits = time.match(/\d+/g);
 */
        //transform to moroccan time
        /* let hours = timeDigits[0] - 2;

        if (hours < 1) {
          hours += 12;
          timePeriod = timePeriod == "PM" ? "AM" : "PM";
        } */

      //  const houss= time.split(":")        const minutes = timeDigits[1];
        game.time = parseTime(time);
        game.started = notStarted ? false:true;
      

      //handeling result if endded or started set time
      game.result= game.started || ended ? result : undefined
      
      

      //checking if game has ended or not
    
      game.hasEnded =ended ?true:false ;

      games.push(game);
      
      
    });

    cache.set(day,games,60)

    return res.status(200).json({
      games,
    });
  };
}

export default  matchData;