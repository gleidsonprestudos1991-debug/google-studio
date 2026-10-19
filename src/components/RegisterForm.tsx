import React, { useState, useMemo } from 'react';
import { UserPlus, Eye, EyeOff, Eraser, AlertCircle, CheckCircle2, User, KeyRound, AtSign, ArrowLeft } from 'lucide-react';
import { registerUser, getUsers } from '../services/authService';
import { evaluatePasswordStrength } from '../services/crypto';
import { SafeUser } from '../types/auth';

interface RegisterFormProps {
  onSuccess: (user: SafeUser) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  // Live duplicate checking
  const isDuplicateUsername = useMemo(() => {
    if (!username.trim() || username.trim().length < 3) return false;
    const existing = getUsers();
    return existing.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
  }, [username]);

  // Password strength calculation
  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  // Field validations
  const nameError = touched.name && !name.trim() ? 'O nome completo é obrigatório.' : null;
  const usernameError = touched.username
    ? !username.trim()
      ? 'O nome de usuário é obrigatório.'
      : username.trim().length < 3
      ? 'O nome de usuário deve ter no mínimo 3 caracteres.'
      : isDuplicateUsername
      ? 'Este nome de usuário já está cadastrado no sistema.'
      : null
    : null;

  const passwordError = touched.password
    ? !password
      ? 'A senha é obrigatória.'
      : password.length < 6
      ? 'A senha deve ter no mínimo 6 caracteres.'
      : null
    : null;

  const confirmPasswordError = touched.confirmPassword
    ? !confirmPassword
      ? 'Confirme a sua senha.'
      : confirmPassword !== password
      ? 'As senhas digitadas não coincidem.'
      : null
    : null;

  const handleClear = () => {
    setName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setTouched({
      name: false,
      username: false,
      password: false,
      confirmPassword: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      username: true,
      password: true,
      confirmPassword: true,
    });
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate fields
    if (!name.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMessage('Todos os campos marcados com asterisco (*) são obrigatórios.');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMessage('O nome de usuário deve ter pelo menos 3 caracteres.');
      return;
    }

    if (isDuplicateUsername) {
      setErrorMessage(`O usuário "${username.trim()}" já existe. Por favor, escolha outro.`);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha precisa conter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Digite a mesma senha em ambos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(name, username, password);

      if (result.success && result.user) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
        }, 1200);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao registrar usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-3 shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Novo Cadastro</h1>
          <p className="text-sm text-slate-500 mt-1">
            Preencha seus dados para criar sua conta protegida
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Cadastro Realizado com Sucesso!</p>
              <p className="text-emerald-700 text-xs mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Não foi possível cadastrar</p>
              <p className="text-rose-700 text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="register-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                placeholder="Ex: Carlos Eduardo"
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  nameError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
            </div>
            {nameError && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{nameError}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="register-username" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Nome de Usuário <span className="text-rose-500">*</span>
              </label>
              {username.trim().length >= 3 && (
                <span className={`text-xs ${isDuplicateUsername ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>
                  {isDuplicateUsername ? 'Indisponível' : 'Disponível'}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                placeholder="Ex: carlos.eduardo"
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Senha <span className="text-rose-500">*</span>
              </label>
              {password && (
                <span className="text-xs font-semibold text-slate-600">
                  Força: {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                placeholder="Crie uma senha forte (mín. 6 dígitos)"
                autoComplete="new-password"
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
            
            {/* Password Strength Visual Meter */}
            {password && (
              <div className="mt-2">
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${strength.score >= 1 ? 'bg-rose-500' : 'bg-transparent'}`} />
                  <div className={`h-full transition-all ${strength.score >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                  <div className={`h-full transition-all ${strength.score >= 3 ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div className={`h-full transition-all ${strength.score >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} />
                </div>
                {strength.feedback.length > 0 && (
                  <p className="mt-1 text-[11px] text-slate-500">{strength.feedback[0]}</p>
                )}
              </div>
            )}

            {passwordError && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirmar Senha <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                placeholder="Repita a senha digitada"
                autoComplete="new-password"
                className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  confirmPasswordError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                title={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{confirmPasswordError}</p>
            )}
          </div>

          {/* Action Buttons: Cadastrar & Limpar */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isLoading || isDuplicateUsername}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Criando conta protegida...' : 'Cadastrar Usuário'}</span>
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

        {/* Back to login */}
        <div className="mt-5 text-center text-xs text-slate-600">
          Já possui um cadastro ativo?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            Fazer login agora
          </button>
        </div>
      </div>
    </div>
  );
};
