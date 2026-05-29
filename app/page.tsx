// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { BarChart3, Link2, QrCode, Shield, Zap, Globe } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// export default function HomePage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user) {
//       router.push('/dashboard');
//     }
//   }, [user, loading, router]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//               <BarChart3 className="w-4 h-4 text-white" />
//             </div>
//             <span className="text-xl font-bold text-slate-900">Pricio</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link href="/auth/login">
//               <Button variant="ghost" size="sm">Sign in</Button>
//             </Link>
//             <Link href="/auth/register">
//               <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get started free</Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
//         <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-200 mb-8">
//           <Zap className="w-3.5 h-3.5" />
//           No technical skills required
//         </div>
//         <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
//           Your business prices,<br />
//           <span className="text-blue-600">beautifully shared</span>
//         </h1>
//         <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
//           Create a stunning digital price list or menu for your small business. Share with customers via a simple link or QR code — no app download needed.
//         </p>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           <Link href="/auth/register">
//             <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base">
//               Create your price list
//             </Button>
//           </Link>
//           <Link href="/auth/login">
//             <Button size="lg" variant="outline" className="px-8 h-12 text-base">
//               Sign in to dashboard
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to showcase your services</h2>
//           <p className="text-slate-600 max-w-xl mx-auto">Built for salons, restaurants, freelancers, and any small business that charges for services or products.</p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[
//             { icon: Globe, title: 'Public menu page', desc: 'A beautiful, mobile-first page your customers can browse without any login or app install.', color: 'blue' },
//             { icon: QrCode, title: 'QR code generator', desc: 'Print QR codes for your shop window, receipts, or business cards. Customers scan and see your prices instantly.', color: 'green' },
//             { icon: Link2, title: 'Shareable link', desc: 'One clean URL to share on WhatsApp, Instagram bio, or anywhere online.', color: 'amber' },
//             { icon: BarChart3, title: 'Analytics dashboard', desc: 'See how many people viewed your price list, clicked to call, or messaged on WhatsApp.', color: 'rose' },
//             { icon: Shield, title: 'Always secure', desc: 'Your data is protected with enterprise-grade security. Row-level access means only you can edit your listings.', color: 'slate' },
//             { icon: Zap, title: 'Instant setup', desc: 'Go from signup to a live page in under 2 minutes. No tech skills, no credit card required.', color: 'orange' },
//           ].map(({ icon: Icon, title, desc, color }) => (
//             <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
//               <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}>
//                 <Icon className={`w-5 h-5 text-${color}-600`} />
//               </div>
//               <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
//               <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
//         <div className="bg-blue-600 rounded-3xl p-12">
//           <h2 className="text-3xl font-bold text-white mb-4">Ready to share your prices?</h2>
//           <p className="text-blue-100 mb-8 max-w-md mx-auto">Join hundreds of small businesses already using Pricio to share their services digitally.</p>
//           <Link href="/auth/register">
//             <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 h-12 text-base font-semibold">
//               Start for free
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-200 py-8 mt-4">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
//               <BarChart3 className="w-3 h-3 text-white" />
//             </div>
//             <span className="font-semibold text-slate-900">Pricio</span>
//           </div>
//           <p className="text-sm text-slate-500">Digital price lists for small businesses</p>
//         </div>
//       </footer>
//     </div>
//   );
// }




