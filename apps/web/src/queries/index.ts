import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from 'shared';

export type Client = SupabaseClient<Database>