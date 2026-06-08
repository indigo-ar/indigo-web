require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // en producción reemplazar con tu dominio

// Inicializar MP con el access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// ── Crear preferencia de pago ──────────────────────
app.post('/create-preference', async (req, res) => {
  const { items, payer } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No hay productos en el carrito' });
  }

  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map(item => ({
          id: String(item.id),
          title: item.name,
          quantity: item.qty,
          unit_price: item.price,
          currency_id: 'ARS',
        })),
        payer: {
          name: payer?.name || '',
          phone: {
            number: payer?.phone || '',
          },
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:3456'}/?pago=aprobado`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:3456'}/?pago=error`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:3456'}/?pago=pendiente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'INDIGO ALFAJORES',
        payment_methods: {
          excluded_payment_types: [],
          installments: 1,
        },
      },
    });

    res.json({ preferenceId: response.id, initPoint: response.init_point });
  } catch (error) {
    console.error('Error creando preferencia MP:', error);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
});

// ── Health check ──────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'OK', service: 'Índigo Backend' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
