/**
 * Route aggregator — mounts all routers under their prefixes.
 */
import { Router } from 'express';
import healthRouter  from './health.js';
import paymentRouter from './payment.js';

const router = Router();

router.use('/health',   healthRouter);
router.use('/payments', paymentRouter);

export default router;
