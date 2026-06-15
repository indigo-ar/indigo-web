import supabase from '../config/supabase.js';
import { ok, fail } from '../utils/response.js';
import { notificarPedidoNuevo } from '../services/notificaciones.js';

// POST /api/pedidos — crear pedido desde el formulario
export async function crearPedido(req, res) {
  const { nombre, whatsapp, productos, total, notas, medio_pago } = req.body;

  if (!nombre || !whatsapp || !productos?.length) {
    return fail(res, 'Faltan campos requeridos');
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert([{
      nombre, whatsapp, productos, total, notas,
      estado: 'pendiente',
      pago: 'pendiente',
      medio_pago: medio_pago ?? null
    }])
    .select()
    .single();

  if (error) return fail(res, error.message, 500);

  // Notificar al admin por WhatsApp
  notificarPedidoNuevo(data);

  return ok(res, data, 201);
}

// GET /api/pedidos — listar pedidos (solo admin)
export async function listarPedidos(req, res) {
  const { estado } = req.query;

  let query = supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (estado) query = query.eq('estado', estado);

  const { data, error } = await query;
  if (error) return fail(res, error.message, 500);
  return ok(res, data);
}

// PATCH /api/pedidos/:id — actualizar estado y/o pago
export async function actualizarPedido(req, res) {
  const { id } = req.params;
  const { estado, pago, medio_pago } = req.body;

  const estados = ['pendiente', 'en_preparacion', 'listo', 'entregado'];
  const pagos   = ['pendiente', 'pagado'];

  if (estado && !estados.includes(estado)) return fail(res, 'Estado inválido');
  if (pago   && !pagos.includes(pago))     return fail(res, 'Estado de pago inválido');

  const updates = {};
  if (estado)     updates.estado     = estado;
  if (pago)       updates.pago       = pago;
  if (medio_pago) updates.medio_pago = medio_pago;

  const { data, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return fail(res, error.message, 500);
  return ok(res, data);
}
