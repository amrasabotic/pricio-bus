export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'user' | 'superadmin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'user' | 'superadmin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'user' | 'superadmin';
          created_at?: string;
        };
      };
      user_app_access: {
        Row: {
          id: string;
          user_id: string;
          app_id: string;
          status: 'active' | 'inactive';
          plan: string;
          expires_at: string | null;
          stripe_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_id: string;
          status?: 'active' | 'inactive';
          plan?: string;
          expires_at?: string | null;
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_id?: string;
          status?: 'active' | 'inactive';
          plan?: string;
          expires_at?: string | null;
          stripe_session_id?: string | null;
          created_at?: string;
        };
      };
      pricio_businesses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          category: string;
          logo_url: string | null;
          phone: string | null;
          whatsapp: string | null;
          location: string | null;
          status: 'active' | 'inactive';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          category: string;
          logo_url?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          location?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          category?: string;
          logo_url?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          location?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
      };
      pricio_categories: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      pricio_items: {
        Row: {
          id: string;
          business_id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          status: 'active' | 'inactive';
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          status?: 'active' | 'inactive';
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          status?: 'active' | 'inactive';
          order_index?: number;
          created_at?: string;
        };
      };
      pricio_analytics: {
        Row: {
          id: string;
          business_id: string;
          event_type: 'view' | 'whatsapp_click' | 'call_click';
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          event_type: 'view' | 'whatsapp_click' | 'call_click';
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          event_type?: 'view' | 'whatsapp_click' | 'call_click';
          metadata?: Json;
          created_at?: string;
        };
      };
      pricio_admin_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      pricio_system_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserAppAccess = Database['public']['Tables']['user_app_access']['Row'];
export type PricioBusinesses = Database['public']['Tables']['pricio_businesses']['Row'];
export type PricioCategories = Database['public']['Tables']['pricio_categories']['Row'];
export type PricioItems = Database['public']['Tables']['pricio_items']['Row'];
export type PricioAnalytics = Database['public']['Tables']['pricio_analytics']['Row'];
export type PricioAdminLogs = Database['public']['Tables']['pricio_admin_logs']['Row'];
