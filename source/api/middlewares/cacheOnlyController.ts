
const get_cached_result =async(req, res) => {
    const key = req.originalUrl
    if (cache.has(key)) {
      return res.json(cache.get('expensive-result'));
    }
  
    res.status(404).json({ message: 'Result not available yet' });
  }