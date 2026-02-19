import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';
import { createSosRoutes } from './routes/sosRoutes.js';

export const createApp = (io) => {
  const app = express();
  app.use(cors({ origin: env.clientUrl }));
  app.use(helmet());
  app.use(express.json());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/routes', routeRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/sos', createSosRoutes(io));
  app.use(errorHandler);
  return app;
};
