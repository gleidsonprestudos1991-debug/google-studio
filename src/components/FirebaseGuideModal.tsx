import React, { useState } from 'react';
import { X, Flame, Shield, Check, Copy, Code, ArrowRight } from 'lucide-react';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const firebaseSnippet = `// Exemplo de integração com Firebase Auth (firebase.ts)
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Login seguro com Firebase
export async function loginWithFirebase(email: string, pass: string) {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

// Cadastro seguro com Firebase
export async function registerWithFirebase(email: string, pass: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  return cred.user;
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(firebaseSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="firebase-modal-title"
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 id="firebase-modal-title" className="text-lg font-bold text-slate-900">Integração com Firebase Authentication</h2>
              <p className="text-xs text-slate-500">Arquitetura de Segurança e Preparação para Produção</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Comparison card */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-2 text-slate-900 font-semibold text-xs">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Modo Local Atual (Demonstrativo)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Senhas com <strong>SHA-256 + Sal criptográfico</strong></li>
                <li>Zero senhas armazenadas em texto puro</li>
                <li>Ideal para testes rápidos, provas de conceito e validação de UI</li>
                <li className="text-amber-800 font-medium">Não adequado para dados sensíveis de produção em escala</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-2 mb-2 text-amber-950 font-semibold text-xs">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Com Firebase Authentication</span>
              </div>
              <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc pl-4">
                <li>Algoritmo Scrypt / Argon2 gerenciado pelo Google</li>
                <li>Recuperação de senha por e-mail nativa</li>
                <li>Autenticação multifator (2FA) e OAuth (Google, GitHub)</li>
                <li>Tokens JWT com revogação e rotação automática</li>
              </ul>
            </div>
          </div>

          {/* Integration Steps */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Como Ativar o Firebase no Projeto
            </h3>
            <ol className="space-y-2 text-xs text-slate-700 list-decimal pl-4">
              <li>
                <strong>Instalar o SDK oficial:</strong> <code>npm install firebase</code>
              </li>
              <li>
                <strong>Obter credenciais:</strong> No Firebase Console, crie um projeto e habilite o <em>Authentication</em> (Provedor E-mail/Senha).
              </li>
              <li>
                <strong>Configurar variáveis de ambiente:</strong> Defina no arquivo <code>.env</code> as chaves <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code>, etc.
              </li>
              <li>
                <strong>Substituir o backend mock:</strong> Conecte as funções de login e cadastro ao <code>signInWithEmailAndPassword</code> do SDK.
              </li>
            </ol>
          </div>

          {/* Ready-to-use Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-500" />
                Arquivo de Conexão Preparado
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar código</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-100 text-xs font-mono rounded-xl overflow-x-auto selection:bg-amber-500/30">
              {firebaseSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Pronto para migração futura sem reescrever a interface</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
