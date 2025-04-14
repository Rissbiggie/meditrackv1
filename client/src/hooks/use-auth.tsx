
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { UserRole } from '@shared/schema';
import { useToast } from './use-toast';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
  isAdmin: boolean;
  isResponseTeam: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  const { data: session, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const res = await fetch('/api/user');
      if (!res.ok) return null;
      return res.json();
    }
  });

  useEffect(() => {
    if (session) {
      setUser(session);
    }
  }, [session]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      toast({
        title: "Success",
        description: "Registered successfully",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      return res.json();
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    },
  });

  const isAdmin = user?.role === UserRole.ADMIN;
  const isResponseTeam = user?.role === UserRole.RESPONSE_TEAM;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      loginMutation,
      logoutMutation,
      registerMutation,
      isAdmin,
      isResponseTeam
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
