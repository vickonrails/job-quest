'use server'

import { env } from '@/env.mjs';

export async function addUserToWaitList(user: { email: string, firstName: string }) {
    const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.LOOPS_API_KEY as string}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    try {
        const response = await fetch('https://app.loops.so/api/v1/contacts/create', options)
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage: string = errorData.error || errorData.message || response.statusText;
            throw new Error(errorMessage);
        }
        return { success: true }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: 'An error occurred' }
    }
}