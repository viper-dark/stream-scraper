
import date from "date-and-time"

const parseTime = (time ) =>{


    const TWO_HOURS =(60*2) * 60 * 1000
    
     
    let timePeriod = time.includes("PM") ? "PM" : "AM";
     
    const found=time.split(/:| {1}/g)
    let hours 
    
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
    const tim = event.getTime()
    const now = Date.now()
    const dif = (tim - now)/1000 / 60 /60 
  const mi = event.toISOString()
  const mia = after.toISOString()
     
    
    return {time :date.format(after, 'hh:mm A'),timeinMili:event.getTime()}
    
    }
    
   let res= parseTime("10:50 PM")

     