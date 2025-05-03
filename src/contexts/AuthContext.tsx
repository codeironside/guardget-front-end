import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  firstName: string;
  middleName: string | null;
  surName: string;
  role: 'user' | 'admin';
  country: string;
  stateOfOrigin: string;
  phoneNumber: string;
  email: string;
  imageurl: string;
  emailVerified: boolean;
  subActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.getUserProfile();
      if (response.status === 'success') {
        setUser(response.data.userDetails);
        // Redirect based on role if on login page
        if (window.location.pathname === '/login') {
          navigate(response.data.userDetails.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message);
      localStorage.removeItem('auth_token');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });
      
      if (response.status === 'success') {
        const { accessToken, ...userData } = response.data;
        localStorage.setItem('auth_token', accessToken);
        setUser(userData);
        
        // Play success sound
        const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ring-01.mp3');
        audio.play();

        toast.success('Login successful!');

        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message);
      // Play error sound
      const audio = new Audio('https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3');
      audio.play();
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};