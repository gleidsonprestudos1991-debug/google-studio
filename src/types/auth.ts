export interface User {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt?: string;
}

export type SafeUser = Omit<User, 'passwordHash' | 'salt'>;

export interface Session {
  token: string;
  user: SafeUser;
  createdAt: string;
  expiresAt: string;
}

export type AuditAction = 
  | 'login_success'
  | 'login_failed'
  | 'register_success'
  | 'register_failed'
  | 'password_changed'
  | 'logout';

export interface ActivityLog {
  id: string;
  username: string;
  action: AuditAction;
  timestamp: string;
  details?: string;
  device?: string;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Muito fraca' | 'Fraca' | 'Média' | 'Boa' | 'Forte';
  color: string;
  feedback: string[];
}
