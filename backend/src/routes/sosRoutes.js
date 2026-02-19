import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { stopSos, triggerSos, updateSosLocation } from '../controllers/sosController.js';

export const createSosRoutes = (io) => {
  const router = Router();
  router.use(authRequired);
  router.post('/', triggerSos(io));
  router.patch('/:sosId/location', updateSosLocation(io));
  router.patch('/:sosId/stop', stopSos(io));
  return router;
};
