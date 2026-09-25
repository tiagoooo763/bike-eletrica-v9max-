import React, { useState } from 'react';
import { CreditCard, ChevronRight } from 'lucide-react';
import { formatCurrency, calculateInstallments } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface InstallmentSelectorProps {
  price: number;
}

export const InstallmentSelector: React.FC<InstallmentSelectorProps> = ({ price }) => {
  const [isOpen, setIsOpen] = useState(false);
  const maxPlan = calculateInstallments(price, 12);

  // Generate installments from 1x to 12x
  const plans = Array.from({ length: 12 }, (_, i) => {
    const count = i + 1;
    const value = price / count;
    return {
      count,
      value,
      formatted: `${count}x de ${formatCurrency(value)}`,
      hasInterest: false,
    };
  });

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between py-2 px-3 bg-rose-50/60 hover:bg-rose-50 border border-rose-100 rounded-xl cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 text-xs">
          <CreditCard className="w-4 h-4 text-brand shrink-0" />
          <span className="font-bold text-slate-900">{maxPlan.formatted}</span>
          <span className="text-brand font-medium">com desconto de juros</span>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* Modal with detailed table */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Opções de Parcelamento">
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Parcele suas compras no cartão de crédito em até 12x sem juros na PulseShop:
          </p>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {plans.map((p) => (
              <div key={p.count} className="flex items-center justify-between p-2.5 text-xs">
                <span className="font-semibold text-slate-800">{p.formatted}</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Sem Juros
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400">
            * Aceitamos Visa, Mastercard, Elo, Hipercard e American Express.
          </p>
        </div>
      </Modal>
    </>
  );
};
