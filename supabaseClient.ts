import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file or Vercel environment settings.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
}

// Create client even if vars are missing (will fail gracefully later)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types for type safety
export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          reimbursement_amt: number;
          reimbursed_amt: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          reimbursement_amt?: number;
          reimbursed_amt?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          reimbursement_amt?: number;
          reimbursed_amt?: number;
          updated_at?: string;
        };
      };
      bills: {
        Row: {
          id: string;
          date: string;
          from: string;
          to: string;
          reason: string;
          amount: number;
          profit: number;
          amount_shared_by: string[];
          paid_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          from: string;
          to: string;
          reason: string;
          amount: number;
          profit: number;
          amount_shared_by: string[];
          paid_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          from?: string;
          to?: string;
          reason?: string;
          amount?: number;
          profit?: number;
          amount_shared_by?: string[];
          paid_by?: string;
          updated_at?: string;
        };
      };
      settlements: {
        Row: {
          id: string;
          date: string;
          from_member_id: string;
          to_member_id: string;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          from_member_id: string;
          to_member_id: string;
          amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          from_member_id?: string;
          to_member_id?: string;
          amount?: number;
          updated_at?: string;
        };
      };
    };
  };
};
