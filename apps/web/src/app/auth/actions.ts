'use server'

import { createClient } from '@/utils/supabase/server'

export async function authenticate(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const { email } = {
        email: formData.get('email') as string,
    }

    const { error } = await supabase.auth.signInWithOtp({
        email, options: {
            shouldCreateUser: true,
            emailRedirectTo: 'http://localhost:3000/api/auth/confirm'
        }
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}