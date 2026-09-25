import express from 'express';
import cors from 'cors';
import { createFlevoPayPix, getTransaction, FLEVOPAY_CONFIG } from './services/flevopay.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// In-Memory Database initialized for REST API demonstration
const mockProducts = [
  {
    id: 'prod_10b3a75f467b0a11',
    slug: 'bicicleta-bike-eletrica-v9-max-1000w-48km-freio-hidraulico',
    name: 'Bicicleta Bike Eletrica V9 Max 1000w 48km Freio Hidraulico',
    price: 89.75,
    oldPrice: 899.90,
    discountPercentage: 90,
    rating: 4.9,
    reviewCount: 3400,
    salesCount: 8200,
    stock: 5,
    storeId: 'store_monster_e_bikes',
    categoryId: 'cat_ebikes',
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    gateway: 'FlevoPay',
    productHash: FLEVOPAY_CONFIG.productHash,
    timestamp: new Date() 
  });
});

// Products
app.get('/api/products', (req, res) => {
  const { q, category } = req.query;
  let results = mockProducts;

  if (q) {
    results = results.filter(p => p.name.toLowerCase().includes(String(q).toLowerCase()));
  }
  if (category) {
    results = results.filter(p => p.categoryId === category);
  }

  res.json(results);
});

// FlevoPay Gateway - Generate PIX
app.post('/api/flevopay/pix', async (req, res) => {
  try {
    const { amount = 89.75, customer, items, shippingAddress } = req.body;
    
    console.log(`[FlevoPay] Gerando PIX para Produto: ${FLEVOPAY_CONFIG.productId} | Conta: ${FLEVOPAY_CONFIG.accountId} | Valor: R$ ${amount}`);

    const transaction = await createFlevoPayPix({
      amount,
      customer,
      items,
      shippingAddress
    });

    res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('[FlevoPay Error]', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar PIX na FlevoPay gateway',
      details: error.message
    });
  }
});

// FlevoPay Gateway - Check Transaction Status
app.get('/api/flevopay/transaction/:id', (req, res) => {
  const transaction = getTransaction(req.params.id);
  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transação não encontrada' });
  }
  res.json({ success: true, transaction });
});

// Orders
app.post('/api/orders', (req, res) => {
  const order = req.body;
  const orderNumber = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
  res.status(201).json({ ...order, orderNumber, status: 'confirmed', createdAt: new Date() });
});

const server = app.listen(PORT, () => {
  console.log(`[PulseShop Server] API REST & FlevoPay Gateway online na porta ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = 5000;
    app.listen(fallbackPort, () => {
      console.log(`[PulseShop Server] Porta alternativa ativa em http://localhost:${fallbackPort}`);
    });
  }
});
