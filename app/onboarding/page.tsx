'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { generateSlug, generateSlugWithSuffix } from '@/lib/slug';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Upload, Loader2, Building2, Phone, MapPin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const BUSINESS_CATEGORIES = [
  'Salon & Beauty',
  'Restaurant & Cafe',
  'Barbershop',
  'Spa & Wellness',
  'Fitness & Gym',
  'Photography',
  'Freelance Services',
  'Repair Shop',
  'Bakery & Pastry',
  'Cleaning Services',
  'Tutoring & Education',
  'Other',
];

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo must be under 5MB');
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function getUniqueSlug(businessName: string): Promise<string> {
    const base = generateSlug(businessName);
    const { data } = await supabase
      .from('pricio_businesses')
      .select('slug')
      .eq('slug', base)
      .maybeSingle();

    if (!data) return base;

    // Try with suffix
    for (let i = 0; i < 5; i++) {
      const slug = generateSlugWithSuffix(businessName);
      const { data: existing } = await supabase
        .from('pricio_businesses')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();
      if (!existing) return slug;
    }
    return `${base}-${Date.now()}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !category) {
      toast.error('Business name and category are required');
      return;
    }
    setLoading(true);

    try {
      let logoUrl: string | null = null;

      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('pricio_business')
          .upload(path, logoFile, { upsert: true });

        if (uploadError) {
          toast.error('Failed to upload logo: ' + uploadError.message);
          setLoading(false);
          return;
        }
        const { data: urlData } = supabase.storage.from('pricio_business').getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }

      const slug = await getUniqueSlug(name);

      const { error } = await supabase.from('pricio_businesses').insert({
        user_id: user.id,
        name: name.trim(),
        slug,
        category,
        logo_url: logoUrl,
        phone: phone || null,
        whatsapp: whatsapp || null,
        location: location || null,
        status: 'active',
      });

      if (error) {
        toast.error('Failed to create business: ' + error.message);
        setLoading(false);
        return;
      }

      await refreshProfile();
      toast.success('Business created! Welcome to Pricio.');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Pricio</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Set up your business</h1>
          <p className="text-slate-500 mt-1">This info will appear on your public price list page</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleLogoChange}
                />
              </div>
              <span className="text-sm text-slate-500">Upload business logo (optional)</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                <Building2 className="w-4 h-4 inline mr-1.5" />
                Business name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Elite Salon Prishtina"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {name && (
                <p className="text-xs text-slate-500">
                  Your page will be at: <span className="font-mono text-blue-600">pricio.app/b/{generateSlug(name)}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Business category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-1.5" />
                  Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+383 44 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">
                  <MessageCircle className="w-4 h-4 inline mr-1.5" />
                  WhatsApp number
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+383 44 123 456"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="w-4 h-4 inline mr-1.5" />
                Location (optional)
              </Label>
              <Input
                id="location"
                placeholder="e.g. Prishtina, Kosovo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating your page...</>
              ) : (
                'Create my price list page'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
