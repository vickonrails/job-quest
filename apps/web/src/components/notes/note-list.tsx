import { AlertDialog } from '@components/alert-dialog';
import { Spinner } from '@components/spinner';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Note, type Job } from 'lib/types';
import React, { type HTMLAttributes } from 'react'
import { useRowDelete } from 'src/hooks/useDeleteModal';
import { useNotes } from 'src/hooks/useNotes';
import NoteItem from './note-item';
import { cn } from '@utils/cn';

interface NoteListProps extends HTMLAttributes<HTMLElement> {
    job: Job
}

function NotesList({ job, ...rest }: NoteListProps) {
    const client = useSupabaseClient<Database>();
    const { data: notes, isLoading, refetch } = useNotes({ jobId: job.id })
    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen,
        loading: isDeleting
    } = useRowDelete<Note>({
        onDelete: async (id: string) => {
            const { error } = await client.from('notes').delete().eq('id', id)
            if (error) throw error;
        },
        refresh: async () => { await refetch() }
    })

    if (isLoading) return <Spinner />

    return (
        <section {...rest} className={cn('flex flex-col', notes?.length && 'border rounded-md')}>
            {notes?.map((note, idx) => (
                <NoteItem
                    note={note}
                    key={idx}
                    className={cn(idx + 1 !== notes.length && 'border-b')}
                    showDeleteDialog={showDeleteDialog}
                />
            ))}

            <AlertDialog
                open={deleteModalOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this note?"
                onOk={handleDelete}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
                isProcessing={isDeleting}
            />
        </section>
    )
}

export default NotesList