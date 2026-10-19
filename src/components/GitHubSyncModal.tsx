import React, { useState } from 'react';
import { X, Check, Copy, Github, Terminal, ArrowRight, ShieldCheck, GitBranch } from 'lucide-react';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/gleidsonprestudos1991-debug/google-studio.git';
  const repoWebUrl = 'https://github.com/gleidsonprestudos1991-debug/google-studio';

  const steps = [
    {
      title: '1. Inicializar o repositório Git local',
      desc: 'Cria o repositório local sem alterar os arquivos do seu aplicativo.',
      command: 'git init',
    },
    {
      title: '2. Vincular ao seu repositório existente',
      desc: 'Configura a origem remota para o repositório existente indicado no projeto.',
      command: `git remote add origin ${repoUrl}`,
    },
    {
      title: '3. Definir branch principal como main',
      desc: 'Garante compatibilidade com o padrão do GitHub.',
      command: 'git branch -M main',
    },
    {
      title: '4. Adicionar todos os arquivos do projeto',
      desc: 'Inclui componentes, estilos, tipos e configurações respeitando o .gitignore.',
      command: 'git add .',
    },
    {
      title: '5. Registrar o commit das alterações',
      desc: 'Salva o estado do aplicativo com mensagem semântica.',
      command: 'git commit -m "feat: Implementar Sistema de Login e Senha completo"',
    },
    {
      title: '6. Enviar alterações para o GitHub',
      desc: 'Faz o push definitivo para o repositório remoto.',
      command: 'git push -u origin main',
    },
  ];

  const fullScript = `# Sequência completa de sincronização com o GitHub:
git init
git remote add origin ${repoUrl}
git branch -M main
git add .
git commit -m "feat: Implementar Sistema de Login e Senha completo"
git push -u origin main`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="github-modal-title"
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 id="github-modal-title" className="text-lg font-bold text-slate-900">Sincronização com o GitHub</h2>
              <p className="text-xs text-slate-500">Repositório: gleidsonprestudos1991-debug/google-studio</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Target Repo Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Repositório Alvo Configurado</span>
              <p className="font-mono text-xs text-slate-800 break-all mt-0.5">{repoWebUrl}</p>
            </div>
            <a
              href={repoWebUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0"
            >
              <span>Abrir no GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick full script block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-500" />
                Script Completo (Terminal Bash)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(fullScript, 999)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                {copiedIndex === 999 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar tudo</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-100 text-xs font-mono rounded-xl overflow-x-auto selection:bg-indigo-500/30">
              {fullScript}
            </pre>
          </div>

          {/* Step-by-Step Sequence */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-indigo-600" />
              Passo a Passo Detalhado
            </h3>

            {steps.map((step, idx) => (
              <div key={idx} className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(step.command, idx)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors shrink-0"
                    title="Copiar comando"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 break-all select-all">
                  {step.command}
                </div>
              </div>
            ))}
          </div>

          {/* Safe Sync Tips */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Garantia de Integridade dos Arquivos</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              O arquivo <code>.gitignore</code> já está configurado para não expor variáveis de ambiente sensíveis (<code>.env</code>) ou pastas de compilação (<code>node_modules/</code> e <code>dist/</code>).
              Se o repositório remoto já possuir arquivos anteriores, execute <code>git pull origin main --rebase</code> antes do push final para mesclar com segurança.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Fechar Instruções
          </button>
        </div>
      </div>
    </div>
  );
};
