import express from 'express';
import get_match_data from '../../controllers/matchesData.controller.js';
import { cacheMiddleware } from '../../middlewares/cache.js';
import get_stream_data from '../../controllers/getCachedStreamData.controller.js';
//import controller from '../../controllers/matchStream.controller';
//import validation from '../../validations/user.validation';
//import authenticated from '../../middlewares/authenticated';
const router = express.Router();
// un protected route
// Notice the same names of functions/object in validation and controller
router.route('/').get(cacheMiddleware(100), get_match_data());
// protected route
router.route('/yesterday').get(cacheMiddleware(100), get_match_data("yesterday"));
router.route('/tomorrow').get(cacheMiddleware(100), get_match_data("tomorrow"));
router.route('/matchLink').get(get_stream_data);
export default router;
//# sourceMappingURL=user.route.js.map