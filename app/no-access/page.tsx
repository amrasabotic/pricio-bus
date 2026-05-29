'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { BarChart3, LockKeyhole } from 'lucide-react';

export default function NoAccessPage() {
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    window.location.href = '/auth/login';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">Pricio</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <LockKeyhole className="w-7 h-7 text-slate-500" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Required</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your account does not have an active subscription to Pricio. Please purchase a plan to continue.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/#pricing">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
                View plans
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full text-slate-600 hover:text-slate-900 h-11"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
