import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  OTIC: {
    id: '1',
    name: 'Carlos González',
    email: 'carlos@otic.cl',
    role: 'OTIC',
    company: 'OTIC Chile',
  },
  OTEC: {
    id: '2',
    name: 'María Fernández',
    email: 'maria@otec.cl',
    role: 'OTEC',
    company: 'Capacitaciones OTEC',
  },
  OTEC_REPRESENTANTE: {
    id: '3',
    name: 'Juan Pérez',
    email: 'juan@otec.cl',
    role: 'OTEC_REPRESENTANTE',
    company: 'Capacitaciones OTEC',
  },
  EMPRESA: {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@empresa.cl',
    role: 'EMPRESA',
    company: 'Empresa S.A.',
  },
  EMPRESA_REPRESENTANTE: {
    id: '5',
    name: 'Pedro López',
    email: 'pedro@empresa.cl',
    role: 'EMPRESA_REPRESENTANTE',
    company: 'Empresa S.A.',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, accept any email/password with the selected role
    if (email && password) {
      const mockUser = { ...mockUsers[role], email };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
