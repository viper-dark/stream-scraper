import express from 'express';

// Import all the routes here
import userRoutes from './user.route.js';

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => {
  res.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

router.use('/', userRoutes);

export default router;
