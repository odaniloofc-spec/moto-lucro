import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzjjwiblfmhkkdklimac.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6amp3aWJsZm1oa2tka2xpbWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzM2OTYsImV4cCI6MjA3MzQ0OTY5Nn0.sU7vyMsDXvXkpKH72-y45KrqFX5h7Sl2rwkFDOiAi20'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do MotoLucro
export interface Transaction {
  id: string;
  value: number;
  type: "gain" | "expense";
  category?: string;
  company?: string;
  date: string; // ISO string para Supabase
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  goal_amount?: number;
  created_at?: string;
  updated_at?: string;
}
