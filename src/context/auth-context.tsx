"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: string;
  token: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, redirectAfterCart?: boolean) => Promise<any>;
  logout: () => void;
  loading: boolean;
  redirectBasedOnRole: (role: string, redirectAfterCart?: boolean) => void;
  validateToken: () => Promise<boolean>;
  checkPermission: (requiredRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session check interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Track if an authentication check is in progress to prevent duplicate calls
  const authCheckInProgressRef = useRef(false);

  const getUserFromToken = useCallback((token: string) => {
    const profile = authService.getProfileFromToken(token);
    if (profile) {
      return {
        ...profile,
        token
      };
    }
    return null;
  }, []);

  // Check if user has required role
  const checkPermission = useCallback((requiredRoles: string[]): boolean => {
    if (!user || !user.role) return false;
    
    // Handle role equivalence (user = customer)
    const userRole = user.role;
    const normalizedRequiredRoles = requiredRoles.map(role => {
      // If the required role is 'user', also allow 'customer' and vice versa
      if (role === 'user' && userRole === 'customer') return 'customer';
      if (role === 'customer' && userRole === 'user') return 'user';
      return role;
    });
    
    return normalizedRequiredRoles.includes(userRole);
  }, [user]);

  // Validate token locally without server call
  const validateToken = useCallback(async (): Promise<boolean> => {
    // Prevent multiple validation calls simultaneously
    if (authCheckInProgressRef.current) {
      return !!user;
    }
    
    try {
      authCheckInProgressRef.current = true;
      
      const token = localStorage.getItem('token');
      if (!token) {
        authCheckInProgressRef.current = false;
        return false;
      }

      // Check if token is valid locally
      if (!authService.isTokenValid(token)) {
        localStorage.removeItem('token');
        setUser(null);
        authCheckInProgressRef.current = false;
        return false;
      }

      // Get user data from token
      const userData = getUserFromToken(token);
      if (!userData) {
        localStorage.removeItem('token');
        setUser(null);
        authCheckInProgressRef.current = false;
        return false;
      }

      // Only update user if it's different from current user to prevent infinite loops
      // Compare essential properties to determine if an update is needed
      const needsUpdate = !user || 
                          user.id !== userData.id || 
                          user.email !== userData.email || 
                          user.role !== userData.role || 
                          user.token !== token;
      
      if (needsUpdate) {
        setUser({
          ...userData,
          token
        });
      }
      
      authCheckInProgressRef.current = false;
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      setUser(null);
      authCheckInProgressRef.current = false;
      return false;
    }
  }, [getUserFromToken, user]);

  // Periodically check token validity
  useEffect(() => {
    const checkTokenPeriodically = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Check if token is about to expire
        if (authService.isTokenExpiringSoon(token)) {
          toast.error("Your session is about to expire. Please login again.", {
            duration: 10000
          });
        }
      }
    };

    const intervalId = setInterval(checkTokenPeriodically, SESSION_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip if already checking
      if (authCheckInProgressRef.current) return;
      
      setLoading(true);
      authCheckInProgressRef.current = true;
      
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Check if token is valid
          if (!authService.isTokenValid(token)) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            const userData = getUserFromToken(token);
            if (userData) {
              // Only update if data has changed
              const needsUpdate = !user || 
                                  user.id !== userData.id || 
                                  user.email !== userData.email || 
                                  user.role !== userData.role || 
                                  user.token !== token;
                                  
              if (needsUpdate) {
                setUser(userData);
              }
            } else {
              localStorage.removeItem('token');
              setUser(null);
            }
          }
        } else {
          // Only update if currently logged in
          if (user) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
        authCheckInProgressRef.current = false;
      }
    };

    checkAuth();
  }, [getUserFromToken, user]);

  const redirectBasedOnRole = useCallback((role: string, redirectAfterCart: boolean = false) => {
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'dealer') {
      router.push('/dealer/dashboard');
    } else if (role === 'user' || role === 'customer') {
      if (redirectAfterCart) {
        // Check if user was adding to cart before login
        const productToAdd = localStorage.getItem('pendingAddToCart');
        if (productToAdd) {
          localStorage.removeItem('pendingAddToCart');
          router.push('/cart-details');
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } else {
      // Default redirect for unknown roles
      console.warn(`Unknown role: ${role}, redirecting to home page`);
      router.push('/');
    }
  }, [router]);

  const login = useCallback(async (email: string, password: string, redirectAfterCart: boolean = false) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data && response.data.token) {
        const token = response.data.token;
        
        // Store token immediately to ensure it's available
        localStorage.setItem('token', token);
        
        // Try to get user data from token
        const userData = getUserFromToken(token);
        
        if (userData) {
          // Token is valid and contains user data
          setUser(userData);
          setLoading(false);
          
          // Redirect based on user role
          redirectBasedOnRole(userData.role, redirectAfterCart);
          
          return { success: true };
        } else {
          // Log detailed information about the token for debugging
          console.error("Token validation failed: Could not extract user data from token");
          
          // Don't store invalid tokens
          localStorage.removeItem('token');
          setLoading(false);
          return { 
            success: false, 
            error: 'Authentication error: Invalid token data. Please try again or contact support.' 
          };
        }
      } else {
        setLoading(false);
        return { 
          success: false, 
          error: response.message || 'Login failed. Please check your email and password.' 
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred during login';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response.status === 404) {
          errorMessage = 'User not found. Please check your email or register.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Server not responding. Please try again later.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, [getUserFromToken, redirectBasedOnRole]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('pendingAddToCart');
    setUser(null);
    toast.success("You have been logged out successfully");
    router.push('/auth/signin');
  }, [router]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading,
    redirectBasedOnRole,
    validateToken,
    checkPermission
  }), [user, loading, login, logout, redirectBasedOnRole, validateToken, checkPermission]);

  return (
    <AuthContext.Provider value={contextValue}>
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