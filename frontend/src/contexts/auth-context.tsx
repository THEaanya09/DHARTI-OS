'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { Locale, CropType } from '@/types';
import { postAuthPath } from '@/lib/profile-utils';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  language: string;
  farm_name: string | null;
  crop: string | null;
  farm_area: number | null;
  area_unit: 'acres' | 'hectares' | null;
  latitude: number | null;
  longitude: number | null;
  state_name: string | null;
  season: string | null;
  annual_rainfall: number | null;
  fertilizer_kg: number | null;
  pesticide_kg: number | null;
  land_cover: string | null;
  soil_type: string | null;
  elevation_m: number | null;
  near_river: boolean | null;
  historical_floods: number | null;
  soil_n: number | null;
  soil_p: number | null;
  soil_k: number | null;
  soil_ph: number | null;
  expected_rainfall_mm: number | null;
  created_at: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  loadingMessage: string | null;
  signUp: (email: string, password: string, name: string, language?: Locale) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => any;
  getCurrentProfile: () => UserProfile | null;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>('Checking session...');
  
  const supabase = createClient();
  const router = useRouter();

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }

      if (!data) {
        // If profile doesn't exist, create it on the fly using auth user metadata
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              language: user.user_metadata?.locale || 'en',
            })
            .select()
            .maybeSingle();

          if (!insertError && newProfile) {
            return newProfile as UserProfile;
          } else if (insertError) {
            console.error('Error auto-creating profile:', insertError.message);
          }
        }
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoadingMessage('Checking session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      setLoadingMessage(null);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      setLoadingMessage(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, language: Locale = 'en') => {
    setLoading(true);
    setLoadingMessage('Creating account...');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, language }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      toast.success('Sign up successful! Logging you in...');
      return await login(email, password);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setLoadingMessage('Signing in...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      const userProfile = await fetchProfile(data.user.id);
      setProfile(userProfile);

      toast.success('Signed in successfully');
      router.push(postAuthPath(userProfile));
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setLoadingMessage('Redirecting to Google...');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const loginWithGithub = async () => {
    setLoading(true);
    setLoadingMessage('Redirecting to GitHub...');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with GitHub');
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const logout = async () => {
    setLoading(true);
    setLoadingMessage('Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  const getCurrentUser = () => user;
  const getCurrentProfile = () => profile;

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>) => {
    if (!user) throw new Error('No authenticated user');
    
    setLoading(true);
    setLoadingMessage('Saving profile...');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loadingMessage,
        signUp,
        login,
        loginWithGoogle,
        loginWithGithub,
        logout,
        getCurrentUser,
        getCurrentProfile,
        updateProfile,
      }}
    >
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
