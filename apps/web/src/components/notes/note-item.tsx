import { useToast } from '@components/toast/use-toast'
import { formatDate } from '@components/utils'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@utils/cn'
import { type Database } from 'lib/database.types'
import { type Note, type NoteUpdateDTO } from 'lib/types'
import React, { useCallback, useState, type HTMLAttributes } from 'react'
import { Trash } from 'react-feather'
import { Button, Textarea } from 'ui'

interface NoteItemProps extends HTMLAttributes<HTMLElement> {
    /** note to edit */
    note: Note
    /** function for launching the delete dialog from the note list */
    showDeleteDialog: (note: Note) => void
}

function NoteItem({ note, className, showDeleteDialog, ...rest }: NoteItemProps) {
    const [isEditing, setIsEditing] = useState(false)

    /** function for exiting editing mode */
    const onCancelClick = useCallback(() => {
        setIsEditing(false)
    }, [])

    /** function for switching to editing mode */
    const switchEditView = useCallback(() => {
        if (isEditing) return;
        setIsEditing(true)
    }, [isEditing])

    return (
        <article
            key={note.id}
            className={cn('p-3 cursor-pointer group relative', className)}
            onClick={switchEditView}
            {...rest}
        >
            {isEditing ?
                <NoteForm note={note} onCancel={onCancelClick} /> :
                <NoteText note={note} showDeleteDialog={showDeleteDialog} />
            }
        </article>
    )
}

/**
 * Renders the note list item text and status
 */
function NoteText({ note, showDeleteDialog }: { note: Note, showDeleteDialog: (note: Note) => void }) {
    return (
        <>
            <p className="leading-tight text-sm mb-2" >{note.text}</p>
            {note.created_at && <p className="text-sm text-gray-400">{formatDate(note.created_at)}</p>}
            <button
                onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                    ev.stopPropagation();
                    showDeleteDialog(note)
                }}
                className="hidden group-hover:block absolute top-3 right-3"
            >
                <Trash size={16} className="text-gray-700" />
            </button>
        </>
    )
}

// TODO: I can experiment with react-query optimistic updates here
/** responsible for handling the edit mode */
function NoteForm({ note, onCancel }: { note: Note, onCancel: () => void }) {
    const [text, setText] = useState(note.text);
    const queryClient = useQueryClient();
    const client = useSupabaseClient<Database>();
    const { toast } = useToast()

    // TODO: extract this into a separate hook
    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async (data: NoteUpdateDTO) => {
            const { error } = await client.from('notes').update(data).eq('id', note.id)
            if (error) throw error
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', note.job_id] })
    })

    const canSubmit = text.trim();

    const onUpdateSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!canSubmit) return;
        try {
            await mutateAsync({
                ...note,
                text
            })
            toast({
                variant: 'success',
                title: 'Note updated',
            })
            onCancel();
        } catch {
            // TODO: handle error
        }
    }

    return (
        <form onSubmit={onUpdateSubmit}>
            <Textarea value={text} onChange={ev => setText(ev.target.value)} className="mb-2" autoFocus />

            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" type="button" onClick={onCancel}>Cancel</Button>
                <Button variant="destructive" size="sm" loading={isLoading}>Update</Button>
            </div>
        </form>
    )
}

export default NoteItem