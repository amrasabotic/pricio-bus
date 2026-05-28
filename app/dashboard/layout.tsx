// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { supabase } from '@/lib/supabase/client';
// import { Sidebar } from '@/components/dashboard/sidebar';
// import type { PricioBusinesses } from '@/lib/supabase/types';
// import { Loader2 } from 'lucide-react';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const { user, profile, appAccess, loading } = useAuth();
//   const router = useRouter();
//   const [business, setBusiness] = useState<PricioBusinesses | null>(null);
//   const [businessLoading, setBusinessLoading] = useState(true);

//   // useEffect(() => {
//   //   if (loading) return;

//   //   if (!user) {
//   //     router.replace('/auth/login');
//   //     return;
//   //   }

//   //   if (!profile) {
//   //     router.replace('/auth/login');
//   //     return;
//   //   }

//   //   if (!appAccess || !appAccess.is_active) {
//   //     router.replace('/auth/login');
//   //     return;
//   //   }
//   // }, [user, profile, appAccess, loading, router]);

//   useEffect(() => {
//   // 1. Wait until the auth context finishes all initial loading
//   if (loading) return;

//   // 2. Critical Check: If no user is logged in, boot them out immediately
//   if (!user) {
//     router.replace('/auth/login');
//     return;
//   }

//   // 3. Conditional Check: Only redirect if profile/access loading is truly complete and invalid
//   // Assuming your useAuth provides a way to know if profile data is still fetching, 
//   // or checking if user exists but profile is explicitly missing after load.
//   if (user && (!profile || !appAccess || !appAccess.is_active)) {
//     // Optional: Add a small toast message here to see if this is triggering
//     router.replace('/auth/login');
//     return;
//   }
// }, [user, profile, appAccess, loading, router]);



  
// useEffect(() => {
//   if (loading) return;

//   // 1. Send unauthenticated users away immediately
//   if (!user || !profile) {
//     window.location.href = '/auth/login';
//     return;
//   }

//   // 2. If they have an app access record but it's deliberately disabled
//   if (appAccess && appAccess.is_active === false) {
//     window.location.href = '/auth/login?error=suspended';
//     return;
//   }
// }, [user, profile, appAccess, loading]);

// useEffect(() => {
//   if (!user || loading) return;

//   supabase
//     .from('pricio_businesses')
//     .select('*')
//     .eq('user_id', user.id)
//     .maybeSingle()
//     .then(({ data }) => {
//       setBusiness(data);
//       setBusinessLoading(false);

//       // If business isn't set up yet, route to onboarding safely
//       if (!data) {
//         router.replace('/onboarding');
//       }
//     });
// }, [user, loading, router]);



//   // if (loading || businessLoading) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//   //       <div className="flex flex-col items-center gap-3">
//   //         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//   //         <p className="text-slate-500 text-sm">Loading your dashboard...</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // if (!user || !profile || !appAccess?.is_active || !business) {
//   //   return null;
//   // }
//   // Change your final safety check to this:
// // 1. Keep the loading check exactly as it is
// if (loading || businessLoading) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <div className="flex flex-col items-center gap-3">
//         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//         <p className="text-slate-500 text-sm">Loading your dashboard...</p>
//       </div>
//     </div>
//   );
// }

// // 2. Handle the specific "No App Access" state gracefully instead of a blank screen
// if (!appAccess || !appAccess.is_active) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
//       <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
//         <h2 className="text-xl font-bold text-slate-900 mb-2">Access Suspended</h2>
//         <p className="text-slate-500 mb-6">Your account does not currently have active access to the Pricio app.</p>
//         <button 
//           onClick={() => router.replace('/auth/login')} 
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition"
//         >
//           Return to Login
//         </button>
//       </div>
//     </div>
//   );
// }

// // 3. Final catch-all for missing user, profile, or onboarding data
// if (!user || !profile || !business) {
//   return null;
// }


//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden">
//       <Sidebar businessName={business.name} />
//       <main className="flex-1 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// }







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

  // 1. Core Authentication & Authorization Route Guard
  useEffect(() => {
    if (loading) return;

    // Kick out unauthenticated users
    if (!user || !profile) {
      window.location.href = '/auth/login';
      return;
    }

    // Strict account suspension guard: Only blocks if appAccess explicitly exists and is false
    if (appAccess && appAccess.is_active === false) {
      window.location.href = '/auth/login?error=suspended';
      return;
    }
  }, [user, profile, appAccess, loading]);

  // 2. Business Fetching & Onboarding Router Guard
   // 2. Business Fetching & Onboarding Router Guard
  useEffect(() => {
    if (!user || loading) return;

    // Capture the ID in a stable variable to satisfy TypeScript
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

        // If no business profile is found, safely route to onboarding
        if (!data) {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error("Failed to fetch business:", error);
        setBusinessLoading(false);
      }
    }

    getBusinessData(currentUserId);
  }, [user, loading, router]);


  // 3. Global App Loading Screen UI
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

  // 4. Fallback Protection Layer
  if (!user || !profile) {
    return null;
  }

  // 5. Successful Render View Layout
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar businessName={business?.name ?? 'Pricio App'} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
