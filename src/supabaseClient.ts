import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjlabydgfqyiwabgvkfo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbGFieWRnZnF5aXdhYmd2a2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjY2MzMsImV4cCI6MjA2ODE0MjYzM30.Yl6_bo9XGygxD52IFrJvZGjnKf8XbE3l7jytfzVYPrg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
