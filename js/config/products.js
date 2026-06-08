/**
 * Product catalog data.
 * Single source of truth — consumed by products module and cart.
 */
export const PRODUCTS = [
  {
    id: 1,
    name: 'Vainilla · Blanco',
    desc: 'Tapas de vainilla, relleno de dulce de leche, cobertura de chocolate blanco.',
    price: 3000,
    tapa: 'vainilla',
    cobertura: 'blanco',
  },
  {
    id: 2,
    name: 'Vainilla · Con leche',
    desc: 'Tapas de vainilla, relleno de dulce de leche, cobertura de chocolate con leche.',
    price: 3000,
    tapa: 'vainilla',
    cobertura: 'leche',
  },
  {
    id: 3,
    name: 'Vainilla · Semiamargo',
    desc: 'Tapas de vainilla, relleno de dulce de leche, cobertura de chocolate semiamargo.',
    price: 3000,
    tapa: 'vainilla',
    cobertura: 'semi',
  },
  {
    id: 4,
    name: 'Chocolate · Blanco',
    desc: 'Tapas de chocolate, relleno de dulce de leche, cobertura de chocolate blanco.',
    price: 3000,
    tapa: 'chocolate',
    cobertura: 'blanco',
  },
  {
    id: 5,
    name: 'Chocolate · Con leche',
    desc: 'Tapas de chocolate, relleno de dulce de leche, cobertura de chocolate con leche.',
    price: 3000,
    tapa: 'chocolate',
    cobertura: 'leche',
  },
  {
    id: 6,
    name: 'Chocolate · Semiamargo',
    desc: 'Tapas de chocolate, relleno de dulce de leche, cobertura de chocolate semiamargo.',
    price: 3000,
    tapa: 'chocolate',
    cobertura: 'semi',
  },
];

export const BOX = {
  id: 'box',
  name: 'Caja × 8',
  desc: 'Ocho alfajores a elección. Combiná tapas y coberturas como quieras. Packaging incluido.',
  price: 20000,
  icon: '◻',
  capacity: 8,
};

export const WHATSAPP_NUMBER = '5491134687322';
export const BACKEND_URL = 'http://localhost:3001';
