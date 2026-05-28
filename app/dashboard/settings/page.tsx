'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import type { PricioBusinesses } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Upload, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const BUSINESS_CATEGORIES = [
  'Salon & Beauty', 'Restaurant & Cafe', 'Barbershop', 'Spa & Wellness',
  'Fitness & Gym', 'Photography', 'Freelance Services', 'Repair Shop',
  'Bakery & Pastry', 'Cleaning Services', 'Tutoring & Education', 'Other',
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<PricioBusinesses | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('pricio_businesses')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setBusiness(data);
          setName(data.name);
          setCategory(data.category);
          setPhone(data.phone ?? '');
          setWhatsapp(data.whatsapp ?? '');
          setLocation(data.location ?? '');
          setLogoPreview(data.logo_url);
        }
        setLoading(false);
      });
  }, [user]);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Logo must be under 5MB'); return; }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!business || !user) return;
    setSaving(true);

    try {
      let logoUrl = business.logo_url;
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('pricio_business')
          .upload(path, logoFile, { upsert: true });
        if (!uploadErr) {
          const { data } = supabase.storage.from('pricio_business').getPublicUrl(path);
          logoUrl = data.publicUrl;
        }
      }

      const { error } = await supabase.from('pricio_businesses').update({
        name: name.trim(),
        category,
        phone: phone || null,
        whatsapp: whatsapp || null,
        location: location || null,
        logo_url: logoUrl,
      }).eq('id', business.id);

      if (error) toast.error(error.message);
      else toast.success('Settings saved');
    } catch {
      toast.error('Something went wrong');
    }
    setSaving(false);
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Business settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Update your business profile information</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative"
                onClick={() => fileRef.current?.click()}
              >
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-300" />
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Business logo</p>
                <p className="text-xs text-slate-500 mt-0.5">Click to upload. JPG, PNG, WebP up to 5MB</p>
                <Button type="button" variant="ghost" size="sm" className="p-0 h-auto text-blue-600 text-xs mt-1" onClick={() => fileRef.current?.click()}>
                  Change logo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                <Building2 className="w-4 h-4 inline mr-1.5" />
                Business name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Business category <span className="text-red-500">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone number</Label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+383 44 123 456" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp number</Label>
                <Input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+383 44 123 456" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Prishtina, Kosovo" />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Public URL</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">/b/{business?.slug}</p>
                </div>
                <p className="text-xs text-slate-400">Slug is permanent and cannot be changed</p>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save changes'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
