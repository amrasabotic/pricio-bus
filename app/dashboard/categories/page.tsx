'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import type { PricioBusinesses, PricioCategories } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<PricioBusinesses | null>(null);
  const [categories, setCategories] = useState<PricioCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<PricioCategories | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

    const { data: cats } = await supabase
      .from('pricio_categories')
      .select('*')
      .eq('business_id', biz.id)
      .order('order_index', { ascending: true });
    setCategories(cats ?? []);
    setLoading(false);
  }

  function openCreate() {
    setEditCategory(null);
    setCategoryName('');
    setDialogOpen(true);
  }

  function openEdit(cat: PricioCategories) {
    setEditCategory(cat);
    setCategoryName(cat.name);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!business || !categoryName.trim()) return;
    setSaving(true);

    if (editCategory) {
      const { error } = await supabase
        .from('pricio_categories')
        .update({ name: categoryName.trim() })
        .eq('id', editCategory.id);
      if (error) { toast.error(error.message); }
      else { toast.success('Category updated'); }
    } else {
      const maxOrder = categories.reduce((m, c) => Math.max(m, c.order_index), -1);
      const { error } = await supabase
        .from('pricio_categories')
        .insert({ business_id: business.id, name: categoryName.trim(), order_index: maxOrder + 1 });
      if (error) { toast.error(error.message); }
      else { toast.success('Category created'); }
    }

    setSaving(false);
    setDialogOpen(false);
    loadData();
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    const { error } = await supabase.from('pricio_categories').delete().eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Category deleted');
    setDeleteId(null);
    loadData();
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600" />
            Categories
          </h1>
          <p className="text-slate-500 text-sm mt-1">Organize your items into categories</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add category
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-700">No categories yet</p>
          <p className="text-sm text-slate-500 mt-1 mb-5">Create categories to organize your items</p>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Create first category
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex items-center gap-3 group hover:border-slate-300 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
              <Tag className="w-4 h-4 text-blue-500" />
              <span className="flex-1 font-medium text-slate-800">{cat.name}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                  onClick={() => openEdit(cat)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleteId === cat.id}
                >
                  {deleteId === cat.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCategory ? 'Edit category' : 'Create category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category name</Label>
              <Input
                id="cat-name"
                placeholder="e.g. Hair Services, Beverages..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving || !categoryName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
