/**
 * FlevoPay Gateway Live Integration
 * Endpoint: https://app.flevopay.com.br/api/v1/transaction
 * Secret Key: flevopay_sk_23468a8a78659d443a2257a1a32175b4988651b39c5c7ef2f5c41e1280b23f91
 * Product Hash: prod_5d8043a74c677999
 * Account ID: 10791
 */

const FLEVOPAY_CONFIG = {
  endpoint: 'https://app.flevopay.com.br/api/v1/transaction',
  apiKey: 'sk_c1a9352aad997014b44aafa2609fb65ad38ad96e025b770166cb545a92fb04d9',
  productHash: 'prod_10b3a75f467b0a11'
};

// In-Memory Transaction Storage
const transactions = new Map();

/**
 * Create Live Pix Transaction on FlevoPay
 */
export async function createFlevoPayPix({
  amount = 89.75,
  customer = {},
  description = 'Bicicleta Bike Elétrica V9 Max 1000W 48km Freio Hidráulico',
  tracking = {}
}) {
  const amountInCents = Math.round(Number(amount) * 100);
  const reference = `REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const customerName = (customer.nome || customer.name || 'Cliente TikTok Shop').trim();
  const customerEmail = (customer.email || 'comprador@tiktokshop.com.br').trim();
  const customerPhone = (customer.telefone || customer.phone || '11999999999').replace(/\D/g, '') || '11999999999';
  const customerDoc = (customer.cpf || customer.document || '01111111111').replace(/\D/g, '') || '01111111111';

  const payload = {
    amount: amountInCents,
    productHash: FLEVOPAY_CONFIG.productHash,
    description,
    reference,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone.length >= 10 ? customerPhone : '11999999999',
      document: customerDoc.length === 11 ? customerDoc : '01111111111'
    },
    tracking: {
      utm_source: tracking.utm_source || 'TikTok_Shop',
      utm_campaign: tracking.utm_campaign || 'Kit_4em1_Soarfly',
      utm_medium: tracking.utm_medium || 'feed',
      utm_content: tracking.utm_content || '',
      utm_term: tracking.utm_term || '',
      src: tracking.src || '',
      sck: tracking.sck || ''
    }
  };

  console.log(`[FlevoPay API] Enviando requisição para ${FLEVOPAY_CONFIG.endpoint}...`, {
    productHash: payload.productHash,
    amount: payload.amount,
    reference: payload.reference
  });

  const response = await fetch(FLEVOPAY_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'X-API-Key': FLEVOPAY_CONFIG.apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'TikTokShop-Integration/1.0'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log('[FlevoPay API Response]', { status: response.status, data });

  if (!response.ok || (data.status !== 'success' && !data.qr_code)) {
    throw new Error(data.error || data.message || `Erro FlevoPay Gateway (${response.status})`);
  }

  const pixCode = data.qr_code;
  const transactionId = data.transaction_id || data.id || reference;

  const transactionData = {
    id: transactionId,
    transaction_id: transactionId,
    reference: data.id || reference,
    status: data.payment_status || 'waiting_payment',
    payment_method: 'pix',
    gateway: 'FlevoPay',
    product_hash: FLEVOPAY_CONFIG.productHash,
    account_id: FLEVOPAY_CONFIG.accountId,
    amount: Number(amount),
    amount_cents: amountInCents,
    formatted_amount: `R$ ${Number(amount).toFixed(2).replace('.', ',')}`,
    pix_code: pixCode,
    qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
    acquirer: data.acquirer || 'FlevoPay',
    created_at: new Date().toISOString(),
    customer: payload.customer
  };

  transactions.set(transactionData.id, transactionData);
  transactions.set(transactionData.reference, transactionData);

  return transactionData;
}

export function getTransaction(idOrRef) {
  return transactions.get(idOrRef) || null;
}

export { FLEVOPAY_CONFIG };
