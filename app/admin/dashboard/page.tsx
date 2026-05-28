'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Users, Building2, Package, Eye, MousePointer, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GlobalStats {
  users: number;
  businesses: number;
  items: number;
  views: number;
  clicks: number;
}

interface ChartEntry {
  date: string;
  views: number;
  clicks: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<GlobalStats>({ users: 0, businesses: 0, items: 0, views: 0, clicks: 0 });
  const [chartData, setChartData] = useState<ChartEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [usersRes, bizRes, itemsRes, analyticsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('pricio_businesses').select('id', { count: 'exact' }),
      supabase.from('pricio_items').select('id', { count: 'exact' }),
      supabase.from('pricio_analytics').select('event_type, created_at'),
    ]);

    const analytics = analyticsRes.data ?? [];
    const views = analytics.filter(a => a.event_type === 'view').length;
    const clicks = analytics.filter(a => a.event_type !== 'view').length;

    setStats({
      users: usersRes.count ?? 0,
      businesses: bizRes.count ?? 0,
      items: itemsRes.count ?? 0,
      views,
      clicks,
    });

    const days: ChartEntry[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      const dayEvents = analytics.filter(a => a.created_at.startsWith(dateStr));
      days.push({
        date: label,
        views: dayEvents.filter(a => a.event_type === 'view').length,
        clicks: dayEvents.filter(a => a.event_type !== 'view').length,
      });
    }
    setChartData(days);
    setLoading(false);
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Global statistics across all businesses</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <StatCard icon={Users} label="Total users" value={stats.users} color="blue" />
            <StatCard icon={Building2} label="Businesses" value={stats.businesses} color="green" />
            <StatCard icon={Package} label="Total items" value={stats.items} color="amber" />
            <StatCard icon={Eye} label="Page views" value={stats.views} color="rose" />
            <StatCard icon={MousePointer} label="Total clicks" value={stats.clicks} color="slate" />
          </>
        )}
      </div>

      {/* Chart */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Platform activity — last 14 days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="clicks" fill="#22c55e" radius={[4, 4, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-100 text-slate-600',
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
