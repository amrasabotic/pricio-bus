'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Link2, QrCode, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Pricio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-200 mb-8">
          <Zap className="w-3.5 h-3.5" />
          No technical skills required
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Your business prices,<br />
          <span className="text-blue-600">beautifully shared</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create a stunning digital price list or menu for your small business. Share with customers via a simple link or QR code — no app download needed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base">
              Create your price list
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="px-8 h-12 text-base">
              Sign in to dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to showcase your services</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Built for salons, restaurants, freelancers, and any small business that charges for services or products.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'Public menu page', desc: 'A beautiful, mobile-first page your customers can browse without any login or app install.', color: 'blue' },
            { icon: QrCode, title: 'QR code generator', desc: 'Print QR codes for your shop window, receipts, or business cards. Customers scan and see your prices instantly.', color: 'green' },
            { icon: Link2, title: 'Shareable link', desc: 'One clean URL to share on WhatsApp, Instagram bio, or anywhere online.', color: 'amber' },
            { icon: BarChart3, title: 'Analytics dashboard', desc: 'See how many people viewed your price list, clicked to call, or messaged on WhatsApp.', color: 'rose' },
            { icon: Shield, title: 'Always secure', desc: 'Your data is protected with enterprise-grade security. Row-level access means only you can edit your listings.', color: 'slate' },
            { icon: Zap, title: 'Instant setup', desc: 'Go from signup to a live page in under 2 minutes. No tech skills, no credit card required.', color: 'orange' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-blue-600 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to share your prices?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">Join hundreds of small businesses already using Pricio to share their services digitally.</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 h-12 text-base font-semibold">
              Start for free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Pricio</span>
          </div>
          <p className="text-sm text-slate-500">Digital price lists for small businesses</p>
        </div>
      </footer>
    </div>
  );
}
