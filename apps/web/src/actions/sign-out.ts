'use server'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/auth');
};