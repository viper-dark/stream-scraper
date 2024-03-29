import { cache } from "../../config/express.config.js"
export const cacheMiddleware =(duration : number)=> (req,res,next)=>
 {
  const key = decodeURIComponent(req.originalUrl); 

  const cachedResponse =cache.get(key)
  if(cachedResponse)
  {
    console.log(`cache hit for key = ${key}`)
    return res.json(cachedResponse)
  }
  else 
  {
    console.log('cache miss for key = '+ key)
    res.original = res.json
    res.json=(body:{})=>
    {
     res.original(body)
     cache.set(key,body,duration)
    }

  }
  next()


 }