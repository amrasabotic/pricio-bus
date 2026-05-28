'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { BarChart3, Eye, MessageCircle, Phone, Package, ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import type { PricioBusinesses } from '@/lib/supabase/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  views: number;
  whatsapp: number;
  calls: number;
  items: number;
}

interface ChartData {
  date: string;
  views: number;
  whatsapp: number;
  calls: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<PricioBusinesses | null>(null);
  const [stats, setStats] = useState<Stats>({ views: 0, whatsapp: 0, calls: 0, items: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    setLoading(true);

    const { data: biz } = await supabase
      .from('pricio_businesses')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!biz) { setLoading(false); return; }
    setBusiness(biz);

    const [analyticsRes, itemsRes] = await Promise.all([
      supabase
        .from('pricio_analytics')
        .select('event_type, created_at')
        .eq('business_id', biz.id),
      supabase
        .from('pricio_items')
        .select('id', { count: 'exact' })
        .eq('business_id', biz.id),
    ]);

    const analytics = analyticsRes.data ?? [];
    const itemCount = itemsRes.count ?? 0;

    const views = analytics.filter(a => a.event_type === 'view').length;
    const whatsapp = analytics.filter(a => a.event_type === 'whatsapp_click').length;
    const calls = analytics.filter(a => a.event_type === 'call_click').length;
    setStats({ views, whatsapp, calls, items: itemCount });

    // Build last 7 days chart
    const days: ChartData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en', { weekday: 'short' });
      const dayEvents = analytics.filter(a => a.created_at.startsWith(dateStr));
      days.push({
        date: label,
        views: dayEvents.filter(a => a.event_type === 'view').length,
        whatsapp: dayEvents.filter(a => a.event_type === 'whatsapp_click').length,
        calls: dayEvents.filter(a => a.event_type === 'call_click').length,
      });
    }
    setChartData(days);
    setLoading(false);
  }

  const publicUrl = business ? `${typeof window !== 'undefined' ? window.location.origin : ''}/b/${business.slug}` : '';

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {business ? `${business.name} · ${business.category}` : 'Loading...'}
          </p>
        </div>
        {business && (
          <Link href={`/b/${business.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View public page
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard icon={Eye} label="Total views" value={stats.views} color="blue" />
            <StatCard icon={MessageCircle} label="WhatsApp clicks" value={stats.whatsapp} color="green" />
            <StatCard icon={Phone} label="Call clicks" value={stats.calls} color="amber" />
            <StatCard icon={Package} label="Active items" value={stats.items} color="rose" />
          </>
        )}
      </div>

      {/* Chart */}
      <Card className="mb-8 border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Activity — last 7 days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="whatsapp" fill="#22c55e" radius={[4, 4, 0, 0]} name="WhatsApp" />
                <Bar dataKey="calls" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Calls" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/items">
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
            <Package className="w-5 h-5 text-blue-600 mb-3" />
            <p className="font-semibold text-slate-900 text-sm">Manage items</p>
            <p className="text-xs text-slate-500 mt-1">Add or edit your services and products</p>
          </div>
        </Link>
        <Link href="/dashboard/share">
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
            <BarChart3 className="w-5 h-5 text-green-600 mb-3" />
            <p className="font-semibold text-slate-900 text-sm">Share your page</p>
            <p className="text-xs text-slate-500 mt-1">Get your link and QR code</p>
          </div>
        </Link>
        <Link href="/dashboard/settings">
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
            <Eye className="w-5 h-5 text-amber-600 mb-3" />
            <p className="font-semibold text-slate-900 text-sm">Update settings</p>
            <p className="text-xs text-slate-500 mt-1">Edit your business profile</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center mb-3`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
