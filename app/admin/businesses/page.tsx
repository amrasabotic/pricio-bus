'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Search, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import type { PricioBusinesses } from '@/lib/supabase/types';
import Image from 'next/image';

interface BusinessWithEmail extends PricioBusinesses {
  owner_email?: string;
}

export default function AdminBusinessesPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    const { data } = await supabase
      .from('pricio_businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    // Enrich with owner emails from profiles
    const withEmails = await Promise.all(
      (data as PricioBusinesses[]).map(async (biz) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', biz.user_id)
          .maybeSingle();
        return { ...biz, owner_email: (profile as any)?.email };
      })
    );
    setBusinesses(withEmails);
    setLoading(false);
  }

  async function toggleStatus(biz: BusinessWithEmail) {
    if (!user) return;
    setToggling(biz.id);
    const newStatus = biz.status === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('pricio_businesses')
      .update({ status: newStatus })
      .eq('id', biz.id);

    if (error) {
      toast.error(error.message);
    } else {
      // Log admin action
      await supabase.from('pricio_admin_logs').insert({
        admin_id: user.id,
        action: `set_business_${newStatus}`,
        target_type: 'business',
        target_id: biz.id,
        metadata: { business_name: biz.name, previous_status: biz.status },
      });
      toast.success(`Business ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      loadBusinesses();
    }
    setToggling(null);
  }

  const filtered = businesses.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase()) ||
    b.owner_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Businesses
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage all businesses on the platform</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search by name, slug, or owner email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No businesses found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Business</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {biz.logo_url ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden relative flex-shrink-0 border border-slate-100">
                          <Image src={biz.logo_url} alt={biz.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-sm font-bold">{biz.name[0]}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{biz.name}</p>
                        <p className="text-xs text-slate-400 font-mono">/b/{biz.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-600">{biz.owner_email ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-600">{biz.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={biz.status === 'active'
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-100'
                    }>
                      {biz.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/b/${biz.slug}`} target="_blank">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(biz)}
                        disabled={toggling === biz.id}
                        className={`h-8 w-8 p-0 ${biz.status === 'active' ? 'text-green-500 hover:text-red-500' : 'text-slate-400 hover:text-green-500'}`}
                      >
                        {biz.status === 'active'
                          ? <ToggleRight className="w-4 h-4" />
                          : <ToggleLeft className="w-4 h-4" />
                        }
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
