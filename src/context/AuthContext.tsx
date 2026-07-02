import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const API_BASE = 'http://localhost:8080/api/v1';
const ACCESS_TOKEN_KEY = 'yq_access_token';
const REFRESH_TOKEN_KEY = 'yq_refresh_token';
const USER_KEY = 'yq_user';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  biography?: string;
  profileImageUrl?: string;
  preferredPaymentMethod?: string;
  emailVerified: boolean;
  district?: { id: number; name: string; city: string; province: string; country: string };
  roles: string[];
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

interface ApiResponse<T> { success: boolean; message?: string; data: T; }

interface AuthContextType {
  user: UserDto | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: UserDto) => void;
  getToken: () => string | null;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  districtId: number;
  acceptedTerms: boolean;
}

function loadUser(): UserDto | null {
  try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(loadUser);
  const isLoggedIn = !!user;

  const saveSession = useCallback((data: AuthResponseDto) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json: ApiResponse<AuthResponseDto> = await res.json();
    if (!res.ok) throw new Error(json.message || 'Credenciales incorrectas');
    saveSession(json.data);
  }, [saveSession]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error('[Register error]', res.status, JSON.stringify(json));
      if (res.status === 422 && json.data && typeof json.data === 'object') {
        const fieldErrors = Object.values(json.data as Record<string, string>).join(' | ');
        throw new Error(fieldErrors || json.message || 'Error de validación');
      }
      throw new Error(json.message || 'Error al registrarse');
    }
    saveSession(json.data);
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((u: UserDto) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const getToken = useCallback(() => localStorage.getItem(ACCESS_TOKEN_KEY), []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, updateUser, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
