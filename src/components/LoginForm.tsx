import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Eraser, AlertCircle, CheckCircle2, User, KeyRound, Sparkles } from 'lucide-react';
import { authenticate } from '../services/authService';
import { Session } from '../types/auth';

interface LoginFormProps {
  onSuccess: (session: Session) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation state
  const [touched, setTouched] = useState({ username: false, password: false });

  const usernameError = touched.username && !username.trim() ? 'O nome de usuário é obrigatório.' : null;
  const passwordError = touched.password && !password ? 'A senha é obrigatória.' : null;

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setTouched({ username: false, password: false });
  };

  const handleFillDemo = () => {
    setUsername('maria.silva');
    setPassword('Senha123!');
    setErrorMessage(null);
    setSuccessMessage(null);
    setTouched({ username: true, password: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios antes de entrar.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticate(username, password);

      if (result.success && result.session) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onSuccess(result.session!);
        }, 650);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocorreu um erro inesperado ao processar a autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-900 text-indigo-400 rounded-xl mx-auto flex items-center justify-center mb-3 shadow-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Acesse sua conta</h1>
          <p className="text-sm text-slate-500 mt-1">
            Digite suas credenciais para entrar na área protegida
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Acesso Permitido!</p>
              <p className="text-emerald-700 text-xs mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Erro de Acesso</p>
              <p className="text-rose-700 text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username Input */}
          <div>
            <label htmlFor="login-username" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome de Usuário <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                placeholder="Ex: maria.silva"
                autoComplete="username"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  usernameError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
            </div>
            {usernameError && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{usernameError}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Senha <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">SHA-256 Criptografada</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  passwordError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{passwordError}</p>
            )}
          </div>

          {/* Action Buttons: Entrar & Limpar Campos */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Verificando credenciais...' : 'Entrar'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5 text-slate-500" />
              <span>Limpar Campos</span>
            </button>
          </div>
        </form>

        {/* Demo Fast-Fill Helper */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">Conta de demonstração cadastrada:</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition-colors border border-indigo-200/60 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Preencher: maria.silva / Senha123!</span>
          </button>
        </div>

        {/* Register CTA */}
        <div className="mt-5 text-center text-xs text-slate-600">
          Não tem uma conta ainda?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            Cadastre-se gratuitamente
          </button>
        </div>
      </div>
    </div>
  );
};
