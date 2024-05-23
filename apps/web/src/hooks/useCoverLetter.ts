import { useToast } from '@/components/toast/use-toast';
import { type Client } from '@/queries';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type CoverLetter } from 'lib/types';
import { useCallback, useEffect, useState } from 'react';

type OnSave = (client: Client, jobId: string, coverLetter: CoverLetter, text: string) => Promise<void>
/**
 * Hook for providing cover letter functionality
 * @param job 
 * @param coverLetter 
 * @returns 
 */
export function useCoverLetter({ jobId, coverLetter, onSave }: { jobId: string, coverLetter: CoverLetter, onSave: OnSave }) {
    const client = createClient()
    const [value, setValue] = useState(coverLetter.text ?? '')
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    /** function to persist cover letter text */
    const saveValueDebounced = debounce(async (text: string) => {
        setSaving(true);
        try {
            await onSave(client, jobId, coverLetter, text)
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save cover letter',
                variant: 'destructive'
            })
        } finally {
            setSaving(false)
        }
    }, 2000);

    const saveValue = useCallback(saveValueDebounced, [client, jobId])

    useEffect(() => {
        saveValue(value)
    }, [value, saveValue, toast])

    return { value, saving, setValue, saveValue }
}