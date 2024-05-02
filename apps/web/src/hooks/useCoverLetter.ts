import { useToast } from '@components/toast/use-toast';
import { createClient } from '@lib/supabase/component';
import { type CoverLetter, type Job } from '@lib/types';
import { type User } from '@supabase/supabase-js';
import { debounce } from '@utils/debounce';
import { useCallback, useState } from 'react';

/**
 * Hook for providing cover letter functionality
 * @param job 
 * @param coverLetter 
 * @returns 
 */
export function useCoverLetter({ job, coverLetter, user }: { job: Job, coverLetter: CoverLetter, user: User }) {
    const client = createClient()
    const [value, setValue] = useState(coverLetter.text ?? '')
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    /** function to persist cover letter text */
    const saveValue = useCallback(
        debounce(async (text: string) => {
            if (!job.cover_letter_id) return
            const { error } = await client.from('cover_letters').upsert({
                id: job.cover_letter_id,
                user_id: user.id,
                text
            });

            if (error) throw error;
        }, 1500),
        [job.cover_letter_id, client]
    );

    /** handle cover letter change event */
    const onChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        try {
            setSaving(true);
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