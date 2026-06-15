/**
 * Route aggregator — mounts all routers under their prefixes.
 */
import { Router } from 'express';
import healthRouter  from './health.js';
import paymentRouter from './payment.js';
import pedidosRouter from './pedidos.js';

const router = Router();

router.use('/health',   healthRouter);
router.use('/payments', paymentRouter);
router.use('/pedidos',  pedidosRouter);

export default router;
