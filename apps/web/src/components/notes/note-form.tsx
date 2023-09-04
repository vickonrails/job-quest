import { Button } from '@components/button';
import { Textarea } from '@components/textarea';
import { useToast } from '@components/toast/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Database } from 'lib/database.types';
import { type NoteInsertDTO, type Job } from 'lib/types';
import { useState } from 'react';

function NoteForm({ job }: { job: Job }) {
    const [note, setNote] = useState('')
    const { toast } = useToast()
    const client = useSupabaseClient<Database>();
    const queryClient = useQueryClient()

    // TODO: error handling
    const { mutateAsync, isLoading: isAddingNotes } = useMutation({
        mutationFn: async (data: NoteInsertDTO) => {
            const { error } = await client.from('notes').insert(data)
            if (error) throw error;
        },
        // TODO: might want to use query.setQueryData here too
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', job.id] })
    })

    const canSubmit = note.trim();

    const handleCreateNote = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!canSubmit) return;
        try {
            await mutateAsync({
                text: note,
                jobid: job.id,
                status: job.status
            })
            setNote('');
            toast({
                variant: 'success',
                title: 'Note added',
            })
        } catch (err) {
            alert('Error')
            // do I still need to do all the error things? Or does the react-query library do that for me?
        }
    }

    return (
        <form onSubmit={handleCreateNote} className="flex flex-col gap-4">
            <Textarea value={note} required onChange={val => setNote(val.target.value)} />
            <Button loading={isAddingNotes} disabled={!canSubmit}>Add notes</Button>
        </form>
    )
}

export default NoteForm