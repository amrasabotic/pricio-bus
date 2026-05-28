'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, UserPlus, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [registrationsEnabled, setRegistrationsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from('pricio_system_settings')
      .select('*');

    if (data) {
      const regSetting = data.find(d => d.key === 'registrations_enabled');
      const maintSetting = data.find(d => d.key === 'maintenance_mode');
      if (regSetting) setRegistrationsEnabled(regSetting.value === true || regSetting.value === 'true');
      if (maintSetting) setMaintenanceMode(maintSetting.value === true || maintSetting.value === 'true');
    }
    setLoading(false);
  }

  async function updateSetting(key: string, value: boolean) {
    if (!user) return;
    setSaving(key);
    const { error } = await supabase
      .from('pricio_system_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) {
      toast.error(error.message);
    } else {
      await supabase.from('pricio_admin_logs').insert({
        admin_id: user.id,
        action: 'update_system_setting',
        target_type: 'setting',
        target_id: key,
        metadata: { key, value },
      });
      toast.success('Setting saved');
    }
    setSaving(null);
  }

  async function toggleRegistrations(enabled: boolean) {
    setRegistrationsEnabled(enabled);
    await updateSetting('registrations_enabled', enabled);
  }

  async function toggleMaintenance(enabled: boolean) {
    setMaintenanceMode(enabled);
    await updateSetting('maintenance_mode', enabled);
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Global platform controls</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">New registrations</CardTitle>
                    <CardDescription className="text-sm mt-0.5">
                      Allow new users to create accounts on the platform
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={registrationsEnabled}
                  onCheckedChange={toggleRegistrations}
                  disabled={saving === 'registrations_enabled'}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-slate-500">
                When disabled, the registration form will show a message that signups are temporarily closed.
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${maintenanceMode ? 'border-amber-300 bg-amber-50' : 'border-slate-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${maintenanceMode ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <Wrench className={`w-4 h-4 ${maintenanceMode ? 'text-amber-600' : 'text-slate-600'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">Maintenance mode</CardTitle>
                    <CardDescription className="text-sm mt-0.5">
                      Show a maintenance page to all visitors
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={toggleMaintenance}
                  disabled={saving === 'maintenance_mode'}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {maintenanceMode ? (
                <p className="text-xs text-amber-700 font-medium">
                  Maintenance mode is currently ACTIVE. The platform is showing a maintenance message to visitors.
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  When enabled, all public pages will display a maintenance message. Admin access remains available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
