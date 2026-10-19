import { User, SafeUser, Session, ActivityLog } from '../types/auth';
import { generateSalt, hashPassword, verifyPassword, generateToken } from './crypto';

const USERS_STORAGE_KEY = 'sistema_login_users_v1';
const SESSION_STORAGE_KEY = 'sistema_login_session_v1';
const LOGS_STORAGE_KEY = 'sistema_login_logs_v1';

/**
 * Returns a brief device/browser summary for the audit log.
 */
function getDeviceSummary(): string {
  if (typeof window === 'undefined' || !window.navigator) return 'Desconhecido';
  const ua = window.navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Dispositivo Móvel';
  if (/macintosh/i.test(ua)) return 'Mac OS (Desktop)';
  if (/windows/i.test(ua)) return 'Windows (Desktop)';
  if (/linux/i.test(ua)) return 'Linux (Desktop)';
  return 'Navegador Web';
}

/**
 * Strips sensitive cryptographic material (passwordHash and salt) from User object.
 */
export function sanitizeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

/**
 * Loads all users from storage.
 */
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as User[];
  } catch (err) {
    console.error('Erro ao ler usuários:', err);
    return [];
  }
}

/**
 * Saves users to storage.
 */
function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Erro ao salvar usuários:', err);
  }
}

/**
 * Logs an authentication or security event.
 */
export function addActivityLog(
  username: string,
  action: ActivityLog['action'],
  details?: string
): void {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    const logs: ActivityLog[] = raw ? JSON.parse(raw) : [];
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: username || 'anônimo',
      action,
      timestamp: new Date().toISOString(),
      details,
      device: getDeviceSummary(),
    };
    // Keep the most recent 100 logs
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Erro ao gravar log de auditoria:', err);
  }
}

/**
 * Retrieves activity logs.
 */
export function getActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ActivityLog[];
  } catch {
    return [];
  }
}

/**
 * Clear activity logs.
 */
export function clearActivityLogs(): void {
  localStorage.removeItem(LOGS_STORAGE_KEY);
}

/**
 * Initializes the default demo users if the storage is empty.
 * Passwords are NEVER stored in plaintext. They are salted and hashed immediately.
 */
export async function initializeStorage(): Promise<void> {
  const users = getUsers();
  if (users.length === 0) {
    // Seed default demo user: maria.silva / Senha123!
    const salt = generateSalt(16);
    const passwordHash = await hashPassword('Senha123!', salt);
    
    const demoUser: User = {
      id: 'usr_demo_1',
      name: 'Maria Silva',
      username: 'maria.silva',
      passwordHash,
      salt,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLoginAt: undefined,
    };

    saveUsers([demoUser]);
    addActivityLog('sistema', 'register_success', 'Conta demonstrativa pré-configurada');
  }
}

/**
 * Authenticates user credentials.
 */
export async function authenticate(
  usernameInput: string,
  plainPasswordInput: string
): Promise<{ success: boolean; message: string; session?: Session }> {
  const cleanUsername = usernameInput.trim();
  const cleanPassword = plainPasswordInput;

  if (!cleanUsername) {
    return { success: false, message: 'Por favor, informe o nome de usuário.' };
  }
  if (!cleanPassword) {
    return { success: false, message: 'Por favor, digite a sua senha.' };
  }

  const users = getUsers();
  const foundUser = users.find(
    u => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );

  if (!foundUser) {
    addActivityLog(cleanUsername, 'login_failed', 'Usuário não localizado');
    return {
      success: false,
      message: 'Nome de usuário ou senha incorretos.',
    };
  }

  const isValid = await verifyPassword(cleanPassword, foundUser.salt, foundUser.passwordHash);

  if (!isValid) {
    addActivityLog(cleanUsername, 'login_failed', 'Senha inválida');
    return {
      success: false,
      message: 'Nome de usuário ou senha incorretos.',
    };
  }

  // Update last login
  foundUser.lastLoginAt = new Date().toISOString();
  saveUsers(users);

  // Create session
  const safeUser = sanitizeUser(foundUser);
  const session: Session = {
    token: generateToken(),
    user: safeUser,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Erro ao salvar sessão:', err);
  }

  addActivityLog(cleanUsername, 'login_success', 'Acesso autorizado com sucesso');

  return {
    success: true,
    message: 'Acesso autorizado com sucesso! Redirecionando...',
    session,
  };
}

