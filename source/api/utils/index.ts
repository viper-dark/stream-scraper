import date from "date-and-time"

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36', // Use a common User-Agent string for Chrome
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', // Accept various content types
    'Accept-Encoding': 'gzip, deflate, br', // Accept gzip, deflate, and brotli encoding
    'Accept-Language': 'en-US,en;q=0.9', // Accept English language
    'Cache-Control': 'no-cache', // Disable caching
    'Connection': 'keep-alive', // Keep the connection alive
  };
  
  export const requestOptions = {
    method: 'GET', // Change the method to match your request type (GET, POST, etc.)
    headers: headers,
  };
  
  /**
   *parseTime
   * parses provided time string by subtracting 2 hours 
   */
export const parseTime = (time :string):{time:String,timeinMili:Number} =>{


  const TWO_HOURS =(60*2) * 60 * 1000
   
  let timePeriod = time.includes("PM") ? "PM" : "AM";
   
  const found=time.split(/:| {1}/g)
  let hours : Number
  if(Number(found[0]) == 12)
  {
    hours= timePeriod == "AM" ? 0 :12 ;
  }
  else
  {
    hours = timePeriod == "AM" ? Number(found[0] ) :Number(found[0] )+12

  }
  const minutes = Number(found[1] )
   
  const event = new Date()
  event.setHours(hours,minutes,0)
  
  let after =date.addMilliseconds(event,-TWO_HOURS)
   
  
  return {time :date.format(after, 'hh:mm A'),timeinMili:after.getTime()} 
  
  }
  
  
   