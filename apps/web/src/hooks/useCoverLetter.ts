import { updateCoverLetter } from '@/actions/job';
import { useToast } from '@/components/toast/use-toast';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type CoverLetter } from 'lib/types';
import { useCallback, useState } from 'react';

/**
 * Hook for providing cover letter functionality
 * @param job 
 * @param coverLetter 
 * @returns 
 */
export function useCoverLetter({ jobId, coverLetter }: { jobId: string, coverLetter: CoverLetter }) {
    const client = createClient()
    const [value, setValue] = useState(coverLetter.text ?? '')
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    /** function to persist cover letter text */
    const saveValueDebounced = debounce(async (text: string) => {
        setSaving(true);
        const { data: { user } } = await client.auth.getUser();
        if (!user) return;
        const { error } = await updateCoverLetter({ ...coverLetter, text }, user.id, jobId)
        if (error) throw error;
    }, 2000);

    const saveValue = useCallback(saveValueDebounced, [client, jobId])

    /** handle cover letter change event */
    const onChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        try {
            await saveValue(event.target.value);
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save cover letter',
                variant: 'destructive'
            })
        } finally {
            setSaving(false);
        }
    };

    return { value, saving, onChange, setValue, saveValue }
}