'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  BarChart3,
  Link2,
  QrCode,
  Shield,
  Zap,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTheme, setActiveTheme] =
    useState<'minimal' | 'dark' | 'retro'>('minimal');

  const [customSlug, setCustomSlug] = useState('my-business');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
  navigator.clipboard.writeText(`pricio.menu/${customSlug}`);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  const [menuUpdates, setMenuUpdates] = useState(4);
  const [usePrinted, setUsePrinted] = useState(true);



  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50 text-slate-900">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Pricio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>

            <Link href="/auth/register">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO (redesigned) */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-2 lg:pt-28">
        {/* Left content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Zap className="h-4 w-4" />
            Modern pricing pages for small businesses
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
            Turn your services into a{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              beautiful digital menu
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Create a clean, shareable price list in minutes. Send it via link or
            QR code and let customers explore your offers instantly.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="h-12 bg-blue-600 px-6 text-white hover:bg-blue-700"
              >
                Create your page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-12 px-6">
                View dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
            <span>✔ No credit card</span>
            <span>✔ Setup in 2 minutes</span>
            <span>✔ Mobile-first</span>
          </div>
        </div>

        {/* Right visual mockup */}
        <div className="relative z-10">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-blue-200 to-indigo-200 blur-2xl opacity-60" />

            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 p-4">
                <div className="h-3 w-3 rounded-full bg-red-400 inline-block mr-1" />
                <div className="h-3 w-3 rounded-full bg-yellow-400 inline-block mr-1" />
                <div className="h-3 w-3 rounded-full bg-green-400 inline-block" />
              </div>

              <div className="p-6 space-y-4">
                <div className="h-4 w-2/3 rounded bg-slate-100" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between rounded-xl border border-slate-100 p-3">
                    <span className="text-sm">Haircut</span>
                    <span className="text-sm font-medium">€12</span>
                  </div>
                  <div className="flex justify-between rounded-xl border border-slate-100 p-3">
                    <span className="text-sm">Beard trim</span>
                    <span className="text-sm font-medium">€8</span>
                  </div>
                  <div className="flex justify-between rounded-xl border border-slate-100 p-3">
                    <span className="text-sm">Full service</span>
                    <span className="text-sm font-medium">€18</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-blue-50 p-3 text-blue-700">
                  <span className="text-sm font-medium">Scan QR to view</span>
                  <QrCode className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">
            Everything you need to look professional
          </h2>
          <p className="mt-3 text-slate-600">
            Built for modern small businesses that want to look premium online.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Globe,
              title: 'Public page',
              desc: 'A fast, clean page optimized for mobile and sharing.',
            },
            {
              icon: QrCode,
              title: 'QR codes',
              desc: 'Let customers scan and instantly view your prices.',
            },
            {
              icon: Link2,
              title: 'Share anywhere',
              desc: 'One link for Instagram, WhatsApp, or your website.',
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              desc: 'See views, clicks, and customer engagement.',
            },
            {
              icon: Shield,
              title: 'Secure by design',
              desc: 'Only you control and edit your content.',
            },
            {
              icon: Zap,
              title: 'Instant setup',
              desc: 'Go live in under 2 minutes.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

            {/* INTERACTIVE CUSTOMIZER SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          {/* Text Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Live Preview Engine
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Match your menu to your exact brand vibe
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Don't settle for boring lists. Swap themes, adjust fonts, and instantly preview how your pricing page renders on mobile screens.
            </p>

            {/* Theme Buttons */}
            <div className="space-y-3 pt-2">
              {[
                { id: 'minimal' as const, name: 'Minimal Clean', desc: 'Perfect for upscale salons & aesthetics' },
                { id: 'dark' as const, name: 'Midnight Matte', desc: 'Sleek dark mode for modern cocktail bars' },
                { id: 'retro' as const, name: 'Cyber Neon', desc: 'High energy style for streetwear & creators' },
              ].map((theme) => {
                const isSelected = activeTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`w-full text-left p-4.5 rounded-xl border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-md'
                        : 'border-slate-200/80 bg-white shadow-sm hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-semibold text-sm transition-colors ${
                          isSelected ? 'text-blue-600' : 'text-slate-800'
                        }`}
                      >
                        {theme.name}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 transition-all ${
                          isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{theme.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mockup Preview */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-[2.5rem] border-[7px] border-slate-900 bg-slate-900 p-3 shadow-2xl">
              <div
                className={`rounded-[2rem] p-5 min-h-[480px] relative overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
                  activeTheme === 'minimal'
                    ? 'bg-stone-50 text-stone-900'
                    : activeTheme === 'dark'
                    ? 'bg-neutral-950 text-neutral-100'
                    : 'bg-slate-900 text-cyan-400 font-mono'
                }`}
              >
                <div>
                  {/* Header */}
                  <div
                    className={`flex justify-between items-center mb-8 border-b pb-4 ${
                      activeTheme === 'minimal'
                        ? 'border-stone-200'
                        : activeTheme === 'dark'
                        ? 'border-neutral-800'
                        : 'border-pink-500/30'
                    }`}
                  >
                    <div>
                      <h4
                        className={`text-lg font-bold tracking-tight ${
                          activeTheme === 'retro' ? 'text-pink-500 uppercase italic' : ''
                        }`}
                      >
                        {activeTheme === 'minimal'
                          ? 'The Atelier'
                          : activeTheme === 'dark'
                          ? 'Bar Noir'
                          : 'Retro Arcade'}
                      </h4>

                      <p
                        className={`text-[10px] ${
                          activeTheme === 'minimal' ? 'text-stone-500' : 'text-slate-400'
                        }`}
                      >
                        {activeTheme === 'minimal'
                          ? 'Boutique Hair Salon'
                          : activeTheme === 'dark'
                          ? 'Craft Cocktails'
                          : 'Gaming & Apparel'}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        activeTheme === 'minimal'
                          ? 'bg-stone-200 text-stone-700'
                          : activeTheme === 'dark'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      Open
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {(activeTheme === 'minimal'
                      ? [
                          { name: 'Couture Haircut', price: '€45' },
                          { name: 'Balayage Glossing', price: '€120' },
                          { name: 'Deep Conditioning', price: '€35' },
                        ]
                      : activeTheme === 'dark'
                      ? [
                          { name: 'Smoked Old Fashioned', price: '€14' },
                          { name: 'Espresso Martini', price: '€12' },
                          { name: 'Truffle Pomme Frites', price: '€9' },
                        ]
                      : [
                          { name: 'Hourly Console Play', price: '$10' },
                          { name: 'Vintage Graphic Tee', price: '$35' },
                          { name: 'Classic Retro Token', price: '$2' },
                        ]
                    ).map((item, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center p-3 rounded-xl border ${
                          activeTheme === 'minimal'
                            ? 'bg-white border-stone-200 text-stone-800'
                            : activeTheme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800/80 text-neutral-200'
                            : 'bg-slate-950 border-pink-500/40 text-cyan-300 shadow-[0_0_10px_rgba(236,72,153,0.1)]'
                        }`}
                      >
                        <span className="text-xs font-medium">{item.name}</span>
                        <span
                          className={`text-xs font-bold ${
                            activeTheme === 'minimal'
                              ? 'text-stone-900'
                              : activeTheme === 'dark'
                              ? 'text-amber-400'
                              : 'text-pink-500'
                          }`}
                        >
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer QR */}
                <div
                  className={`mt-6 flex items-center justify-between rounded-xl p-3 ${
                    activeTheme === 'minimal'
                      ? 'bg-stone-900 text-stone-100'
                      : activeTheme === 'dark'
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]'
                  }`}
                >
                  <div>
                    <p className="text-[11px] font-bold">Instantly Live</p>
                    <p
                      className={`text-[9px] ${
                        activeTheme === 'minimal'
                          ? 'text-stone-400'
                          : activeTheme === 'dark'
                          ? 'text-neutral-800'
                          : 'text-pink-100'
                      }`}
                    >
                      pricio.menu/preview
                    </p>
                  </div>
                  <QrCode className="h-5 w-5 opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INNOVATIVE ROI & GROWTH SIMULATOR */}
<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 border-t border-slate-100 relative">
  {/* Soft Decorative Ambient Glow */}
  <div className="absolute right-1/4 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl" />

  <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
    
    {/* Left Column: Context & Interactive Controls */}
    <div className="lg:col-span-5 space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        📊 Menu Efficiency Calculator
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Calculate your menu overhead costs
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Changing prices or editing services shouldn't mean re-printing hundreds of cardstocks or wrestling with bloated web developers. See how much friction you eliminate.
      </p>

      {/* Interactive Form Controls Box */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
        
        {/* Control 1: Menu updates slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-700">Menu updates per year:</span>
            <span className="font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">
              {menuUpdates} {menuUpdates === 1 ? 'time' : 'times'}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="12" 
            value={menuUpdates} 
            onChange={(e) => setMenuUpdates(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1/yr (Rarely)</span>
            <span>6/yr (Bi-Monthly)</span>
            <span>12/yr (Monthly)</span>
          </div>
        </div>

        {/* Control 2: Menu Type Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-50">
          <label className="text-sm font-medium text-slate-700 block">Your current setup format:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUsePrinted(true)}
              className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                usePrinted 
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              📄 Paper or Static PDF
            </button>
            <button
              type="button"
              onClick={() => setUsePrinted(false)}
              className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                !usePrinted 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              ⚡ Instant Digital Link
            </button>
          </div>
        </div>

      </div>
    </div>

    {/* Right Column: Dynamic Data Telemetry Telemetry Box */}
    <div className="lg:col-span-7 flex justify-center lg:justify-end">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
        
        {/* Box Left Side: Hours Wasted Metric */}
        <div className="bg-slate-50 rounded-2xl p-5 flex flex-col justify-between group">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Estimated Friction</span>
            <h4 className="text-lg font-bold text-slate-800 mt-1">Time Wasted Yearly</h4>
          </div>
          <div className="my-6">
            {/* Dynamic Math: Printed/PDF takes approx 3 hours per update cycle vs 0.1 hours on Pricio */}
            <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-950 transition-all">
              {usePrinted ? menuUpdates * 3 : Math.max(1, Math.round(menuUpdates * 0.1 * 10) / 10)}
            </span>
            <span className="text-sm font-semibold text-slate-500 ml-1">hours</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {usePrinted 
              ? "Spent adjusting formatting, exporting layouts, re-uploading files, or re-printing physical stock templates." 
              : "Spent typing simple changes directly into your dashboard phone app. Changes push live instantly."
            }
          </p>
        </div>

        {/* Box Right Side: Cash Overhead Cost Metric */}
        <div className="bg-blue-600/5 rounded-2xl border border-blue-500/10 p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 group-hover:scale-110 transition-transform duration-500" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">Financial Overhead</span>
            <h4 className="text-lg font-bold text-slate-800 mt-1">Estimated Cost</h4>
          </div>
          <div className="my-6">
            {/* Dynamic Math: Printed paper/pro designer design cycles cost approx €40/update vs €0 to €9 flat price */}
            <span className="text-4xl font-extrabold font-mono tracking-tight text-blue-600 transition-all">
              €{usePrinted ? menuUpdates * 45 : 0}
            </span>
            <span className="text-xs font-semibold text-blue-500/80 bg-blue-500/10 px-1.5 py-0.5 rounded ml-2">
              {usePrinted ? 'Overhead/yr' : 'Pricio Free'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {usePrinted 
              ? "Includes estimated tracking variables for basic printing ink, specialized cardstock materials, or graphic hire expenses."
              : "Zero operational baseline setup costs. You only pay if you choose to upgrade to our premium theme layout models."
            }
          </p>
        </div>

        {/* Bottom Banner Summary Element */}
        <div className="sm:col-span-2 border-t border-slate-100 pt-5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${usePrinted ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            {usePrinted ? 'Sub-optimal operational workflow' : 'Maximum optimization active'}
          </span>
          <span className="font-mono text-[11px]">ALGORITHM V2.1</span>
        </div>

      </div>
    </div>

  </div>
</section>


      {/* SECTION 1: TRUST & SOCIAL PROOF SOCIAL MATRIX */}
<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-b border-slate-100">
  {/* Micro Metrics Trust Sub-bar */}
  <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 rounded-2xl bg-slate-50 border border-slate-100 px-6 py-4 text-center sm:text-left">
    <div className="flex items-center gap-3">
      <p className="text-3xl font-extrabold font-mono tracking-tight text-blue-600">4.2M+</p>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Total Menu<br />Views Served</p>
    </div>
    <div className="h-8 w-px bg-slate-200 hidden md:block" />
    <div className="flex items-center gap-3">
      <p className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">18K+</p>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Scanned Items<br />Every Day</p>
    </div>
    <div className="h-8 w-px bg-slate-200 hidden md:block" />
    <div className="flex items-center gap-3">
      <p className="text-3xl font-extrabold font-mono tracking-tight text-indigo-600">4.9/5</p>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight">Business<br />Owner Rating</p>
    </div>
  </div>

  {/* Live Dynamic Testimonial Cards */}
  <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[
      {
        quote: "I used to pay a developer €50 every time our seasonal treatment rates changed. Now I update my phone in the car and it fixes our menu instantly.",
        author: "Marcus Vance",
        role: "Owner, Obsidian Grooming",
        industry: "Salons & Barbers",
        color: "bg-blue-600"
      },
      {
        quote: "No app downloads, no clumsy zoomable PDF menus. Clients just hold up their cameras at the tables and see everything beautifully formatted for their devices.",
        author: "Clara Chen",
        role: "Manager, Sonder Coffee",
        industry: "Cafes & Dining",
        color: "bg-emerald-600"
      },
      {
        quote: "Sending a clean pricing page via text message looks infinitely better than typing a paragraph of prices. My customer booking rate doubled in 2 weeks.",
        author: "Sarah Jenkins",
        role: "Freelance Aesthetician",
        industry: "Independent Pros",
        color: "bg-indigo-600"
      }
    ].map((t, idx) => (
      <div key={idx} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative">
        <span className="absolute top-4 right-5 text-2xl font-serif text-slate-200 select-none font-black leading-none">”</span>
        <div className="space-y-4">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {t.industry}
          </span>
          <p className="text-sm leading-relaxed text-slate-600 italic">
            "{t.quote}"
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-50">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase ${t.color}`}>
            {t.author.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t.author}</h4>
            <p className="text-xs text-slate-400">{t.role}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>



      {/* SECTION 2: PROBLEM VS SOLUTION HOOK */}
<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 border-t border-slate-100">
  <div className="text-center max-w-2xl mx-auto mb-16">
    <span className="text-xs font-bold uppercase tracking-widest text-rose-500">The Hard Reality</span>
    <h2 className="text-3xl font-semibold text-slate-900 tracking-tight sm:text-4xl mt-2">
      Websites are bloated. PDFs are broken.
    </h2>
    <p className="mt-3 text-slate-600">
      Your customers don't want to dig through complex homepages or pinch-to-zoom random documents just to see what your services cost.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
    {/* Broken Pain Point Box */}
    <div className="rounded-3xl border border-rose-100 bg-rose-50/20 p-8 space-y-6 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-lg select-none">✕</div>
        <h3 className="text-xl font-bold text-slate-900">The Old Friction Method</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Using outdated file updates or unoptimized layouts hurts your reputation and lowers conversions.
        </p>
        <ul className="space-y-3 pt-2 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <span className="text-rose-500 font-bold select-none">🚩</span>
            <span><strong>Pinch-and-Zoom PDFs:</strong> Unreadable on standard smartphones. Slow files require tedious cell data to download.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-rose-500 font-bold select-none">🚩</span>
            <span><strong>Fragile Paper Overhead:</strong> Every single pricing update forces you to throw away materials and spend money reprinting sheets.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-rose-500 font-bold select-none">🚩</span>
            <span><strong>Complex Web Builders:</strong> Editing simple text cards shouldn't require fixing broken WordPress setups or waiting on engineers.</span>
          </li>
        </ul>
      </div>
      <p className="text-xs font-medium text-rose-600 font-mono tracking-wide uppercase bg-rose-50 px-3 py-1 rounded-lg inline-block w-fit">Result: Lost interest & drop-offs</p>
    </div>

    {/* Elegant Pricio Fix Box */}
    <div className="rounded-3xl border-2 border-blue-600 bg-white p-8 space-y-6 flex flex-col justify-between shadow-xl shadow-blue-50 relative">
      <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 shadow-sm">The Upgrade</div>
      <div className="space-y-4">
        <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm select-none">✓</div>
        <h3 className="text-xl font-bold text-slate-900">The Modern Digital Menu</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Pricio streamlines everything by prioritizing mobile delivery parameters designed strictly for speed and visibility.
        </p>
        <ul className="space-y-3 pt-2 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold select-none">✦</span>
            <span><strong>Mobile-First Native:</strong> Fluidly shapes down to any device screen size. Renders beautifully like an app menu.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold select-none">✦</span>
            <span><strong>Instant Dashboard Sync:</strong> Modify your titles, services, or prices using your smartphone and instantly update live menus.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold select-none">✦</span>
            <span><strong>One-Scan Deployments:</strong> Permanent print codes and link URLs that never expire, even when you change values completely.</span>
          </li>
        </ul>
      </div>
      <p className="text-xs font-medium text-emerald-600 font-mono tracking-wide uppercase bg-emerald-50 px-3 py-1 rounded-lg inline-block w-fit">Result: Frictionless, faster booking</p>
    </div>
  </div>
</section>


      {/* SECTION 3: USE-CASE STORYTELLING SCENARIOS */}
<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 border-t border-slate-100">
  <div className="text-center max-w-2xl mx-auto mb-16">
    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Real Scenarios</span>
    <h2 className="text-3xl font-semibold text-slate-900 tracking-tight sm:text-4xl mt-2">
      Built for the way you operate your business
    </h2>
    <p className="mt-3 text-slate-600">
      See how independent operators integrate clean menus into their active daily communication routines.
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {[
      {
        badge: "Salons & Studios",
        title: "The Station Companion",
        context: "Instead of cluttering mirrors or reception counters with greasy printed laminates, place a custom vector QR badge right at your workstation.",
        impact: "Clients scan your code during their appointments, discover premium upgrade offers organically, and request addon services without any hard sales pitches.",
        flow: "Workstation Sticker ➔ QR Scan ➔ Service Upsell"
      },
      {
        badge: "Boutique Cafes & Bars",
        title: "The Dynamic Quick Menu",
        context: "When daily craft ingredients shift or specialized price parameters move, stop stressing about obsolete printed drink lists.",
        impact: "Adjust your catalog items on your dashboard between shifts. Your physical storefront menus update immediately, protecting you from pricing mistakes.",
        flow: "Dashboard Edit ➔ Real-time Sync ➔ Live Table Update"
      },
      {
        badge: "Freelancers & Coaches",
        title: "The Social Profile Closer",
        context: "Stop answering repetitive pricing questions in your Instagram DMs or WhatsApp catalog chat boxes.",
        impact: "Drop your custom short handle link directly in your profile bio. Prospects scan clean service rates instantly, reducing long discovery calls.",
        flow: "Social Bio Link ➔ Clean Presentation ➔ Instant Intent"
      }
    ].map((uc, idx) => (
      <div key={idx} className="flex flex-col justify-between bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
        <div className="space-y-4">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {uc.badge}
          </span>
          <h3 className="text-xl font-bold text-slate-900">{uc.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {uc.context}
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-800 block mb-1">Business Impact:</strong>
            {uc.impact}
          </div>
        </div>

        {/* Tactical Pipeline Footer graphic inside the card */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Operational pipeline:</div>
          <div className="text-xs font-semibold text-slate-700 font-sans tracking-tight bg-slate-50/50 p-2 rounded-lg text-center border border-dashed border-slate-200">
            {uc.flow}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-semibold">
            Start building your digital menu today
          </h2>

          <p className="mt-3 text-blue-100">
            Join small businesses already upgrading their online presence.
          </p>

          <div className="mt-8">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-slate-500 sm:px-6">
          <div className="flex items-center gap-2 text-slate-900">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Pricio</span>
          </div>

          <span>Digital price lists for modern businesses</span>
        </div>
      </footer>
    </div>
  );
}

