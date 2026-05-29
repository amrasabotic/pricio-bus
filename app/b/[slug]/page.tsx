import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import PublicBusinessPage from './public-page';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: business } = await supabase
    .from('pricio_businesses')
    .select('name, category, logo_url')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .maybeSingle();

  if (!business) {
    return { title: 'Business Not Found | Pricio' };
  }

  return {
    title: `${business.name} — Price List | Pricio`,
    description: `View the price list for ${business.name}. ${business.category} services and products.`,
    openGraph: {
      title: `${business.name} — Price List`,
      description: `View the price list for ${business.name}`,
      images: business.logo_url ? [{ url: business.logo_url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} — Price List`,
      images: business.logo_url ? [business.logo_url] : [],
    },
  };
}

export default async function BusinessSlugPage({ params }: Props) {
  const supabase = createServerClient();

  const { data: business } = await supabase
    .from('pricio_businesses')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .maybeSingle();

  if (!business) {
    notFound();
  }

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from('pricio_categories')
      .select('*')
      .eq('business_id', business.id)
      .order('order_index'),
    supabase
      .from('pricio_items')
      .select('*')
      .eq('business_id', business.id)
      .eq('status', 'active')
      .order('order_index'),
  ]);

  return (
    <PublicBusinessPage
      business={business}
      categories={categories ?? []}
      items={items ?? []}
    />
  );
}