/**
 * Registers a new user.
 * Strictly prevents duplicates and hashes the password with a unique salt.
 */
export async function registerUser(
  nameInput: string,
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; message: string; user?: SafeUser }> {
  const cleanName = nameInput.trim();
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPassword = passwordInput;

  if (!cleanName) {
    return { success: false, message: 'O nome completo é obrigatório.' };
  }
  if (!cleanUsername) {
    return { success: false, message: 'O nome de usuário é obrigatório.' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, message: 'O nome de usuário deve ter pelo menos 3 caracteres.' };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
    return {
      success: false,
      message: 'O nome de usuário só pode conter letras, números, ponto, traço ou sublinhado.',
    };
  }
  if (!cleanPassword) {
    return { success: false, message: 'A senha é obrigatória.' };
  }
  if (cleanPassword.length < 6) {
    return { success: false, message: 'A senha deve conter no mínimo 6 caracteres.' };
  }

  const users = getUsers();
  const exists = users.some(u => u.username.toLowerCase() === cleanUsername);

  if (exists) {
    addActivityLog(cleanUsername, 'register_failed', 'Tentativa de cadastro de usuário duplicado');
    return {
      success: false,
      message: `O nome de usuário "${cleanUsername}" já está em uso. Escolha outro.`,
    };
  }

  const salt = generateSalt(16);
  const passwordHash = await hashPassword(cleanPassword, salt);

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    username: cleanUsername,
    passwordHash,
    salt,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  addActivityLog(cleanUsername, 'register_success', `Usuário "${cleanName}" cadastrado`);

  return {
    success: true,
    message: 'Usuário cadastrado com sucesso! Você já pode entrar.',
    user: sanitizeUser(newUser),
  };
}

/**
 * Changes a user's password securely by verifying the old password first.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return { success: false, message: 'Usuário não encontrado.' };
  }

  const isCurrentValid = await verifyPassword(currentPassword, user.salt, user.passwordHash);
  if (!isCurrentValid) {
    return { success: false, message: 'A senha atual está incorreta.' };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'A nova senha deve ter pelo menos 6 caracteres.' };
  }

  const newSalt = generateSalt(16);
  const newHash = await hashPassword(newPassword, newSalt);

  user.salt = newSalt;
  user.passwordHash = newHash;
  saveUsers(users);

  addActivityLog(user.username, 'password_changed', 'Senha alterada com sucesso');

  return { success: true, message: 'Senha atualizada com sucesso!' };
}

/**
 * Retrieves the currently active session, if valid.
 */
export function getCurrentSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (new Date(session.expiresAt) < new Date()) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Ends the active session (Logout).
 */
export function endSession(): void {
  const session = getCurrentSession();
  if (session) {
    addActivityLog(session.user.username, 'logout', 'Sessão encerrada pelo usuário');
  }
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Retrieves all safe users (passwords and salts stripped out).
 */
export function getSafeUsers(): SafeUser[] {
  return getUsers().map(sanitizeUser);
}

/**
 * Deletes a user (cannot delete the active user or the last remaining user).
 */
export function deleteUser(
  userId: string,
  activeUserId: string
): { success: boolean; message: string } {
  if (userId === activeUserId) {
    return { success: false, message: 'Você não pode excluir sua própria conta conectada.' };
  }
  const users = getUsers();
  const target = users.find(u => u.id === userId);
  if (!target) {
    return { success: false, message: 'Usuário não encontrado.' };
  }
  const filtered = users.filter(u => u.id !== userId);
  saveUsers(filtered);
  addActivityLog(target.username, 'logout', `Usuário removido pelo administrador`);
  return { success: true, message: `Usuário "${target.username}" removido.` };
}
