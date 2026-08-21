import { createContext, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = async (loginEmail, password) => {
    const res = await api.post('/auth/login', { email: loginEmail, password });
    const { token: newToken, email: userEmail } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', userEmail);
    setToken(newToken);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken('');
    setEmail('');
  };

  return (
    <AuthContext.Provider value={{ email, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
