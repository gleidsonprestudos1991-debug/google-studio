import React, { useState, useEffect, useMemo } from 'react';
import { 
  LogOut, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Github, 
  Flame, 
  Laptop, 
  Lock
} from 'lucide-react';
import { SafeUser, ActivityLog } from '../types/auth';
import { 
  getSafeUsers, 
  getActivityLogs, 
  deleteUser, 
  changePassword, 
  clearActivityLogs 
} from '../services/authService';

interface DashboardProps {
  currentUser: SafeUser;
  onLogout: () => void;
  onOpenGitHubSync: () => void;
  onOpenFirebaseGuide: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onLogout,
  onOpenGitHubSync,
  onOpenFirebaseGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit' | 'security'>('overview');
  const [usersList, setUsersList] = useState<SafeUser[]>([]);
  const [logsList, setLogsList] = useState<ActivityLog[]>([]);
  const [userSearch, setUserSearch] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load registered users and audit logs
  const reloadData = () => {
    setUsersList(getSafeUsers());
    setLogsList(getActivityLogs());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return usersList;
    const q = userSearch.toLowerCase();
    return usersList.filter(
      u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
  }, [usersList, userSearch]);

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza de que deseja excluir este usuário?')) {
      const res = deleteUser(userId, currentUser.id);
      if (res.success) {
        reloadData();
      } else {
        alert(res.message);
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordFeedback({ type: 'error', message: 'Preencha todos os campos para alterar a senha.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordFeedback({ type: 'error', message: 'A confirmação de senha não confere.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(currentUser.id, currentPassword, newPassword);
      if (res.success) {
        setPasswordFeedback({ type: 'success', message: res.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        reloadData();
      } else {
        setPasswordFeedback({ type: 'error', message: res.message });
      }
    } catch {
      setPasswordFeedback({ type: 'error', message: 'Erro ao alterar senha. Tente novamente.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Primeiro acesso agora';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & User Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Bem-vindo(a), {currentUser.name}!
              </h1>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Autenticado
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
              <span>Usuário: <strong className="text-slate-700 font-mono">@{currentUser.username}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Cadastro: {formatDate(currentUser.createdAt)}</span>
              {currentUser.lastLoginAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Último acesso: {formatDate(currentUser.lastLoginAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenGitHubSync}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            <Github className="w-4 h-4 text-slate-800" />
            <span>Sincronizar GitHub</span>
          </button>
          <button
            type="button"
            onClick={onOpenFirebaseGuide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Guia Firebase</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Functional buttons with click handlers) */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/60 rounded-xl border border-slate-200/80 max-w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Visão Geral</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Usuários Cadastrados ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Auditoria de Acessos ({logsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4 text-indigo-600" />
          <span>Alterar Senha</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. Overview */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Estado da Sessão Protegida</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Esta área é acessível exclusivamente após validação correta de usuário e senha.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Nome Registrado</span>
                <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Identificador Único</span>
                <p className="text-sm font-mono text-slate-900">@{currentUser.username}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status da Conta</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-800">Ativa e Autenticada</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Criptografia Aplicada</span>
                <p className="text-sm font-medium text-slate-800">SHA-256 (Hash + Salt por Usuário)</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                Recursos Concluídos Conforme o Requisito:
              </h3>
              <ul className="text-xs text-indigo-900/90 space-y-1 list-disc pl-4 mt-2">
                <li><strong>Tela de Login:</strong> Validação de obrigatórios, mostrar/ocultar senha, mensagens de erro/sucesso, botão de limpar campos.</li>
                <li><strong>Cadastro de Usuários:</strong> Validação completa, barramento de nomes duplicados, indicador de força de senha.</li>
                <li><strong>Segurança:</strong> Sem senhas em texto puro, sem senhas no código cliente, validação criptográfica.</li>
                <li><strong>Área Pós-Login:</strong> Mensagem personalizada, botão de logout e proteção de rotas.</li>
                <li><strong>Sincronização GitHub:</strong> Guia interativo preparado para <code>gleidsonprestudos1991-debug/google-studio</code>.</li>
              </ul>
            </div>
          </div>

          {/* Side Card: Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900">Métricas do Sistema</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-600">Total de Usuários</span>
                <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {usersList.length}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-600">Eventos de Auditoria</span>
                <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {logsList.length}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-600">Modo de Operação</span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Demonstração Segura
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenGitHubSync}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>Ver Comandos Git</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Registered Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Usuários Cadastrados no Sistema</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nenhuma senha ou hash sensível é exposto nesta listagem.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Buscar por nome ou usuário..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nome Completo</th>
                    <th className="py-3 px-4">Usuário</th>
                    <th className="py-3 px-4">Data de Cadastro</th>
                    <th className="py-3 px-4">Último Acesso</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isSelf = u.id === currentUser.id;
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                                  Você
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            @{u.username}
                          </td>
                          <td className="py-3 px-4 text-slate-600 tabular-nums">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-slate-600 tabular-nums">
                            {formatDate(u.lastLoginAt)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isSelf ? (
                              <span className="text-slate-400 text-xs italic">Sessão ativa</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 text-xs font-semibold transition-colors cursor-pointer"
                                title="Excluir usuário"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remover</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Histórico de Auditoria & Segurança</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Registra tentativas de autenticação, sucessos, falhas e alterações de credenciais.
              </p>
            </div>

            {logsList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Deseja limpar todos os registros de auditoria?')) {
                    clearActivityLogs();
                    reloadData();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg hover:border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Data e Hora</th>
                    <th className="py-3 px-4">Usuário</th>
                    <th className="py-3 px-4">Ação</th>
                    <th className="py-3 px-4">Detalhes</th>
                    <th className="py-3 px-4">Dispositivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhum registro de log gravado até o momento.
                      </td>
                    </tr>
                  ) : (
                    logsList.map(log => {
                      const isSuccess = log.action === 'login_success' || log.action === 'register_success';
                      const isFailed = log.action === 'login_failed' || log.action === 'register_failed';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-slate-600 tabular-nums">
                            {formatDate(log.timestamp)}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                            @{log.username}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isSuccess 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : isFailed
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {log.action === 'login_success' && 'Login Sucesso'}
                              {log.action === 'login_failed' && 'Tentativa Inválida'}
                              {log.action === 'register_success' && 'Usuário Criado'}
                              {log.action === 'register_failed' && 'Erro no Cadastro'}
                              {log.action === 'password_changed' && 'Senha Alterada'}
                              {log.action === 'logout' && 'Logout'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {log.details || '-'}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 flex items-center gap-1.5">
                            <Laptop className="w-3.5 h-3.5 text-slate-400" />
                            <span>{log.device || 'Navegador'}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. Change Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Alteração Segura de Senha</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Valida a sua senha atual e recalcula um novo sal criptográfico com SHA-256.
            </p>
          </div>

          {passwordFeedback && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {passwordFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <p className="font-medium">{passwordFeedback.message}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Senha Atual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Digite a senha atual"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nova Senha (Mínimo 6 caracteres)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isChangingPassword ? 'Gravando nova senha criptografada...' : 'Atualizar Senha Agora'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
