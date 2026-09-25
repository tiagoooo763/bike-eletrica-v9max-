export interface ShippingOptionInfo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  deadlineText: string;
  daysMin: number;
  daysMax: number;
  badge?: string;
}

export async function fetchCepAddress(cepClean: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
} | null> {
  const sanitized = cepClean.replace(/\D/g, '');
  if (sanitized.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch (e) {
    // Fallback simulation if offline or blocked
    return {
      street: 'Av. Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    };
  }
}

export function calculateShippingOptions(cep: string, itemPrice: number): ShippingOptionInfo[] {
  const sanitized = cep.replace(/\D/g, '');
  const isSudeste = sanitized.startsWith('0') || sanitized.startsWith('1') || sanitized.startsWith('2') || sanitized.startsWith('3');

  const standardOriginalPrice = isSudeste ? 23.90 : 29.90;
  const standardDiscountedPrice = 3.90; // Exatamente como na referência visual R$ 23,90 -> R$ 3,90

  return [
    {
      id: 'ship_standard',
      name: 'Entrega Padrão Social Commerce',
      price: standardDiscountedPrice,
      originalPrice: standardOriginalPrice,
      deadlineText: 'Receba entre 3 e 8 dias úteis',
      daysMin: 3,
      daysMax: 8,
      badge: 'Desconto de Frete Aplicado'
    },
    {
      id: 'ship_express',
      name: 'Entrega Expressa Pulse',
      price: 14.90,
      originalPrice: 34.90,
      deadlineText: 'Receba em até 48 horas',
      daysMin: 1,
      daysMax: 2,
      badge: 'Mais Rápido'
    }
  ];
}
