import { useToast } from '@components/toast/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Database } from 'lib/database.types';
import { type Job, type NoteInsertDTO } from 'lib/types';
import { useState } from 'react';
import { Button, Textarea } from 'ui';

function NoteForm({ job }: { job: Job }) {
    const [note, setNote] = useState('')
    const { toast } = useToast()
    const client = useSupabaseClient<Database>();
    const queryClient = useQueryClient()

    // TODO: error handling
    const { mutateAsync, isLoading: isAddingNotes } = useMutation({
        mutationFn: async (note: NoteInsertDTO) => {
            const { data, error } = await client.from('notes').insert(note).select('*');
            if (error) throw error;
            return data
        },
        // TODO: might want to use query.setQuery   Data here too
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notes', job.id] })
        }
    })

    const handleCreateNote = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!note) return;
        try {
            await mutateAsync({
                text: note,
                job_id: job.id,
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
        <form onSubmit={handleCreateNote} className="flex flex-col gap-4 items-start">
            <Textarea value={note} required onChange={val => setNote(val.target.value)} containerClasses="w-full" />
            <Button variant="outline" loading={isAddingNotes}>Add notes</Button>
        </form>
    )
}

export default NoteForm