import { cache } from "../../config/express.config.js";
function get_stream_data(req,res){
    const key = decodeURIComponent(req.originalUrl); 

  const cachedResponse =cache.get(key)
  if(cachedResponse)
  {
    console.log(`data found in cache ${key}`)
    return res.status(200).json(cachedResponse)
  }
  console.log(("data not available for key : "+key))
  res.status(400).send("data not available for key : "+key)
}
export default get_stream_data