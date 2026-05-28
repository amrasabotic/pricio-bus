'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import type { PricioBusinesses, PricioCategories, PricioItems } from '@/lib/supabase/types';
import { Phone, MessageCircle, MapPin, Tag, Package, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Props {
  business: PricioBusinesses;
  categories: PricioCategories[];
  items: PricioItems[];
}

export default function PublicBusinessPage({ business, categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    trackEvent(business.id, 'view');
  }, [business.id]);

  function handleWhatsApp() {
    trackEvent(business.id, 'whatsapp_click');
    const num = business.whatsapp?.replace(/\D/g, '');
    window.open(`https://wa.me/${num}`, '_blank');
  }

  function handleCall() {
    trackEvent(business.id, 'call_click');
    window.location.href = `tel:${business.phone}`;
  }

  const groupedItems = [
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      items: items.filter(i => i.category_id === cat.id),
    })),
  ].filter(g => g.items.length > 0);

  const uncategorized = items.filter(i => !i.category_id);
  if (uncategorized.length > 0) {
    groupedItems.push({ id: 'uncategorized', name: 'Other', items: uncategorized });
  }

  const displayedGroups = activeCategory
    ? groupedItems.filter(g => g.id === activeCategory)
    : groupedItems;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          {business.logo_url ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 shadow-sm border border-slate-100">
              <Image src={business.logo_url} alt={`${business.name} logo`} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xl font-bold">{business.name[0]}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{business.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs font-medium">{business.category}</Badge>
              {business.location && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {business.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact actions */}
        {(business.whatsapp || business.phone) && (
          <div className="max-w-2xl mx-auto px-4 pb-4 flex gap-2">
            {business.whatsapp && (
              <Button
                onClick={handleWhatsApp}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white gap-1.5 flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            )}
            {business.phone && (
              <Button
                onClick={handleCall}
                size="sm"
                variant="outline"
                className="gap-1.5 flex-1 border-slate-200"
              >
                <Phone className="w-4 h-4" />
                Call us
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Category filter pills */}
      {groupedItems.length > 1 && (
        <div className="bg-white border-b border-slate-100 sticky top-[88px] sm:top-[96px] z-30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {groupedItems.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveCategory(g.id === activeCategory ? null : g.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === g.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-16">
        {displayedGroups.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No items available yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayedGroups.map(group => (
              <section key={group.id}>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <h2 className="text-base font-bold text-slate-800">{group.name}</h2>
                  <span className="text-xs text-slate-400">({group.items.length})</span>
                </div>
                <div className="space-y-3">
                  {group.items.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-1.5">
          <span className="text-xs text-slate-400">Powered by</span>
          <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
            <BarChart3 className="w-3.5 h-3.5" />
            Pricio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: PricioItems }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-4 p-4">
        {item.image_url ? (
          <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0 bg-slate-100">
            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 leading-snug">{item.name}</h3>
            <span className="font-bold text-blue-600 text-lg flex-shrink-0">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
