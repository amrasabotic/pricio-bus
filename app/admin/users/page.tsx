'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Shield, UserX } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile, UserAppAccess } from '@/lib/supabase/types';

interface UserWithAccess extends Profile {
  access?: UserAppAccess;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!profiles) { setLoading(false); return; }

    const withAccess = await Promise.all(
      profiles.map(async (p) => {
        const { data: access } = await supabase
          .from('user_app_access')
          .select('*')
          .eq('user_id', p.id)
          .eq('app_id', 'e15e8982-c70b-4507-ac76-b3159f956ec0')
          .maybeSingle();
        return { ...p, access: access ?? undefined };
      })
    );
    setUsers(withAccess);
    setLoading(false);
  }

  async function changeRole(userId: string, newRole: 'user' | 'superadmin') {
    if (!user) return;
    setUpdating(userId);
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) {
      toast.error(error.message);
    } else {
      await supabase.from('pricio_admin_logs').insert({
        admin_id: user.id,
        action: 'change_user_role',
        target_type: 'user',
        target_id: userId,
        metadata: { new_role: newRole },
      });
      toast.success('Role updated');
      loadUsers();
    }
    setUpdating(null);
  }

  async function revokeAccess(userId: string, currentActive: boolean) {
    if (!user) return;
    setUpdating(userId);
    const { error } = await supabase
      .from('user_app_access')
      .update({ is_active: !currentActive })
      .eq('user_id', userId)
      .eq('app_id', 'e15e8982-c70b-4507-ac76-b3159f956ec0');
    if (error) {
      toast.error(error.message);
    } else {
      await supabase.from('pricio_admin_logs').insert({
        admin_id: user.id,
        action: currentActive ? 'revoke_app_access' : 'restore_app_access',
        target_type: 'user',
        target_id: userId,
        metadata: {},
      });
      toast.success(currentActive ? 'Access revoked' : 'Access restored');
      loadUsers();
    }
    setUpdating(null);
  }

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Users
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform users, roles, and access</p>
      </div>

      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search by email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No users found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">App Access</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-600 text-sm font-semibold">{u.email[0].toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-slate-800 font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {u.role === 'superadmin' && <Shield className="w-3.5 h-3.5 text-blue-500" />}
                      <Select
                        value={u.role}
                        onValueChange={(val) => changeRole(u.id, val as 'user' | 'superadmin')}
                        disabled={updating === u.id || u.id === user?.id}
                      >
                        <SelectTrigger className="h-7 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="superadmin">Superadmin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <Badge className={u.access?.is_active !== false
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-red-100 text-red-600 hover:bg-red-100'
                    }>
                      {u.access?.is_active !== false ? 'Active' : 'Revoked'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeAccess(u.id, u.access?.is_active !== false)}
                        disabled={updating === u.id || u.id === user?.id}
                        className={`gap-1.5 text-xs ${u.access?.is_active !== false ? 'text-slate-400 hover:text-red-500' : 'text-slate-400 hover:text-green-500'}`}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        {u.access?.is_active !== false ? 'Revoke' : 'Restore'}
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
