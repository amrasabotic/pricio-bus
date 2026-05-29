'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase/client';
import type { Profile, UserAppAccess } from './supabase/types';

type AuthRedirect = '/admin' | '/dashboard' | '/no-access' | '/auth/login' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  appAccess: UserAppAccess | null;
  loading: boolean;
  /** The canonical redirect destination determined after profile + access checks */
  authRedirect: AuthRedirect;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appAccess, setAppAccess] = useState<UserAppAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRedirect, setAuthRedirect] = useState<AuthRedirect>(null);

  function computeRedirect(p: Profile | null, access: UserAppAccess | null): AuthRedirect {
    if (!p) return '/auth/login';

    if (p.role === 'superadmin') {
      return '/admin'; 
    } 

    // role === 'user': must have active app access
    if (access && access.status === 'active') {
      return '/dashboard';
    }

    return '/no-access';
  }

  async function fetchProfileAndAccess(userId: string) {
    try {
      // Always fetch profile first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      setProfile(profileData);

      let accessData: UserAppAccess | null = null;

      // Only check user_app_access for non-superadmin users
      if (profileData && profileData.role !== 'superadmin') {
        const { data } = await supabase
          .from('user_app_access')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .maybeSingle();
        accessData = data;
      }

      setAppAccess(accessData);
      setAuthRedirect(computeRedirect(profileData, accessData));
    } catch (err) {
      console.error('Error loading auth data:', err);
      setAuthRedirect('/auth/login');
    }
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfileAndAccess(user.id);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndAccess(session.user.id).finally(() => setLoading(false));
      } else {
        setAuthRedirect('/auth/login');
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await fetchProfileAndAccess(session.user.id);
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setAppAccess(null);
        setAuthRedirect('/auth/login');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, appAccess, loading, authRedirect, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
