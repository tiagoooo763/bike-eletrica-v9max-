const FLEVOPAY_CONFIG = {
  endpoint: 'https://app.flevopay.com.br/api/v1/transaction',
  apiKey: 'sk_c1a9352aad997014b44aafa2609fb65ad38ad96e025b770166cb545a92fb04d9',
  productHash: 'prod_10b3a75f467b0a11'
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount = 89.75, customer = {}, description, tracking = {} } = req.body || {};
    const amountInCents = Math.round(Number(amount) * 100);
    const reference = `REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const customerName = (customer.nome || customer.name || 'Cliente TikTok Shop').trim();
    const customerEmail = (customer.email || 'comprador@tiktokshop.com.br').trim();
    const customerPhone = (customer.telefone || customer.phone || '11999999999').replace(/\D/g, '') || '11999999999';
    const customerDoc = (customer.cpf || customer.document || '01111111111').replace(/\D/g, '') || '01111111111';

    const payload = {
      amount: amountInCents,
      productHash: FLEVOPAY_CONFIG.productHash,
      description: description || 'Bicicleta Bike Elétrica V9 Max 1000W 48km Freio Hidráulico',
      reference,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        document: customerDoc
      },
      tracking: {
        utm_source: tracking.utm_source || 'TikTok_Shop',
        utm_medium: tracking.utm_medium || 'feed',
        utm_campaign: tracking.utm_campaign || 'v9max',
        ...tracking
      }
    };

    console.log('[Vercel API FlevoPay] Enviando payload para:', FLEVOPAY_CONFIG.endpoint);

    const response = await fetch(FLEVOPAY_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'X-API-Key': FLEVOPAY_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('[Vercel API FlevoPay] Resposta da API:', response.status, data);

    if (data && (data.qr_code || data.pix_code || data.pix)) {
      const pixCode = data.qr_code || data.pix_code || data.pix;
      const txId = data.transaction_id || data.id || reference;

      const transaction = {
        id: txId,
        transaction_id: txId,
        reference: data.id || reference,
        status: data.payment_status || 'waiting_payment',
        payment_method: 'pix',
        gateway: 'FlevoPay',
        product_hash: FLEVOPAY_CONFIG.productHash,
        amount: Number(amount),
        amount_cents: amountInCents,
        formatted_amount: `R$ ${Number(amount).toFixed(2).replace('.', ',')}`,
        pix_code: pixCode,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
        acquirer: data.acquirer || 'TenantBank',
        created_at: new Date().toISOString(),
        customer: payload.customer
      };

      return res.status(200).json({
        success: true,
        transaction
      });
    }

    return res.status(response.status || 400).json({
      success: false,
      error: data.message || 'Erro ao gerar Pix na FlevoPay',
      details: data
    });
  } catch (error) {
    console.error('[Vercel API FlevoPay] Erro interno:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno no servidor'
    });
  }
}
