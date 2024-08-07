'use client'
import { DeleteDialog } from '@/components/delete-dialog';
import { createClient } from '@/utils/supabase/client';
import { type Job, type Note } from 'lib/types';
import { type HTMLAttributes } from 'react';
import { cn } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useNotes } from 'src/hooks/useNotes';
import { Spinner } from 'ui/spinner';
import NoteItem from './note-item';

interface NoteListProps extends HTMLAttributes<HTMLElement> {
    job: Job
}

function NotesList({ job, ...rest }: NoteListProps) {
    const client = createClient();
    const { data, refetch, isLoading } = useNotes({ jobId: job.id })
    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen,
        loading: isDeleting
    } = useDeleteModal<Note>({
        onDelete: async (id: string) => {
            const { error } = await client.from('notes').delete().eq('id', id)
            if (error) throw error;
        },
        refresh: async () => { await refetch() }
    })

    if (isLoading) {
        return (
            <div className="flex">
                <Spinner className="m-auto mt-4" />
            </div>
        )
    }

    return (
        <section {...rest} className={cn('flex flex-col', data?.length && 'border border-b-0 rounded-md')}>
            {data?.map((note, idx) => (
                <NoteItem
                    note={note}
                    key={idx}
                    className="border-b"
                    showDeleteDialog={showDeleteDialog}
                />
            ))}

            <DeleteDialog
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