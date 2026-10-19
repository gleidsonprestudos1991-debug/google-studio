import React from 'react';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

interface SecurityBannerProps {
  onOpenFirebaseGuide: () => void;
}

export const SecurityBanner: React.FC<SecurityBannerProps> = ({ onOpenFirebaseGuide }) => {
  return (
    <aside aria-label="Aviso de Segurança" className="bg-amber-50/80 border-b border-amber-200/80 text-amber-950 py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-amber-200/70 flex items-center justify-center shrink-0 text-amber-800">
            <Lock className="w-3 h-3" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-900">Segurança Criptográfica Ativa:</strong> As senhas são protegidas com <strong>SHA-256 e sal exclusivo</strong> (sem armazenamento em texto puro). Esta versão de demonstração é educativa e não é adequada para proteger dados reais de clientes sem um backend autenticado ou Firebase Authentication.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenFirebaseGuide}
          className="inline-flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 shrink-0 transition-colors"
        >
          <span>Preparar Firebase</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
