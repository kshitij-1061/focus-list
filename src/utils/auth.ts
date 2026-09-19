import type { User } from '../types/user';

const SESSION_KEY = 'focuslist_user_session';
const REGISTERED_USERS_KEY = 'focuslist_registered_users';

interface RegisteredUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

/**
 * Loads current active user session from LocalStorage.
 */
export function loadUserSession(): User | null {
  try {
    const rawData = localStorage.getItem(SESSION_KEY);
    if (!rawData) return null;
    const user = JSON.parse(rawData);
    if (user && typeof user.id === 'string' && typeof user.name === 'string' && typeof user.email === 'string') {
      return user as User;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists active user session to LocalStorage.
 */
export function saveUserSession(user: User): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user session:', error);
  }
}

/**
 * Clears active user session.
 */
export function logoutUserSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to logout user session:', error);
  }
}

/**
 * Registers a new user locally.
 */
export function registerUser(name: string, email: string, password: string): { success: boolean; user?: User; error?: string } {
  try {
    const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    const users: RegisteredUserRecord[] = rawUsers ? JSON.parse(rawUsers) : [];

    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email === normalizedEmail);

    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUserRecord: RegisteredUserRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password, // Frontend demo storage
    };

    users.push(newUserRecord);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

    const user: User = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
    };

    saveUserSession(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Authenticates an existing user locally.
 */
export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  try {
    const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    const users: RegisteredUserRecord[] = rawUsers ? JSON.parse(rawUsers) : [];

    const normalizedEmail = email.trim().toLowerCase();
    const userRecord = users.find((u) => u.email === normalizedEmail);

    if (!userRecord) {
      // If user records don't exist yet, auto-register for demo convenience
      const nameFromEmail = email.split('@')[0] || 'User';
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      return registerUser(capitalizedName, email, password);
    }

    if (userRecord.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    const user: User = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
    };

    saveUserSession(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Login failed. Please try again.' };
  }
}
