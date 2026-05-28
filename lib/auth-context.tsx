'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase/client';
import type { Profile, UserAppAccess } from './supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  appAccess: UserAppAccess | null;
  loading: boolean;
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

  // async function fetchProfile(userId: string) {
  //   const { data: profileData } = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .eq('id', userId)
  //     .maybeSingle();

  //   const { data: accessData } = await supabase
  //     .from('user_app_access')
  //     .select('*')
  //     .eq('user_id', userId)
  //     .eq('app_id', 'e15e8982-c70b-4507-ac76-b3159f956ec0')
  //     .maybeSingle();

  //   setProfile(profileData);
  //   setAppAccess(accessData);
  // }

  async function fetchProfile(userId: string) {
  try {
    const [profileRes, accessRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('user_app_access').select('*').eq('user_id', userId).maybeSingle()
    ]);

    setProfile(profileRes.data);
    setAppAccess(accessRes.data);
  } catch (err) {
    console.error("Error loading auth data profile:", err);
  }
}

  

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await fetchProfile(session.user.id);
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setAppAccess(null);
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
    <AuthContext.Provider value={{ user, session, profile, appAccess, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
