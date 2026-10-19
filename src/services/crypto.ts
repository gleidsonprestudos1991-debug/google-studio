import { PasswordStrength } from '../types/auth';

/**
 * Generate a cryptographically secure random hexadecimal salt.
 */
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password concatenated with a salt using SHA-256 via Web Crypto API.
 * Never stores or transmits plaintext passwords!
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  // Salt + Password combination to prevent rainbow table attacks
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify whether a plain password and salt match an existing SHA-256 hash.
 */
export async function verifyPassword(
  plainPassword: string,
  salt: string,
  storedHash: string
): Promise<boolean> {
  const calculatedHash = await hashPassword(plainPassword, salt);
  return calculatedHash === storedHash;
}

/**
 * Generate a cryptographically random session token.
 */
export function generateToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Evaluate password strength and provide constructive feedback.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: 'Muito fraca',
      color: 'bg-slate-200 text-slate-600',
      feedback: ['Digite uma senha'],
    };
  }

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use pelo menos 8 caracteres');
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Inclua letras maiúsculas e minúsculas');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione pelo menos um número');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione um caractere especial (!@#$...)');
  }

  if (score <= 1) {
    return {
      score: 1,
      label: 'Muito fraca',
      color: 'bg-rose-500 text-white',
      feedback,
    };
  } else if (score === 2) {
    return {
      score: 2,
      label: 'Fraca',
      color: 'bg-amber-500 text-white',
      feedback,
    };
  } else if (score === 3) {
    return {
      score: 3,
      label: 'Média',
      color: 'bg-blue-500 text-white',
      feedback,
    };
  } else if (score === 4 && password.length >= 10) {
    return {
      score: 4,
      label: 'Forte',
      color: 'bg-emerald-600 text-white',
      feedback: ['Excelente! Senha forte e segura.'],
    };
  } else {
    return {
      score: 3,
      label: 'Boa',
      color: 'bg-emerald-500 text-white',
      feedback: feedback.length ? feedback : ['Boa senha.'],
    };
  }
}
