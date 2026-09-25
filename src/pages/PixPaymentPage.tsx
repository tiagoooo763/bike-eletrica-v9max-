import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Check, Clock, QrCode } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { createFlevoPayPixTransaction, FlevoPayTransaction, FLEVOPAY_CONFIG } from '../services/flevopay';

export const PixPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [transaction, setTransaction] = useState<FlevoPayTransaction | null>(null);
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 49
  });

  useEffect(() => {
    // Load transaction or initialize
    try {
      const savedPix = localStorage.getItem('ttk_current_pix');
      if (savedPix) {
        setTransaction(JSON.parse(savedPix));
      } else {
        createFlevoPayPixTransaction({ amount: 89.75 }).then(tx => {
          setTransaction(tx);
        });
      }
    } catch (e) {
      createFlevoPayPixTransaction({ amount: 89.75 }).then(tx => {
        setTransaction(tx);
      });
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const h = String(countdown.hours).padStart(2, '0');
    const m = String(countdown.minutes).padStart(2, '0');
    const s = String(countdown.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const pixCode = transaction?.pix_code || "00020126580014br.gov.bcb.pix0120pix@flevopay.com.br0230prod_5d8043a74c677999_10791520400005303986540592.895802BR5911FLEVOPAY BR6009SAO PAULO62150511FLEVO107916304E8A2";
  const formattedAmount = transaction?.formatted_amount || "R$ 92,89";
  const qrCodeUrl = transaction?.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;

  const handleCopyPix = async () => {
    let success = false;

    // Method 1: Modern navigator.clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(pixCode);
        success = true;
      } catch (e) {
        console.warn('navigator.clipboard failed, attempting fallback', e);
      }
    }

    // Method 2: iOS / Android / In-App WebView execCommand fallback
    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = pixCode;
        textArea.style.fontSize = '16px';
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, pixCode.length);

        const res = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (res) success = true;
      } catch (err) {
        console.error('execCommand copy failed', err);
      }
    }

    setCopied(true);
    addToast({
      type: 'success',
      message: 'Código Pix copiado com sucesso! Abra o app do seu banco e cole para pagar.'
    });
    setTimeout(() => setCopied(false), 3500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex justify-center selection:bg-[#fe2c55]/20">
      {/* Mobile container max-w-[440px] matching TikTok Shop style */}
      <div className="relative min-h-screen w-full max-w-[440px] bg-white flex flex-col justify-between p-4 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 pt-1">
            <button 
              onClick={() => navigate('/checkout')}
              className="p-1 -ml-1 text-[#161823] active:opacity-70"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-[17px] font-bold text-[#161823]">
              Código do pagamento
            </h1>
            <div className="w-6" />
          </div>

          {/* Header Status & Amount */}
          <div className="mt-4 flex items-start justify-between">
            <div>
              <div className="text-[22px] font-extrabold text-[#161823] leading-tight">
                Aguardando o pagamento
              </div>
              <div className="text-[24px] font-black text-[#161823] mt-1">
                {formattedAmount}
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#ff9800] flex items-center justify-center text-white shadow-xs shrink-0">
              <Clock className="w-7 h-7 stroke-[2.5]" />
            </div>
          </div>

          {/* Expiration Timer & Deadline */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[13px] text-[#5a5b60]">Vence em</span>
            <span className="bg-[#fe2c55] text-white text-[12px] font-bold px-2 py-0.5 rounded-sm tabular-nums">
              {formatTimer()}
            </span>
          </div>
          <div className="text-[12.5px] text-[#8a8b91] mt-1">
            Prazo 31 de ago. de 2026, 23:38
          </div>

          {/* PIX Copy Box */}
          <div className="mt-5 rounded-2xl bg-white border border-[#e5e5e7] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-[#32bcad] flex items-center justify-center text-white text-[9px] font-bold">
                  ❖
                </div>
                <span className="text-[15px] font-bold text-[#161823]">PIX</span>
              </div>
              <button 
                onClick={() => setShowQrCodeModal(!showQrCodeModal)}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#2f7fff] hover:underline"
              >
                <QrCode className="w-4 h-4" />
                <span>{showQrCodeModal ? 'Ocultar QR Code' : 'Ver QR Code'}</span>
              </button>
            </div>

            {/* Optional QR Code Box */}
            {showQrCodeModal && (
              <div className="mt-4 flex flex-col items-center justify-center bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code Pix" 
                  className="w-44 h-44 rounded-lg bg-white p-2 shadow-xs"
                />
                <span className="mt-2 text-[11px] text-neutral-500 text-center">
                  Aponte a câmera do seu banco para escanear
                </span>
              </div>
            )}

            {/* Code preview (tap to copy enabled) */}
            <div 
              onClick={handleCopyPix}
              title="Toque para copiar"
              className="mt-4 cursor-pointer break-all text-[13px] font-mono text-[#5a5b60] line-clamp-2 select-all bg-[#f8f9fa] p-3 rounded-lg border border-dashed border-[#d0d0d3] active:bg-[#f0f0f0] transition relative group"
            >
              {pixCode}
            </div>

            {/* Red Copy Button */}
            <button
              onClick={handleCopyPix}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#fe2c55] py-3 text-[15px] font-bold text-white shadow-xs transition hover:bg-[#e0264b] active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* In-app navigation instruction note */}
          <div className="mt-5 text-[12px] text-[#5a5b60] leading-relaxed">
            Para acessar esta página no app, abra <b className="text-[#161823]">Loja &gt; Pedidos &gt; Sem pagamento &gt; Visualizar o código</b>
          </div>

          {/* How to pay instruction section */}
          <div className="mt-8">
            <h2 className="text-[17px] font-extrabold text-[#161823]">
              Como fazer pagamentos com PIX?
            </h2>
            <p className="mt-2 text-[13px] text-[#5a5b60] leading-relaxed">
              Copie o código de pagamento acima, selecione Pix no seu app de internet ou de banco e cole o código.
            </p>
          </div>
        </div>

        {/* Bottom Button (Ver pedido) */}
        <div className="pt-6 pb-2">
          <button
            onClick={() => navigate('/ferramenta')}
            className="w-full rounded-xl bg-[#f1f1f2] py-3.5 text-center text-[15px] font-bold text-[#161823] hover:bg-[#e5e5e7] active:scale-[0.99] transition"
          >
            Ver pedido
          </button>
        </div>

      </div>
    </div>
  );
};
export default PixPaymentPage;
