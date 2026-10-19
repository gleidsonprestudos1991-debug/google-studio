import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SecurityBanner } from './components/SecurityBanner';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { Session, SafeUser } from './types/auth';
import { 
  getCurrentSession, 
  endSession, 
  initializeStorage 
} from './services/authService';
import { ShieldCheck, Lock, Github, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeView, setActiveView] = useState<'auth' | 'dashboard'>('auth');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [registeredNotice, setRegisteredNotice] = useState<string | null>(null);

  // Initialize storage with demo credentials on app startup
  useEffect(() => {
    initializeStorage().then(() => {
      const activeSession = getCurrentSession();
      if (activeSession) {
        setSession(activeSession);
        setActiveView('dashboard');
      }
    });
  }, []);

  const handleLoginSuccess = (newSession: Session) => {
    setSession(newSession);
    setActiveView('dashboard');
    setRegisteredNotice(null);
  };

  const handleRegisterSuccess = (newUser: SafeUser) => {
    setAuthMode('login');
    setRegisteredNotice(`Conta criada para "${newUser.name}". Digite suas credenciais para acessar.`);
  };

  const handleLogout = () => {
    endSession();
    setSession(null);
    setActiveView('auth');
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentUser={session?.user || null}
        onLogout={handleLogout}
        onOpenGitHubSync={() => setIsGitHubModalOpen(true)}
        onOpenFirebaseGuide={() => setIsFirebaseModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        authMode={authMode}
        setAuthMode={setAuthMode}
      />

      {/* Security Banner with Educational / Production Disclaimer */}
      <SecurityBanner onOpenFirebaseGuide={() => setIsFirebaseModalOpen(true)} />

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col justify-center">
        {session && activeView === 'dashboard' ? (
          // PROTECTED AREA: Dashboard
          <Dashboard
            currentUser={session.user}
            onLogout={handleLogout}
            onOpenGitHubSync={() => setIsGitHubModalOpen(true)}
            onOpenFirebaseGuide={() => setIsFirebaseModalOpen(true)}
          />
        ) : (
          // PUBLIC AUTH AREA: Centered Login / Register
          <div className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle discreet decorative background */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
              <div className="w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-70" />
              <div className="w-[450px] h-[450px] bg-slate-100 rounded-full blur-2xl opacity-60 ml-32 mt-20" />
            </div>

            {/* Registration success feedback notice */}
            {registeredNotice && authMode === 'login' && (
              <div className="max-w-md mx-auto mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="font-medium">{registeredNotice}</p>
              </div>
            )}

            {authMode === 'login' ? (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => {
                  setAuthMode('register');
                  setRegisteredNotice(null);
                }}
              />
            ) : (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => {
                  setAuthMode('login');
                  setRegisteredNotice(null);
                }}
              />
            )}

            {/* Quick feature callouts under auth form */}
            <div className="max-w-md mx-auto mt-8 grid grid-cols-2 gap-3 text-slate-500 text-xs">
              <div className="p-3 bg-white/70 border border-slate-200 rounded-xl flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Senhas criptografadas com SHA-256 e sal</span>
              </div>
              <div className="p-3 bg-white/70 border border-slate-200 rounded-xl flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Validação contra cadastros duplicados</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Sistema de Login</span>
            <span>·</span>
            <span>Autenticação em React & TypeScript</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button
              type="button"
              onClick={() => setIsGitHubModalOpen(true)}
              className="hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Sincronizar com Repositório</span>
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Arquitetura Firebase
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <FirebaseGuideModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
}
