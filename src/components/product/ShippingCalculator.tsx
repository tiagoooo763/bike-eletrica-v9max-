import React, { useState } from 'react';
import { Truck, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateShippingOptions, fetchCepAddress, ShippingOptionInfo } from '../../utils/cep';

interface ShippingCalculatorProps {
  price: number;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ price }) => {
  const [cep, setCep] = useState('01310-100'); // default SP demo
  const [cityInfo, setCityInfo] = useState<string>('São Paulo - SP');
  const [options, setOptions] = useState<ShippingOptionInfo[]>(() => calculateShippingOptions('01310-100', price));
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(true);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length > 5) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`;
    }
    setCep(val);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length === 8) {
      setIsLoading(true);
      const addr = await fetchCepAddress(cep);
      if (addr && addr.city) {
        setCityInfo(`${addr.city} - ${addr.state}`);
      } else {
        setCityInfo('Endereço localizado');
      }
      setOptions(calculateShippingOptions(cep, price));
      setIsLoading(false);
      setIsCalculated(true);
    }
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
      {/* Title & Delivery Time Preview Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              Receba até 3–8 de set
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Taxa de envio:</span>
              <span className="line-through text-slate-400 font-medium">R$ 23,90</span>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded text-[11px]">
                R$ 3,90
              </span>
            </div>
          </div>
        </div>

        {cityInfo && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[110px]">{cityInfo}</span>
          </div>
        )}
      </div>

      {/* CEP Form */}
      <form onSubmit={handleCalculate} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            placeholder="Digite seu CEP (ex: 01310-100)"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || cep.replace(/\D/g, '').length !== 8}
          className="bg-slate-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {isLoading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      {/* Detailed shipping options */}
      {isCalculated && (
        <div className="space-y-1.5 pt-1">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">{opt.name}</span>
                  <p className="text-[10px] text-slate-500">{opt.deadlineText}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-slate-900">{formatCurrency(opt.price)}</span>
                {opt.originalPrice && (
                  <p className="text-[10px] text-slate-400 line-through">
                    {formatCurrency(opt.originalPrice)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
