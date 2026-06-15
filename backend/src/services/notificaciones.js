import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function notificarPedidoNuevo(pedido) {
  if (!ADMIN_EMAIL || !process.env.RESEND_API_KEY) return;

  const productos = pedido.productos
    .map(p => `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe6;">${p.name}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe6;text-align:center;">×${p.qty}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe6;text-align:right;">$${(p.price * p.qty).toLocaleString('es-AR')}</td>
    </tr>`)
    .join('');

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;color:#2a1520;">
      <div style="background:#4c2744;padding:28px 32px;">
        <p style="font-family:Georgia,serif;font-size:1.5rem;font-weight:300;letter-spacing:0.08em;color:white;margin:0;">Índigo</p>
      </div>
      <div style="background:#f7f4f2;padding:28px 32px;">
        <p style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#c47955;margin:0 0 8px;">Nuevo pedido</p>
        <h2 style="font-family:Georgia,serif;font-size:1.6rem;font-weight:300;margin:0 0 24px;">${pedido.nombre}</h2>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#ede8e3;">
              <th style="padding:8px 12px;text-align:left;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;">Producto</th>
              <th style="padding:8px 12px;text-align:center;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;">Cant.</th>
              <th style="padding:8px 12px;text-align:right;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${productos}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px 12px;font-weight:600;font-size:0.85rem;">Total</td>
              <td style="padding:10px 12px;text-align:right;font-weight:600;color:#4c2744;">$${pedido.total.toLocaleString('es-AR')}</td>
            </tr>
          </tfoot>
        </table>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-size:0.8rem;color:rgba(42,21,32,0.5);width:100px;">WhatsApp</td>
            <td style="padding:6px 0;font-size:0.8rem;">
              <a href="https://wa.me/${pedido.whatsapp}" style="color:#4c2744;">${pedido.whatsapp}</a>
            </td>
          </tr>
          ${pedido.notas ? `<tr>
            <td style="padding:6px 0;font-size:0.8rem;color:rgba(42,21,32,0.5);">Notas</td>
            <td style="padding:6px 0;font-size:0.8rem;">${pedido.notas}</td>
          </tr>` : ''}
        </table>
      </div>
      <div style="padding:16px 32px;text-align:center;">
        <p style="font-size:0.7rem;color:rgba(42,21,32,0.3);">Índigo · Panel de administración</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Índigo <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `🛍 Nuevo pedido — ${pedido.nombre} ($${pedido.total.toLocaleString('es-AR')})`,
      html,
    });
    console.log(`[Notificación] Email enviado a ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('[Notificación] Error al enviar email:', err.message);
  }
}
