import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api-client';
import { API_ENDPOINTS } from '../../config/api.config';

export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  hasProfile: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, fullName?: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('superc_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('superc_token'));
  const [isLoading, setIsLoading] = useState<boolean>(() => !localStorage.getItem('superc_user'));

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('superc_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('superc_user', JSON.stringify(response.data));
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await apiClient.post<{ user: User; tokens: { accessToken: string } }>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );

    if (response.success && response.data) {
      const { user: userData, tokens } = response.data;
      localStorage.setItem('superc_token', tokens.accessToken);
      localStorage.setItem('superc_user', JSON.stringify(userData));
      setToken(tokens.accessToken);
      setUser(userData);
      return userData;
    }
    throw new Error('Login failed');
  };

  const register = async (email: string, password: string, fullName?: string): Promise<User> => {
    const response = await apiClient.post<{ user: User; tokens: { accessToken: string } }>(
      API_ENDPOINTS.AUTH.REGISTER,
      { email, password, fullName }
    );

    if (response.success && response.data) {
      const { user: userData, tokens } = response.data;
      localStorage.setItem('superc_token', tokens.accessToken);
      localStorage.setItem('superc_user', JSON.stringify(userData));
      setToken(tokens.accessToken);
      setUser(userData);
      return userData;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('superc_token');
    localStorage.removeItem('superc_user');
    localStorage.removeItem('sc_student_profile');
    localStorage.removeItem('sc_student_preferences');
    localStorage.removeItem('sc_student_education');
    localStorage.removeItem('sc_student_counsellor');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
