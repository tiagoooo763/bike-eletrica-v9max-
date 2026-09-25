import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('@PulseShop:user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockUsers[0];
      }
    }
    return mockUsers[0]; // Default logged-in customer for rich instant interaction
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('@PulseShop:user', JSON.stringify(user));
    } else {
      localStorage.removeItem('@PulseShop:user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole = 'customer'): Promise<boolean> => {
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '(11) 99999-9999',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role,
      storeId: role === 'seller' ? 'store_1' : undefined,
      createdAt: new Date().toISOString(),
    };
    setUser({ ...found, role });
    return true;
  };

  const register = async (name: string, email: string, phone: string, _password: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const targetUser = mockUsers.find(u => u.role === newRole) || {
      ...user,
      role: newRole,
      storeId: newRole === 'seller' ? 'store_1' : undefined,
    };
    setUser(targetUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || 'customer',
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
