import { supabase } from './supabase/client';

type EventType = 'view' | 'whatsapp_click' | 'call_click';

export async function trackEvent(businessId: string, eventType: EventType): Promise<void> {
  try {
    await supabase.from('pricio_analytics').insert({
      business_id: businessId,
      event_type: eventType,
      metadata: {
        page: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    // Non-blocking - analytics failures should never affect UX
  }
}
