import Link from 'next/link';
import { BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BusinessNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Business not found</h1>
      <p className="text-slate-500 max-w-sm mb-8">
        This price list page doesn&apos;t exist or the business may have been deactivated.
      </p>
      <Link href="/">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <BarChart3 className="w-4 h-4" />
          Go to Pricio
        </Button>
      </Link>
    </div>
  );
}
