'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import type { PricioBusinesses } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Share2, Copy, Download, ExternalLink, QrCode, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SharePage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<PricioBusinesses | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('pricio_businesses')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setBusiness(data);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!business) return;
    generateQr();
  }, [business]);

  async function generateQr() {
    if (!business) return;
    setQrLoading(true);
    try {
      const QRCode = (await import('qrcode')).default;
      const url = `${window.location.origin}/b/${business.slug}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' },
      });
      setQrDataUrl(dataUrl);
    } catch {
      toast.error('Failed to generate QR code');
    }
    setQrLoading(false);
  }

  function handleCopy() {
    if (!business) return;
    const url = `${window.location.origin}/b/${business.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    if (!qrDataUrl || !business) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${business.slug}-qr.png`;
    a.click();
  }

  const publicUrl = business ? `${typeof window !== 'undefined' ? window.location.origin : ''}/b/${business.slug}` : '';

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Share2 className="w-6 h-6 text-blue-600" />
          Share your page
        </h1>
        <p className="text-slate-500 text-sm mt-1">Share your public price list with customers</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : business ? (
        <div className="space-y-6">
          {/* Public link card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-1">Public page link</h2>
            <p className="text-sm text-slate-500 mb-4">Share this link anywhere — no login required to view</p>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="font-mono text-sm bg-slate-50" />
              <Button variant="outline" onClick={handleCopy} className="gap-2 flex-shrink-0">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="mt-3">
              <Link href={`/b/${business.slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="gap-2 text-blue-600 hover:text-blue-700 p-0">
                  <ExternalLink className="w-4 h-4" />
                  Open public page
                </Button>
              </Link>
            </div>
          </div>

          {/* QR code card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                QR Code
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Print this QR code on receipts, menus, or your shop window</p>

            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                {qrLoading ? (
                  <div className="w-52 h-52 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="QR Code" className="w-52 h-52" />
                ) : null}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-slate-800">{business.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{publicUrl}</p>
              </div>

              <Button
                onClick={handleDownload}
                disabled={!qrDataUrl || qrLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR code (PNG)
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <h3 className="font-semibold text-blue-900 mb-3">Sharing tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Add the link to your Instagram bio so followers can see your prices
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Print the QR code and display it at your counter or on tables
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Send the link directly to customers on WhatsApp when they ask for prices
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
