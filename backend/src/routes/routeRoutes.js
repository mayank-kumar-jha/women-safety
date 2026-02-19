import { Router } from 'express';
import { analyzeRoutes, getTrips } from '../controllers/routeController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.post('/analyze', authRequired, analyzeRoutes);
router.get('/history', authRequired, getTrips);

export default router;
