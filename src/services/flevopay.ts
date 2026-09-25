/**
 * FlevoPay Gateway Client Service
 * Live Endpoint: https://app.flevopay.com.br/api/v1/transaction
 * API Key: flevopay_sk_23468a8a78659d443a2257a1a32175b4988651b39c5c7ef2f5c41e1280b23f91
 * Product Hash: prod_5d8043a74c677999
 * Account ID: 10791
 */

export interface FlevoPayTransaction {
  id: string;
  transaction_id: string;
  reference: string;
  status: string;
  gateway: 'FlevoPay';
  product_hash: string;
  account_id?: string;
  amount: number;
  formatted_amount: string;
  pix_code: string;
  qr_code_url: string;
  created_at: string;
  acquirer?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
  };
}

export const FLEVOPAY_CONFIG = {
  endpoint: 'https://app.flevopay.com.br/api/v1/transaction',
  apiKey: 'sk_c1a9352aad997014b44aafa2609fb65ad38ad96e025b770166cb545a92fb04d9',
  productHash: 'prod_10b3a75f467b0a11'
};

export async function createFlevoPayPixTransaction(params: {
  amount?: number;
  customer?: any;
  shippingAddress?: any;
  items?: any[];
}): Promise<FlevoPayTransaction> {
  const { amount = 89.75, customer = {} } = params;
  const amountInCents = Math.round(Number(amount) * 100);
  const reference = `REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Try via Vercel Serverless / Backend proxy on /api/flevopay/pix
  try {
    const res = await fetch('/api/flevopay/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        customer,
        shippingAddress: params.shippingAddress
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.transaction && data.transaction.pix_code) {
        localStorage.setItem('ttk_current_pix', JSON.stringify(data.transaction));
        return data.transaction;
      }
    }
  } catch (err) {
    console.warn('Backend proxy error, trying direct FlevoPay call...', err);
  }

  // 2. Direct call to FlevoPay API
  const customerName = (customer.nome || customer.name || 'Cliente TikTok Shop').trim();
  const customerEmail = (customer.email || 'comprador@tiktokshop.com.br').trim();
  const customerPhone = (customer.telefone || customer.phone || '11999999999').replace(/\D/g, '') || '11999999999';
  const customerDoc = (customer.cpf || customer.document || '01111111111').replace(/\D/g, '') || '01111111111';

  const payload = {
    amount: amountInCents,
    productHash: FLEVOPAY_CONFIG.productHash,
    description: 'Bicicleta Bike Elétrica V9 Max 1000W 48km Freio Hidráulico',
    reference,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone.length >= 10 ? customerPhone : '11999999999',
      document: customerDoc.length === 11 ? customerDoc : '01111111111'
    },
    tracking: {
      utm_source: 'TikTok_Shop',
      utm_campaign: 'Kit_4em1_Soarfly',
      utm_medium: 'feed'
    }
  };

  try {
    const response = await fetch(FLEVOPAY_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'X-API-Key': FLEVOPAY_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data && data.qr_code) {
      const transaction: FlevoPayTransaction = {
        id: data.transaction_id || data.id || reference,
        transaction_id: data.transaction_id || reference,
        reference: data.id || reference,
        status: data.payment_status || 'waiting_payment',
        gateway: 'FlevoPay',
        product_hash: FLEVOPAY_CONFIG.productHash,
        amount: Number(amount),
        formatted_amount: `R$ ${Number(amount).toFixed(2).replace('.', ',')}`,
        pix_code: data.qr_code,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.qr_code)}`,
        acquirer: data.acquirer || 'FlevoPay',
        created_at: new Date().toISOString(),
        customer: payload.customer
      };

      localStorage.setItem('ttk_current_pix', JSON.stringify(transaction));
      return transaction;
    }
  } catch (directErr) {
    console.error('Direct FlevoPay call failed', directErr);
  }

  throw new Error('Não foi possível conectar com a Gateway FlevoPay');
}
