import { Router } from 'express';
import { crearPedido, listarPedidos, actualizarPedido } from '../controllers/pedidos.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Público — el formulario del frontend crea pedidos
router.post('/', crearPedido);

// Privado — solo admin
router.get('/', adminAuth, listarPedidos);
router.patch('/:id', adminAuth, actualizarPedido);

export default router;
