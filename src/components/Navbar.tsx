import React from 'react';
import { ShieldCheck, LogOut, Github, Flame, UserCheck } from 'lucide-react';
import { SafeUser } from '../types/auth';

interface NavbarProps {
  currentUser: SafeUser | null;
  onLogout: () => void;
  onOpenGitHubSync: () => void;
  onOpenFirebaseGuide: () => void;
  activeView: 'auth' | 'dashboard';
  setActiveView: (view: 'auth' | 'dashboard') => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenGitHubSync,
  onOpenFirebaseGuide,
  activeView,
  setActiveView,
  authMode,
  setAuthMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Sistema de Login
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {currentUser && (
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className={`transition-colors whitespace-nowrap hover:text-slate-900 ${
                  activeView === 'dashboard' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Área Protegida
              </button>
            )}
            <button
              type="button"
              onClick={onOpenGitHubSync}
              className="flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-slate-900"
            >
              <Github className="w-4 h-4 text-slate-700" />
              <span>Sincronizar GitHub</span>
            </button>
            <button
              type="button"
              onClick={onOpenFirebaseGuide}
              className="flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-slate-900"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Guia Firebase</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-slate-800">{currentUser.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono">@{currentUser.username}</span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
                  title="Encerrar sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {authMode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Criar Conta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Já tenho conta
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenGitHubSync}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
