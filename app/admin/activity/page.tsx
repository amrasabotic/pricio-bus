'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Activity, Search, Eye, MessageCircle, Phone, LogIn } from 'lucide-react';
import type { PricioAnalytics, PricioBusinesses } from '@/lib/supabase/types';

interface EnrichedLog extends PricioAnalytics {
  business_name?: string;
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  view: Eye,
  whatsapp_click: MessageCircle,
  call_click: Phone,
};

const EVENT_COLORS: Record<string, string> = {
  view: 'bg-blue-100 text-blue-700',
  whatsapp_click: 'bg-green-100 text-green-700',
  call_click: 'bg-amber-100 text-amber-700',
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<EnrichedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const { data } = await supabase
      .from('pricio_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!data) { setLoading(false); return; }

    // Enrich with business names
    const businessIds = (data as PricioAnalytics[])
      .map(d => d.business_id)
      .filter((id, idx, arr) => arr.indexOf(id) === idx);
    const { data: businessesRaw } = await supabase
      .from('pricio_businesses')
      .select('*')
      .in('id', businessIds as string[]);

    const businesses = (businessesRaw ?? []) as PricioBusinesses[];
    const bizMap = new Map(businesses.map(b => [b.id, b.name]));

    setLogs((data as PricioAnalytics[]).map(log => ({ ...log, business_name: bizMap.get(log.business_id) })));
    setLoading(false);
  }

  const filtered = logs.filter(log => {
    const matchesSearch = !search ||
      log.business_name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || log.event_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Activity Log
        </h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide event timeline</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by business name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All events</SelectItem>
            <SelectItem value="view">Page views</SelectItem>
            <SelectItem value="whatsapp_click">WhatsApp clicks</SelectItem>
            <SelectItem value="call_click">Call clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No activity found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((log) => {
              const Icon = EVENT_ICONS[log.event_type] ?? LogIn;
              const colorClass = EVENT_COLORS[log.event_type] ?? 'bg-slate-100 text-slate-600';
              return (
                <div key={log.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {log.business_name ?? 'Unknown business'}
                      </span>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {log.event_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <time className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </time>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
