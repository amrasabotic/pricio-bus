'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Sidebar } from '@/components/dashboard/sidebar';
import type { PricioBusinesses } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, appAccess, loading } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<PricioBusinesses | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);

  // Step 1: Role-based access guard — runs once auth context is ready
  useEffect(() => {
    if (loading) return;

    if (!user || !profile) {
      router.replace('/auth/login');
      return;
    }

    // Superadmins must go to /admin, not dashboard
    if (profile.role === 'superadmin') {
      router.replace('/admin');
      return;
    }

    // role === 'user': require active app access
    if (!appAccess || appAccess.status !== 'active') {
      router.replace('/no-access');
      return;
    }
  }, [user, profile, appAccess, loading, router]);

  // Step 2: Fetch business data only for authenticated, authorized users
  useEffect(() => {
    if (loading) return;
    if (!user || !profile || profile.role === 'superadmin') return;
    if (!appAccess || appAccess.status !== 'active') return;

    const currentUserId = user.id;

    async function getBusinessData(userId: string) {
      try {
        const { data, error } = await supabase
          .from('pricio_businesses')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        setBusiness(data);
        setBusinessLoading(false);

        if (!data) {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Failed to fetch business:', error);
        setBusinessLoading(false);
      }
    }

    getBusinessData(currentUserId);
  }, [user, profile, appAccess, loading, router]);

  if (loading || businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role === 'superadmin' || appAccess?.status !== 'active') {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar businessName={business?.name ?? 'Pricio App'} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
