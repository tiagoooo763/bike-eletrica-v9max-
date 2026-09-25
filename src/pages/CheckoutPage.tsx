import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Star, 
  Zap, 
  CreditCard, 
  X,
  Plus
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { createFlevoPayPixTransaction } from '../services/flevopay';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'credit_card'>('pix');
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [isProductSubtotalExpanded, setIsProductSubtotalExpanded] = useState(true);

  // Address State (Loaded from localStorage or empty)
  const [customerAddress, setCustomerAddress] = useState<{
    nome?: string;
    telefone?: string;
    formattedStreet?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ttk_customer_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nome && (parsed.formattedStreet || parsed.endereco || parsed.cidade)) {
          setCustomerAddress({
            nome: parsed.nome,
            telefone: parsed.telefone,
            formattedStreet: parsed.formattedStreet || `${parsed.endereco || ''} ${parsed.numero || ''}, ${parsed.bairro || ''}, ${parsed.cidade || ''} - ${parsed.estado || ''}`
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Offer Countdown (4h 2m 50s)
  const [offerCountdown, setOfferCountdown] = useState({ hours: 4, minutes: 2, seconds: 50 });
  // Coupon Expiry Countdown (21m 50s)
  const [couponCountdown, setCouponCountdown] = useState({ minutes: 21, seconds: 50 });

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
      setCouponCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatOfferTime = () => {
    const h = String(offerCountdown.hours).padStart(2, '0');
    const m = String(offerCountdown.minutes).padStart(2, '0');
    const s = String(offerCountdown.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatCouponTime = () => {
    const m = String(couponCountdown.minutes).padStart(2, '0');
    const s = String(couponCountdown.seconds).padStart(2, '0');
    return `00:${m}:${s}`;
  };

  // Prices calculation
  const unitPrice = 89.75;
  const originalUnitPrice = 899.90;
  const shippingFee = 0.00;
  const shippingDiscount = 0.00;
  const finalShipping = 0.00;

  const productSubtotal = unitPrice * quantity;
  const productOriginalSubtotal = originalUnitPrice * quantity;
  const productDiscount = productOriginalSubtotal - productSubtotal;
  
  const total = (productSubtotal + finalShipping).toFixed(2).replace('.', ',');

  const handleCardClick = () => {
    addToast({
      type: 'info',
      message: 'Pagamento com cartão indisponível no momento. Utilize o Pix para desconto e aprovação imediata.'
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerAddress || !customerAddress.nome) {
      addToast({
        type: 'info',
        message: 'Por favor, adicione seu endereço de envio antes de continuar.'
      });
      navigate('/endereco');
      return;
    }

    try {
      setIsGeneratingPix(true);
      await createFlevoPayPixTransaction({
        amount: productSubtotal + finalShipping,
        customer: customerAddress,
        shippingAddress: customerAddress,
        items: [
          {
            id: 'prod_10b3a75f467b0a11',
            title: 'Bicicleta Bike Elétrica V9 Max 1000W 48km Freio Hidráulico',
            unit_price: Math.round((productSubtotal + finalShipping) * 100),
            quantity
          }
        ]
      });

      navigate('/codigo-pagamento');
    } catch (error) {
      navigate('/codigo-pagamento');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#e5e5e7] flex justify-center selection:bg-[#fe2c55]/20">
      {/* Mobile container max-w-[440px] */}
      <div className="relative min-h-screen w-full max-w-[440px] bg-[#f5f5f5] pb-[130px] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#f0f0f0]">
          <div className="relative flex h-11 items-center px-3">
            <button 
              onClick={() => navigate(-1)} 
              className="grid h-9 w-9 place-items-center -ml-1 text-[#161823] active:opacity-70"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-[22px] w-[22px]" />
            </button>
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-[14px] font-semibold text-[#161823]">
              <Star className="h-[13px] w-[13px] fill-[#f2b900] text-[#f2b900]" />
              <span>Ótima avaliação! 4.9/5,0</span>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        {customerAddress && customerAddress.nome ? (
          <div 
            onClick={() => navigate('/endereco')}
            className="block bg-white px-4 py-3.5 cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#161823] shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1 text-[14px] font-bold text-[#161823]">
                    <span>{customerAddress.nome}, {customerAddress.telefone}</span>
                  </div>
                  <div className="mt-1 text-[12.5px] text-[#5a5b60] leading-snug">
                    {customerAddress.formattedStreet}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#c8c8cc] shrink-0 mt-1" />
            </div>
          </div>
        ) : (
          <div 
            onClick={() => navigate('/endereco')}
            className="block bg-white px-4 py-3.5 cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-[18px] w-[18px] text-[#161823]" />
                <span className="text-[15px] font-bold text-[#161823]">Endereço de envio</span>
              </div>
              <div className="flex items-center gap-0.5 text-[14px] font-semibold text-[#fe2c55]">
                <span className="text-[16px] leading-none">+</span>
                <span>Adicionar endereço</span>
              </div>
            </div>
          </div>
        )}

        {/* TikTok Colored Ribbon Divider */}
        <div className="h-[4px] overflow-hidden bg-white" aria-hidden="true">
          <svg width="100%" height="4" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tt-ribbon" x="0" y="0" width="64" height="4" patternUnits="userSpaceOnUse">
                <rect x="2" y="0.75" width="26" height="2.5" rx="0.5" fill="#25f4ee" transform="skewX(-20)" />
                <rect x="34" y="0.75" width="26" height="2.5" rx="0.5" fill="#fe2c55" transform="skewX(-20)" />
              </pattern>
            </defs>
            <rect width="100%" height="4" fill="url(#tt-ribbon)" />
          </svg>
        </div>

        {/* Store & Product Section */}
        <div className="mt-2 bg-white px-4 pt-3 pb-3">
          {/* Store title */}
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold text-[#161823]">Monster E Bikes</div>
            <button 
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center gap-0.5 text-[12px] text-[#8a8b91] hover:text-[#161823]"
            >
              <span>{orderNote ? 'Editar nota' : 'Adicionar nota'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Product Details Row */}
          <div className="mt-3 flex items-start gap-2.5">
            <img 
              src="/images/v9max/bike_1.webp" 
              alt="Bicicleta Elétrica V9 Max" 
              className="h-[80px] w-[80px] shrink-0 rounded-md object-cover border border-neutral-100"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-[#161823]">
                Bicicleta Bike Eletrica V9 Max 1000w 48km Freio Hidraulico
              </div>

              {/* Flash offer pill */}
              <div className="mt-1 flex items-center gap-1">
                <div className="inline-flex items-center gap-1 bg-[#fe2c55] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  <Zap className="h-2.5 w-2.5 fill-white" />
                  <span>Oferta Relâmpago</span>
                </div>
                <div className="bg-[#fff0f3] text-[#fe2c55] text-[9px] font-bold px-1.5 py-0.5 rounded tabular-nums">
                  {formatOfferTime()}
                </div>
              </div>

              {/* Free return badge */}
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 bg-[#f7f7f7] text-[#333333] text-[9px] font-bold px-1.5 py-0.5 rounded">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[7px]">✓</span>
                  Devolução gratuita
                </span>
              </div>

              {/* Price & Quantity Selector */}
              <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-extrabold text-[#fe2c55] leading-none">
                      R$ {unitPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="border border-[#fe2c55] text-[#fe2c55] text-[8px] font-bold px-0.5 rounded">
                      🎟
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8a8b91]">
                    <span className="line-through">R$ {originalUnitPrice.toFixed(2).replace('.', ',')}</span>
                    <span className="text-[#fe2c55] bg-[#ffe9ec] px-1 rounded text-[10px] font-semibold">-73%</span>
                  </div>
                </div>

                {/* Counter buttons */}
                <div className="flex items-center rounded bg-[#f1f1f2] border border-[#e5e5e7]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-6 w-6 items-center justify-center text-[15px] font-bold text-[#161823] disabled:opacity-30"
                    disabled={quantity <= 1}
                    aria-label="Diminuir"
                  >
                    −
                  </button>
                  <span className="flex h-6 w-7 items-center justify-center text-[12px] font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center text-[15px] font-bold text-[#161823]"
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery notice strip */}
          <div className="mt-3 flex items-center justify-between rounded-md bg-[#e7f7f5] px-2.5 py-1.5 text-[11.5px]">
            <span className="text-[#161823] font-medium">Receba até 3–8 de set</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#8a8b91] line-through">R$ 12,00</span>
              <b className="text-[#00b8a9] font-extrabold">Frete grátis</b>
              <span className="text-[#00b8a9] text-[10px]">🚚</span>
            </div>
          </div>
        </div>

        {/* TikTok Shop Discount Row */}
        <div className="mt-2 flex w-full items-center justify-between bg-white px-4 py-2.5 text-left">
          <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#161823]">
            <span className="text-[#d81d57] text-[14px]">🎟</span>
            <span>Desconto do TikTok Shop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-end gap-0.5">
              <span className="rounded bg-[#e7f7f5] px-1.5 py-0.5 text-[10px] font-semibold text-[#00b8a9]">
                - R$ 20,00
              </span>
              <span className="rounded bg-[#ffe9ec] px-1.5 py-0.5 text-[10px] font-semibold text-[#fe2c55]">
                - R$ 5,00
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#c8c8cc]" />
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="mt-2 bg-white px-4 py-3">
          <div className="text-[14px] font-semibold text-[#161823]">Resumo do pedido</div>
          
          <div className="mt-3 space-y-2 text-[13px]">
            <div 
              onClick={() => setIsProductSubtotalExpanded(!isProductSubtotalExpanded)}
              className="flex w-full items-center justify-between font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-1">
                Subtotal do produto
                <ChevronRight className={`h-3.5 w-3.5 text-[#8a8b91] transition-transform ${isProductSubtotalExpanded ? 'rotate-90' : ''}`} />
              </span>
              <span>R$ {(unitPrice * quantity).toFixed(2).replace('.', ',')}</span>
            </div>

            {isProductSubtotalExpanded && (
              <>
                <div className="flex items-center justify-between pl-3 text-[12.5px]">
                  <span className="text-[#5a5b60]">Preço original</span>
                  <span>R$ {(originalUnitPrice * quantity).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex items-center justify-between pl-3 text-[12.5px]">
                  <span className="text-[#5a5b60]">Desconto no produto</span>
                  <span className="text-[#fe2c55]">- R$ {(productDiscount).toFixed(2).replace('.', ',')}</span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pl-3 text-[12.5px] pt-1">
              <span className="text-[#5a5b60]">Taxa de envio</span>
              <span>R$ 23,90</span>
            </div>
            <div className="flex items-center justify-between pl-3 text-[12.5px]">
              <span className="text-[#5a5b60]">Desconto de envio</span>
              <span className="text-[#fe2c55]">- R$ 20,00</span>
            </div>
          </div>

          <div className="my-3 h-px bg-[#f0f0f0]" />

          <div className="flex items-start justify-between">
            <div className="text-[15px] font-bold text-[#161823]">Total</div>
            <div className="text-right">
              <div className="text-[17px] font-bold text-[#161823]">R$ {total}</div>
              <div className="text-[11px] text-[#8a8b91]">Impostos inclusos</div>
            </div>
          </div>
        </div>

        {/* Forma de Pagamento Section */}
        <div className="mt-2 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold text-[#161823]">Forma de pagamento</div>
            <button 
              onClick={() => setIsPaymentSheetOpen(true)}
              className="flex items-center gap-0.5 text-[12px] text-[#8a8b91] hover:text-[#161823]"
            >
              <span>Ver todos</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Option 1: Credit Card (Disabled / Non-functional) */}
          <div 
            onClick={handleCardClick}
            className="mt-3 flex items-start justify-between text-left cursor-pointer border-b border-[#f5f5f5] pb-3 opacity-60"
          >
            <div className="flex items-start gap-2.5 flex-1">
              <div className="mt-0.5 text-neutral-400 font-bold text-[18px] leading-none">+</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium text-neutral-600">Cartão de crédito</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">Indisponível</span>
                </div>
                {/* Discount pill */}
                <div className="mt-1 flex items-center gap-1 bg-neutral-100 text-neutral-500 text-[10px] font-medium px-2 py-0.5 rounded-full w-fit">
                  <span>Desconto de 13% na taxa de juros para parcelamento e...</span>
                </div>
                {/* Card Brands Icons */}
                <div className="mt-1.5 flex items-center gap-2 grayscale">
                  <div className="h-4 w-6 rounded bg-[#eb001b] flex items-center justify-center text-[7px] text-white font-bold">MC</div>
                  <div className="h-4 w-6 rounded bg-[#1a1f71] flex items-center justify-center text-[7px] text-white font-bold">VISA</div>
                  <div className="h-4 w-6 rounded bg-[#00a4e4] flex items-center justify-center text-[7px] text-white font-bold">ELO</div>
                  <div className="h-4 w-6 rounded bg-[#006fcf] flex items-center justify-center text-[7px] text-white font-bold">AMEX</div>
                </div>
                <div className="mt-1 text-[11px] text-[#8a8b91]">Pague em até 12 parcelas</div>
              </div>
            </div>
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-[#e5e5e7] bg-neutral-100" />
          </div>

          {/* Option 2: Pix (Active & Selected) */}
          <div 
            onClick={() => setSelectedPayment('pix')}
            className="mt-3 flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-5 rounded bg-[#32bcad] flex items-center justify-center text-white text-[9px] font-bold">
                ❖
              </div>
              <div>
                <span className="text-[13.5px] font-medium text-[#161823]">Pix</span>
                <div className="text-[11px] text-[#8a8b91]">Aprovação imediata · Desconto aplicado</div>
              </div>
            </div>
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-[#fe2c55] bg-[#fe2c55]">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
        </div>

        {/* Terms and Privacy Policy Note */}
        <div className="mt-3 px-4 py-2 text-[11px] leading-relaxed text-[#5a5b60]">
          Ao fazer um pedido, você concorda com{' '}
          <span className="font-semibold text-[#161823]">Termos de uso e venda do TikTok Shop</span> e reconhece que leu e concordou com a{' '}
          <span className="font-semibold text-[#161823]">Política de privacidade do TikTok</span>.
        </div>

        {/* Bottom Fixed Bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] bg-white pb-[max(env(safe-area-inset-bottom),6px)] shadow-[0_-1px_0_rgba(0,0,0,0.06)]">
          {/* Savings strip banner */}
          <div className="flex items-center gap-1.5 bg-[#fff0f3] px-4 py-1 text-[11.5px] font-semibold text-[#fe2c55] whitespace-nowrap">
            <span>😊</span>
            <span className="truncate">Você está economizando R$ 220,01 nesse pedido.</span>
          </div>

          {/* Total Row */}
          <div className="flex items-center justify-between px-4 pt-1.5">
            <div className="text-[14px] font-bold text-[#161823]">Total ({quantity} item)</div>
            <div className="text-[17px] font-extrabold text-[#fe2c55]">R$ {total}</div>
          </div>

          {/* Place Order CTA Button */}
          <div className="px-4 pt-1">
            <button
              disabled={isGeneratingPix}
              onClick={handlePlaceOrder}
              className={`relative w-full rounded-full py-2 text-center text-white font-bold transition active:scale-[0.99] ${isGeneratingPix ? 'bg-[#fe2c55]/80 cursor-wait' : 'bg-[#fe2c55] hover:bg-[#e0264b]'}`}
            >
              <div className="text-[15px] leading-tight flex items-center justify-center gap-2">
                {isGeneratingPix ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gerando Pix seguro...</span>
                  </>
                ) : (
                  <span>Fazer pedido</span>
                )}
              </div>
              {!isGeneratingPix && (
                <div className="mt-0.5 text-[10.5px] font-semibold leading-tight opacity-95">
                  O cupom expira em {formatCouponTime()}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* PAYMENT SELECTION BOTTOM SHEET MODAL */}
        {isPaymentSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-[440px] rounded-t-2xl bg-white p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-[16px] text-[#161823]">Forma de pagamento</h3>
                <button onClick={() => setIsPaymentSheetOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Payment Methods List inside sheet */}
              <div className="mt-4 space-y-4">
                {/* Credit Card (Disabled) */}
                <div 
                  onClick={handleCardClick}
                  className="flex items-start justify-between cursor-pointer border-b pb-3 opacity-60"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-neutral-400 font-bold text-[18px]">+</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-neutral-600">Cartão de crédito</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">Indisponível</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 bg-neutral-100 text-neutral-500 text-[10px] font-medium px-2 py-0.5 rounded-full w-fit">
                        <span>Desconto de 13% na taxa de juros para parcelamento e...</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 grayscale">
                        <div className="h-4 w-6 rounded bg-[#eb001b] flex items-center justify-center text-[7px] text-white font-bold">MC</div>
                        <div className="h-4 w-6 rounded bg-[#1a1f71] flex items-center justify-center text-[7px] text-white font-bold">VISA</div>
                        <div className="h-4 w-6 rounded bg-[#00a4e4] flex items-center justify-center text-[7px] text-white font-bold">ELO</div>
                        <div className="h-4 w-6 rounded bg-[#006fcf] flex items-center justify-center text-[7px] text-white font-bold">AMEX</div>
                      </div>
                      <div className="mt-1 text-[11px] text-[#8a8b91]">Pague em até 12 parcelas</div>
                    </div>
                  </div>
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-[#e5e5e7] bg-neutral-100" />
                </div>

                {/* Pix */}
                <div 
                  onClick={() => {
                    setSelectedPayment('pix');
                    setIsPaymentSheetOpen(false);
                  }}
                  className="flex items-center justify-between cursor-pointer pb-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded bg-[#32bcad] flex items-center justify-center text-white text-[9px] font-bold">❖</div>
                    <div>
                      <span className="text-[14px] font-semibold text-[#161823]">Pix</span>
                      <div className="text-[11px] text-[#8a8b91]">Aprovação imediata</div>
                    </div>
                  </div>
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-[#fe2c55] bg-[#fe2c55]">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* Sheet Bottom Footer */}
              <div className="mt-6 border-t pt-3">
                <div className="flex items-center justify-between pb-3">
                  <div className="text-[14px] font-bold text-[#161823]">Total (1 item)</div>
                  <div className="text-[17px] font-extrabold text-[#fe2c55]">R$ {total}</div>
                </div>
                <button
                  onClick={() => {
                    setIsPaymentSheetOpen(false);
                    handlePlaceOrder();
                  }}
                  className="w-full rounded-full bg-[#fe2c55] py-3 text-white font-bold text-[15px] shadow-sm hover:bg-[#e0264b]"
                >
                  Pagar agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDER NOTE MODAL */}
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-[400px] rounded-2xl bg-white p-5">
              <h3 className="text-[16px] font-bold text-[#161823]">Nota para o vendedor</h3>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Ex: Entregar na portaria, campainha estragada, etc."
                className="mt-3 w-full rounded-lg border border-neutral-200 p-3 text-[13px] outline-none focus:border-[#fe2c55]"
                rows={3}
              />
              <div className="mt-4 flex gap-2 justify-end">
                <button 
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 text-[13px] text-neutral-600 font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#fe2c55] text-white text-[13px] font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default CheckoutPage;
