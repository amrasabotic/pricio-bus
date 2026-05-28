'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import type { PricioBusinesses, PricioCategories, PricioItems } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Pencil, Trash2, Upload, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ItemsPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<PricioBusinesses | null>(null);
  const [categories, setCategories] = useState<PricioCategories[]>([]);
  const [items, setItems] = useState<PricioItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<PricioItems | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    const { data: biz } = await supabase
      .from('pricio_businesses')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!biz) { setLoading(false); return; }
    setBusiness(biz);

    const [catsRes, itemsRes] = await Promise.all([
      supabase.from('pricio_categories').select('*').eq('business_id', biz.id).order('order_index'),
      supabase.from('pricio_items').select('*').eq('business_id', biz.id).order('order_index'),
    ]);
    setCategories(catsRes.data ?? []);
    setItems(itemsRes.data ?? []);
    setLoading(false);
  }

  function openCreate() {
    setEditItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCategoryId('');
    setFormActive(true);
    setFormImageFile(null);
    setFormImagePreview(null);
    setDialogOpen(true);
  }

  function openEdit(item: PricioItems) {
    setEditItem(item);
    setFormName(item.name);
    setFormDesc(item.description ?? '');
    setFormPrice(String(item.price));
    setFormCategoryId(item.category_id ?? '');
    setFormActive(item.is_active);
    setFormImageFile(null);
    setFormImagePreview(item.image_url);
    setDialogOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setFormImageFile(file);
    setFormImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File, itemId: string): Promise<string | null> {
    if (!business) return null;
    const ext = file.name.split('.').pop();
    const path = `${business.id}/${itemId}.${ext}`;
    const { error } = await supabase.storage.from('pricio_products').upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from('pricio_products').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSave() {
    if (!business || !formName.trim() || !formPrice) return;
    setSaving(true);

    const price = parseFloat(formPrice);
    if (isNaN(price) || price < 0) { toast.error('Enter a valid price'); setSaving(false); return; }

    try {
      if (editItem) {
        let imageUrl = editItem.image_url;
        if (formImageFile) {
          imageUrl = await uploadImage(formImageFile, editItem.id);
        }
        const { error } = await supabase.from('pricio_items').update({
          name: formName.trim(),
          description: formDesc || null,
          price,
          category_id: formCategoryId === 'none' ? null : formCategoryId || null,
          is_active: formActive,
          image_url: imageUrl,
        }).eq('id', editItem.id);
        if (error) { toast.error(error.message); }
        else { toast.success('Item updated'); }
      } else {
        const maxOrder = items.reduce((m, i) => Math.max(m, i.order_index), -1);
        const { data: newItem, error } = await supabase.from('pricio_items').insert({
          business_id: business.id,
          name: formName.trim(),
          description: formDesc || null,
          price,
          category_id: formCategoryId === 'none' ? null : formCategoryId || null,
          is_active: formActive,
          order_index: maxOrder + 1,
        }).select().single();

        if (error) { toast.error(error.message); }
        else {
          if (formImageFile && newItem) {
            const imageUrl = await uploadImage(formImageFile, newItem.id);
            if (imageUrl) {
              await supabase.from('pricio_items').update({ image_url: imageUrl }).eq('id', newItem.id);
            }
          }
          toast.success('Item created');
        }
      }
    } catch {
      toast.error('Something went wrong');
    }

    setSaving(false);
    setDialogOpen(false);
    loadData();
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    const { error } = await supabase.from('pricio_items').delete().eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Item deleted');
    setDeleteId(null);
    loadData();
  }

  async function toggleActive(item: PricioItems) {
    await supabase.from('pricio_items').update({ is_active: !item.is_active }).eq('id', item.id);
    loadData();
  }

  const groupedItems = categories.map(cat => ({
    category: cat,
    items: items.filter(i => i.category_id === cat.id),
  }));
  const uncategorized = items.filter(i => !i.category_id);

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Items & Services
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your price list items</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add item
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-700">No items yet</p>
          <p className="text-sm text-slate-500 mt-1 mb-5">Add your services and products with prices</p>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add first item
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedItems.filter(g => g.items.length > 0).map(({ category, items: catItems }) => (
            <div key={category.id}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{category.name}</h3>
              <div className="space-y-2">
                {catItems.map(item => <ItemRow key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} onToggle={toggleActive} deleteId={deleteId} />)}
              </div>
            </div>
          ))}
          {uncategorized.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Uncategorized</h3>
              <div className="space-y-2">
                {uncategorized.map(item => <ItemRow key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} onToggle={toggleActive} deleteId={deleteId} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit item' : 'Add item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {/* Image */}
            <div
              className="w-full h-32 rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden"
              onClick={() => fileRef.current?.click()}
            >
              {formImagePreview ? (
                <Image src={formImagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            <div className="space-y-2">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. Haircut, Espresso..." value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Optional description..." value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price <span className="text-red-500">*</span></Label>
                <Input type="number" placeholder="0.00" step="0.01" min="0" value={formPrice} onChange={e => setFormPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formCategoryId || "none"} onValueChange={setFormCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active (visible on public page)</Label>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formName.trim() || !formPrice}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemRow({
  item,
  onEdit,
  onDelete,
  onToggle,
  deleteId,
}: {
  item: PricioItems;
  onEdit: (i: PricioItems) => void;
  onDelete: (id: string) => void;
  onToggle: (i: PricioItems) => void;
  deleteId: string | null;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-4 group hover:border-slate-300 transition-colors">
      {item.image_url ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-slate-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">{item.name}</p>
        {item.description && <p className="text-xs text-slate-500 truncate">{item.description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-800 text-sm">${Number(item.price).toFixed(2)}</span>
        <Badge variant={item.is_active ? 'default' : 'secondary'} className={item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
          {item.is_active ? 'Active' : 'Hidden'}
        </Badge>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600" onClick={() => onEdit(item)}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600" onClick={() => onDelete(item.id)} disabled={deleteId === item.id}>
          {deleteId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </div>
  );
}
